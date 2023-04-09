const router = require("express").Router();
const asyncLock = require("async-lock");
const multer = require("multer");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const moment = require("moment");
const mongoose = require("mongoose");

const Reservation = require("../models/Reservation");
const Room = require("../models/Room");
const User = require("../models/User");
const RoomReservation = require("../models/RoomReservation");

const upload = multer({ dest: "uploads/" });

router.post("/", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const lock = new asyncLock();
  const { roomId, userId, checkin, checkout, numberRooms, total } = req.body;

  try {
    if (numberRooms != roomId.length) {
      res.status(422).json({
        message: "O número de quartos não está de acordo com o da reserva",
      });
      return;
    }

    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);

    if (isNaN(checkinDate.getTime()) || isNaN(checkoutDate.getTime())) {
      res.status(422).json({ message: "Data Inválida" });
      return;
    }

    if (checkinDate > checkoutDate) {
      res.status(422).json({
        message: "A data de check-in precisa ser menor que a de check-out",
      });
      return;
    }

    const roomPrices = await Room.find({ _id: { $in: roomId } }, { price: 1 });
    let reservationCost = await calculateTotalCost(
      roomPrices,
      checkin,
      checkout
    );

    if (!reservationCost) {
      res
        .status(422)
        .json({ message: "Não foi possível calcular o valor da reserva" });
      return;
    }

    let paid = false;

    const user = await User.findById(userId).session(session);
    if (!user) {
      res.status(404).json({ message: "Usuário não encontrado" });
      return;
    }

    if (user.wallet > reservationCost) {
      user.wallet -= reservationCost;

      const updatedUser = await user.save();

      if (!updatedUser) {
        res.status(422).json({ message: "Falha ao atualizar usuário" });
        return;
      }

      paid = true;
    }

    if (user.wallet > 0 && user.wallet < reservationCost) {
      reservationCost = reservationCost - user.wallet;

      user.wallet = 0;

      const updatedUser = await user.save();

      if (!updatedUser) {
        res.status(422).json({ message: "Falha ao atualizar usuário" });
        return;
      }
    }

    const reservation = {
      roomId,
      userId,
      checkin,
      checkout,
      numberRooms,
      total: reservationCost,
      payment: paid,
    };

    const roomReservation = {
      roomId,
      userId,
      checkin,
      checkout,
    };

    const release = await lock.acquire(`room-${roomId}`, async (release) => {
      const isAvailable = await checkRoomsAvailability(
        roomId,
        checkin,
        checkout
      );

      if (!isAvailable) {
        res.status(422).json({
          message: "Um dos quartos não pode ser reservado",
        });
        return;
      }

      const createdReservation = await Reservation.create([reservation], {
        session,
      });

      for (const id of roomId) {
        const roomReservation = {
          roomId: id,
          userId,
          checkin,
          checkout,
          reservationId: createdReservation[0]._id,
        };

        const createdRoomReservation = await RoomReservation.create(
          [roomReservation],
          {
            session,
          }
        );
      }

      const updatedUser = await User.updateOne(
        { _id: userId },
        { $push: { reservationId: createdReservation[0]._id } }
      )
        .session(session)
        .exec();

      if (!updatedUser.acknowledged) {
        res.status(422).json({
          message: "Falha ao atualizar usuário",
        });
        return;
      }

      await session.commitTransaction();
      session.endSession();
      release();
      res.status(201).json({ message: "Reserva feita com sucesso!" });
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    res.status(500).json({ erro: error.message });
  }
});

async function calculateTotalCost(roomIds, checkin, checkout) {
  let totalCost = 0;
  for (const roomId of roomIds) {
    const room = await Room.findById(roomId);
    if (!room) {
      throw new Error(`Quarto com o ID ${roomId} não encontrado`);
    }

    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);

    if (isNaN(checkinDate.getTime()) || isNaN(checkoutDate.getTime())) {
      return false;
    }
    const nights = Math.ceil(
      (checkoutDate - checkinDate) / (1000 * 60 * 60 * 24)
    );
    const roomCost = nights * room.price;
    totalCost += roomCost;
  }

  return totalCost;
}

const checkRoomsAvailability = async (roomId, checkin, checkout) => {
  const checkinDate = new Date(checkin);
  const checkoutDate = new Date(checkout);
  if (isNaN(checkinDate.getTime()) || isNaN(checkoutDate.getTime())) {
    return false;
  }

  const reservations = await RoomReservation.find({
    roomId: { $in: roomId },
    $or: [
      { checkin: { $eq: null }, checkout: { $eq: null } },
      {
        $and: [
          { checkin: { $lt: checkoutDate } },
          { checkout: { $gt: checkinDate } },
        ],
      },
    ],
  });

  return reservations.length === 0;
};

//UPLOAD

router.patch("/:id/payment", upload.single("upload"), async (req, res) => {
  const { id } = req.params;
  const { filename } = req.file;

  try {
    const reservation = await Reservation.findOne({ _id: id });

    reservation.uploadPayment = filename;
    reservation.payment = true;

    const updated = await Reservation.updateOne({ _id: id }, reservation);

    if (updated.matchedCount === 0) {
      res.status(422).json({ message: "Reserva não encontrada" });
      return;
    }
    await generateReservationPDF(reservation);
    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

const generateReservationPDF = async (reservation, res) => {
  const user = await User.findOne({ _id: reservation.userId });
  if (!user) {
    res.status(404).json({ message: "Usuário não encontrado" });
    return;
  }

  const doc = new PDFDocument({
    size: "A4",
    margin: 50,
  });

  const filePath = `reservations/reservation_${reservation._id}.pdf`;

  const writeStream = fs.createWriteStream(filePath);
  doc.pipe(writeStream);

  doc.on("error", (err) => {
    console.error(`Erro ao gerar PDF da reserva ${reservation._id}: ${err}`);
    writeStream.end();
  });

  const distanceMargin = 3;
  doc
    .fillAndStroke("#1C2025")
    .lineWidth(5)
    .rect(
      distanceMargin,
      distanceMargin,
      doc.page.width - distanceMargin * 2,
      doc.page.height - distanceMargin * 2
    )
    .stroke();

  // Imagem do cabeçalho
  doc.image("image/logo.png", {
    fit: [500, 200],
    align: "center",
  });

  // Título do voucher
  doc.fontSize(24).font("Helvetica-Bold").text("Hotel Hurst Capital", {
    align: "center",
    marginTop: 40,
  });
  doc.moveDown(2);

  // Define a fonte do documento
  doc.font("Helvetica");

  // Insere as labels em negrito
  doc.fontSize(16).font("Helvetica-Bold");
  doc.text("Dados da Reserva", {
    align: "center",
    characterSpacing: 2,
    margin: 50,
  });

  doc.moveDown(2);
  doc.font("Helvetica-Bold").fontSize(14).text(`Nome:  `, { continued: true });
  doc.font("Helvetica").text(`${user.name} ${user.surname}`);
  doc.moveDown();

  doc
    .font("Helvetica-Bold")
    .fontSize(14)
    .text(`Data de check-in:  `, { continued: true });
  doc
    .font("Helvetica")
    .text(`${moment(reservation.checkin).format("DD/MM/YYYY")}`);
  doc.moveDown();
  doc
    .font("Helvetica-Bold")
    .fontSize(14)
    .text(`Data de check-out:  `, { continued: true });
  doc
    .font("Helvetica")
    .text(`${moment(reservation.checkout).format("DD/MM/YYYY")}`);
  doc.moveDown();
  doc
    .font("Helvetica-Bold")
    .fontSize(14)
    .text(`Número de quartos:  `, { continued: true });
  doc.font("Helvetica").text(`${reservation.numberRooms}`);
  doc.moveDown();
  doc
    .font("Helvetica-Bold")
    .fontSize(14)
    .text(`Valor total:  `, { continued: true });
  doc.font("Helvetica").text(`R$ ${reservation.total.toFixed(2)}`);
  doc.moveDown(4);

  doc
    .font("Helvetica")
    .fontSize(10)
    .text(
      "Se possível, imprima este documento e apresente-o na hora do check-in.",
      { align: "center" }
    );
  doc.moveDown(12);

  doc.fontSize(12).text("Hotel Hurst Capital | CNPJ: 29.765.165/0001-36", {
    align: "center",
  });
  doc
    .fontSize(10)
    .text("Rua Pedroso Alvarenga, 1284 CJ131, São Paulo, SP, Brasil.", {
      align: "center",
    });
  doc
    .fontSize(8)
    .text("Fone: +55 (11) 4210-7456 | email: investidor@hurst.capital", {
      align: "center",
    });

  doc.end();

  writeStream.on("error", (err) => {
    res.status(500).json({
      erro: `Erro ao escrever PDF da reserva ${reservation._id} no sistema de arquivos: ${err}`,
    });
  });

  writeStream.on("finish", () => {
    console.log(
      `Arquivo PDF da reserva ${reservation._id} gerado com sucesso.`
    );
  });
};

router.get("/:id/download-pdf", async (req, res) => {
  const { id } = req.params;

  try {
    const reservation = await Reservation.findOne({ _id: id });

    if (!reservation) {
      res.status(404).json({ message: "Reserva não encontrada" });
      return;
    }

    const filePath = `reservations/reservation_${reservation._id}.pdf`;
    const readStream = fs.createReadStream(filePath);

    res.setHeader(
      "Content-disposition",
      `attachment; filename=reservation_${reservation._id}.pdf`
    );
    res.setHeader("Content-type", "application/pdf");

    readStream.pipe(res);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

module.exports = router;

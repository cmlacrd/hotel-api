const router = require("express").Router();
const Room = require("../models/Room");

//CREATE
router.post("/", async (req, res) => {
  const { name, price } = req.body;

  const room = {
    name,
    price,
  };

  try {
    if (!name) {
      res.status(422).json({ message: "Nome do quarto obrigatório" });
      return;
    }
    await Room.create(room);

    res
      .status(201)
      .json({ message: "Quarto inserido no sistema com sucesso!" });
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

//READ
router.get("/", async (req, res) => {
  try {
    const rooms = await Room.find();

    if (!rooms) {
      res.status(422).json({ message: "Quartos não encontrados" });
      return;
    }

    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const room = await Room.findOne({ _id: id });

    if (!room) {
      res.status(422).json({ message: "Quarto não encontrado" });
      return;
    }

    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

//UPDATE
router.patch("/:id", async (req, res) => {
  const id = req.params.id;
  const { name, price } = req.body;

  const room = {
    name,
    price,
  };

  try {
    const updated = await Room.updateOne({ _id: id }, room);

    if (updated.matchedCount === 0) {
      res.status(422).json({ message: "Quarto não encontrado" });
      return;
    }

    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

//DELETE

router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  const room = await Room.findOne({ _id: id });

  if (!room) {
    res.status(422).json({ message: "Quarto não encontrado" });
    return;
  }

  try {
    const room = await Room.deleteOne({ _id: id });

    res.status(200).json({ message: "Quarto deletado com sucesso!" });
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

module.exports = router;

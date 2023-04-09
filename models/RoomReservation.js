const mongoose = require("mongoose");

const roomReservationSchema = new mongoose.Schema({
  reservationId: {
    type: String,
    required: true,
  },
  roomId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  checkout: {
    type: Date,
    required: true,
  },
  checkin:{
    type: Date,
    required: true,
  }
});

const RoomReservation = mongoose.model("RoomReservation", roomReservationSchema);

module.exports = RoomReservation;

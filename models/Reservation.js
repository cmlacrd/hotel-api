const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  roomId: {
    type: Array,
    required: true,
  },
  userId:{
    type: String,
    required: true,
  },
  checkin: {
    type: Date,
    required: true,
  },
  checkout: {
    type: Date,
    required: true,
  },
  numberRooms: {
    type: Number,
    required: true,
  },
  payment: {
    type: Boolean,
    default: false
  },
  uploadPayment: {
    type: String,
    default: "",
  },
  total:{
    type: Number,
    default: 0,
  }
});

const Reservation = mongoose.model("Reservation", reservationSchema);

module.exports = Reservation;

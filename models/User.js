const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  reservationId: {
    type: Array,
    default: [],
  },
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  wallet: {
    type: Number,
    default: 0,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;

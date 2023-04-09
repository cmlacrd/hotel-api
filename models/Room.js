const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price:{
    type: Number,
    required: true,
  }
});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;

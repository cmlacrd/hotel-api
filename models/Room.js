const mongoose = require('mongoose')

const Room = mongoose.model('Room', {
  avaiable: Boolean,
  type: String
})

module.exports = Room
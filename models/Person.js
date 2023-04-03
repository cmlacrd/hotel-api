const mongoose = require('mongoose')

const Person = mongoose.model('Person', {
  name: String,
  checkin: String,
  checkout: String,
  payment: String,
  balance: Number
})

module.exports = Person
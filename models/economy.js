const mongoose = require("mongoose")

const ecoSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userid: String,
  job: String,
  balance: Number,
  bankBalance: Number,
  bankSpace: Number,
  minAmount: Number,
  maxAmount: Number,
  searchTime: Number,
  workTime: Number,
  workSucceed: Number,
  workName: String,
  workHas: Boolean
});

module.exports = mongoose.model('Economy', ecoSchema, 'eco');
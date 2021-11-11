const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstname: {
    type: String,
    required: true,
  },
  secondname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
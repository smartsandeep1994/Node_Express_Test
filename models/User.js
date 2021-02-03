const mongoose = require('mongoose');

const User = new mongoose.Schema({
    first_name: {
      type: String
    },
    last_name: {
      type: String
    },
    email: {
      type: String
    },
    password: {
      type: String
    },
    invite_code: {
      type: String
    },
    referal_code: {
      type: String
    },
    point: {
      type: Number
    },
    role: {
      type: String
    }
});
module.exports = mongoose.model("user",User);
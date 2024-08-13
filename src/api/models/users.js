const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  authentication: {
    password: { type: String, required: true, select: false },
    salt: { type: String, required: false, select: false },
    sessionToken: { type: String, select: false },
  },
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = { UserModel };

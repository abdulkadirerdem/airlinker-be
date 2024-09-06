const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    authentication: {
      password: { type: String, select: false },
      salt: { type: String, select: false },
      sessionToken: { type: String, select: false },
    },
    google: {
      id: { type: String, select: false },
      token: { type: String, select: false },
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", UserSchema);

module.exports = { UserModel };

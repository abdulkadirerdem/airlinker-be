const mongoose = require("mongoose");

const ParticipationInformationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: {
    type: String,
    enum: ["radio", "multiple-choice", "text", "connect-wallet"],
    required: true,
  },
  options: [{ type: String }],
});

const ParticipantResponseSchema = new mongoose.Schema({
  answers: [{ type: mongoose.Schema.Types.Mixed, default: [] }],
});

const RaffleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    participationInformation: [ParticipationInformationSchema],
    participants: [ParticipantResponseSchema],
    winner: { type: mongoose.Schema.Types.Mixed },
    prizeAmount: { type: Number },
    airlink: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Airlink",
      required: true,
    },
  },
  { timestamps: true }
);

const RaffleModel = mongoose.model("Raffle", RaffleSchema);

module.exports = { RaffleModel };

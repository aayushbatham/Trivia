const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      unique: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    role: {
      type: String,
      enum: ["admin", "participant"],
      default: "participant",
    },
    eloRating: { type: Number, default: 1000 },
    quizzesTaken: [{ type: mongoose.Schema.Types.ObjectId, ref: "QuizResult" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

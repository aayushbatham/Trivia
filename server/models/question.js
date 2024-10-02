const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    questionText: { type: String, required: true },
    options: [
      {
        text: { type: String, required: true },
        isCorrect: { type: Boolean, default: false },
      },
    ],
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" }, // Optional if needed for reverse lookup
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);

const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String },
    difficulty: { type: Number, default: 1000 }, // Default difficulty rating
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
    isPublished: { type: Boolean, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quiz", quizSchema);

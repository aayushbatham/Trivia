const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, require: true },
    description: { type: String },
    category: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    questions: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
    isPublished: { type: Boolean, require: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quiz", quizSchema);

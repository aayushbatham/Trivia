const express = require("express");
const checkAdmin = require("../middleware/checkAdmin");
const router = express.Router();
const jwtMiddleware = require("../middleware/jwtMiddleware");
const Quiz = require("../models/quiz");
const User = require("../models/user"); // Ensure to import User model
const Questions = require("../models/question");
const { calculateEloAfterQuiz } = require("../utils/elo");

router.post("/quiz", async (req, res) => {
  const { title, description, category, difficulty } = req.body;
  try {
    const newQuiz = new Quiz({
      title,
      description,
      category,
      difficulty,
      createdBy: req.user._id,
      questions: [],
      isPublished: false,
    });
    await newQuiz.save();
    return res.status(201).json({ message: "Quiz created successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/quiz/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }
    return res.status(200).json(quiz);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/quiz/:id/questions", async (req, res) => {
  const quizId = req.params.id;
  const { question, options } = req.body; // Removed 'answer' since it's part of options
  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }
    const newQuestion = new Questions({ question, options, quiz: quizId });
    await newQuestion.save(); // Save the question first to get its ID
    quiz.questions.push(newQuestion._id);
    await quiz.save();
    return res.status(201).json({
      message: "Question created successfully",
      question: newQuestion,
    });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/quiz/:id/result", async (req, res) => {
  const quizId = req.params.id;
  const { userId, answers } = req.body; // Answers should be an array of selected option IDs
  try {
    const quiz = await Quiz.findById(quizId).populate("questions"); // Populate questions to get correct answers
    const user = await User.findById(userId);
    if (!quiz || !user) {
      return res.status(404).json({ error: "Quiz or user not found" });
    }

    // Calculate the score
    let correctAnswers = 0;
    for (let i = 0; i < quiz.questions.length; i++) {
      const question = quiz.questions[i];
      const correctOption = question.options.find((option) => option.isCorrect); // Find the correct answer
      if (correctOption && answers[i] === correctOption._id.toString()) {
        correctAnswers++;
      }
    }

    // Calculate score percentage
    const scorePercentage = calculateScorePercentage(
      correctAnswers,
      quiz.questions.length
    );

    // Update user's Elo
    const newElo = calculateEloAfterQuiz(
      user.eloRating,
      quiz.difficulty,
      scorePercentage
    );
    user.eloRating = newElo;
    await user.save();

    return res.status(200).json({
      message: "Elo updated successfully",
      user: { username: user.username, newElo: user.eloRating },
    });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Helper function to calculate score percentage
const calculateScorePercentage = (correctAnswers, totalQuestions) => {
  if (totalQuestions === 0) return 0; // Avoid division by zero
  return correctAnswers / totalQuestions; // Returns a value between 0 and 1
};

module.exports = router;

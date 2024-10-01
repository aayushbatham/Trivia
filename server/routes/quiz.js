const express = require("express");
const checkAdmin = require("../middleware/checkAdmin");
const jwtMiddleware = require("../middleware/jwtMiddleware");
const Quiz = require("../models/quiz");
const User = require("../models/user");
const Question = require("../models/question");
const { calculateEloAfterQuiz } = require("../utils/elo");
const Fuse = require("fuse.js");

const router = express.Router();

// Create a quiz (for admin only)
router.post("/quiz", jwtMiddleware, checkAdmin, async (req, res) => {
  const { title, description, category, difficulty, questions } = req.body;

  // Validate input data
  if (!title || !category) {
    return res.status(400).json({ error: "Title and category are required" });
  }

  if (questions && questions.length === 0) {
    return res.status(400).json({ error: "At least one question is required" });
  }

  try {
    // Create the quiz
    const newQuiz = new Quiz({
      title,
      description,
      category,
      difficulty: difficulty || 1000, // Default difficulty if not provided
      createdBy: req.user.id,
      isPublished: false,
    });

    // Save the quiz
    await newQuiz.save();

    // Add questions if provided
    if (questions && questions.length > 0) {
      const questionDocs = await Promise.all(
        questions.map(async (question) => {
          const newQuestion = new Question({
            questionText: question.questionText,
            options: question.options,
            quiz: newQuiz._id,
          });
          await newQuestion.save();
          return newQuestion._id; // Return the question ID
        })
      );

      // Associate the saved questions with the quiz
      newQuiz.questions = questionDocs;
      await newQuiz.save();
    }

    return res.status(201).json({
      message: "Quiz and questions created successfully",
      quiz: newQuiz,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/quizzes/search", async (req, res) => {
  const query = req.query.query.toLowerCase();

  if (!query) {
    return res.status(400).json({ message: "Search query is required" });
  }

  try {
    // Fetch all quizzes from the database
    const quizzes = await Quiz.find({});

    if (!quizzes.length) {
      return res.status(404).json({ message: "No quizzes found" });
    }

    // Fuse.js options for fuzzy search
    const fuseOptions = {
      keys: ["title"], // Fields to search by
      threshold: 0.3, // Controls fuzziness
    };

    // Initialize Fuse with quiz data
    const fuse = new Fuse(quizzes, fuseOptions);

    // Perform fuzzy search
    const fuzzyResults = fuse.search(query);

    // Extract matching quizzes from Fuse.js results
    const results = fuzzyResults.map((result) => result.item);

    // If no results are found
    if (results.length === 0) {
      return res.status(404).json({ message: "No quizzes matched your query" });
    }

    // Return the filtered quizzes
    res.json(results);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/leaderboard", async (req, res) => {
  try {
    // Fetch the top 50 users sorted by score in descending order
    const topUsers = await User.find({})
      .sort({ eloRating: -1 }) // Sort by score in descending order
      .limit(50) // Limit to the top 50 users
      .select("username eloRating"); // Select only the username and score fields

    res.json(topUsers); // Send the user data as JSON response
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get quiz by ID
router.get("/quiz/:id", jwtMiddleware, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate("questions");
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }
    return res.status(200).json(quiz);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Add question to quiz
router.post(
  "/quiz/:id/questions",
  jwtMiddleware,
  checkAdmin,
  async (req, res) => {
    const { questionText, options } = req.body;
    const quizId = req.params.id;

    // Validate input
    if (!questionText || !options || !options.length) {
      return res
        .status(400)
        .json({ error: "Question text and options are required" });
    }

    try {
      const quiz = await Quiz.findById(quizId);
      if (!quiz) {
        return res.status(404).json({ error: "Quiz not found" });
      }

      // Create and save the question
      const newQuestion = new Question({
        questionText,
        options,
        quiz: quizId,
      });

      await newQuestion.save();

      // Add question ID to quiz's questions array and save the quiz
      quiz.questions.push(newQuestion._id);
      await quiz.save();

      return res.status(201).json({
        message: "Question added successfully",
        question: newQuestion,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Submit quiz results and update Elo
router.post("/quiz/:id/result", jwtMiddleware, async (req, res) => {
  const { answers } = req.body;
  const quizId = req.params.id;

  // Validate answers input
  if (!answers || !answers.length) {
    return res.status(400).json({ error: "Answers are required" });
  }

  try {
    const quiz = await Quiz.findById(quizId).populate("questions");
    const user = await User.findById(req.user.id);

    if (!quiz || !user) {
      return res.status(404).json({ error: "Quiz or user not found" });
    }

    let correctAnswers = 0;

    // Compare user's answers with the correct ones
    quiz.questions.forEach((question, i) => {
      const correctOption = question.options.find((option) => option.isCorrect);
      if (correctOption && correctOption._id.toString() === answers[i]) {
        correctAnswers++;
      }
    });

    const scorePercentage = calculateScorePercentage(
      correctAnswers,
      quiz.questions.length
    );

    // Calculate new Elo rating
    const newElo = calculateEloAfterQuiz(
      user.eloRating,
      quiz.difficulty,
      scorePercentage
    );
    user.eloRating = newElo;
    await user.save();

    return res.status(200).json({
      message: "Quiz submitted successfully",
      newElo: user.eloRating,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/active", async (req, res) => {
  try {
    // Fetch active quizzes from the database
    const activeQuizzes = await Quiz.find({ isPublished: true }); // Assuming 'isActive' indicates an active quiz

    if (!activeQuizzes || activeQuizzes.length === 0) {
      return res.status(404).json({ message: "No active quizzes found" });
    }

    // Respond with the quizzes data
    res.status(200).json({ quizzes: activeQuizzes });
  } catch (error) {
    console.error("Error fetching active quizzes:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Helper to calculate percentage
const calculateScorePercentage = (correctAnswers, totalQuestions) => {
  return totalQuestions ? (correctAnswers / totalQuestions) * 100 : 0;
};

module.exports = router;

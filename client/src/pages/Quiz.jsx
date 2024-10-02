// src/pages/QuizPage.jsx

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Import useParams to access route parameters

const QuizPage = () => {
  const { id } = useParams(); // Get the quiz ID from the URL parameters
  const [quiz, setQuiz] = useState(null); // State to hold quiz data
  const [loading, setLoading] = useState(true); // State for loading state
  const [error, setError] = useState(null); // State for error handling
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // State for current question
  const [userAnswers, setUserAnswers] = useState([]); // State to store user answers
  const [timeLeft, setTimeLeft] = useState(60); // Timer for each question
  const [quizStarted, setQuizStarted] = useState(false); // State to manage quiz start
  const [result, setResult] = useState(null); // State to hold quiz result

  // Fetch the quiz data when the component mounts
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await fetch(`http://172.20.10.2:3000/quiz/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch quiz data");
        }

        const data = await response.json();
        setQuiz(data); // Set the quiz data in state
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [id]);

  // Function to start the quiz
  const startQuiz = () => {
    setQuizStarted(true);
    setTimeLeft(60); // Reset timer for the first question
  };

  // Use effect to handle timer
  useEffect(() => {
    let timer;
    if (quizStarted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    }

    if (timeLeft === 0) {
      handleNextQuestion();
    }

    return () => clearInterval(timer); // Clear timer on component unmount
  }, [quizStarted, timeLeft]);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setTimeLeft(60); // Reset timer for next question
    } else {
      // Logic to handle quiz completion
      const score = userAnswers.filter((answer) => answer.correct).length;
      setResult(score);
      // Optionally, update Elo rating here
    }
  };

  const handleAnswer = (answer) => {
    setUserAnswers((prevAnswers) => [...prevAnswers, answer]);
    handleNextQuestion();
  };

  if (loading) return <p>Loading quiz...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 text-white">
      {quizStarted ? (
        <div>
          <h3 className="text-lg">
            {quiz.questions[currentQuestionIndex].question}
          </h3>
          <div>
            {quiz.questions[currentQuestionIndex].options.map(
              (option, index) => (
                <button
                  key={index}
                  className="bg-blue-500 text-white px-4 py-2 m-2 rounded"
                  onClick={() => handleAnswer(option)}
                >
                  {option.text}
                </button>
              )
            )}
          </div>
          <p>Time left: {timeLeft} seconds</p>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl mb-4">{quiz.title}</h2>
          <p>{quiz.description}</p>
          <button
            className="mt-4 bg-[#d1c343] text-black px-4 py-2 rounded-lg"
            onClick={startQuiz}
          >
            Start Quiz
          </button>
        </div>
      )}
      {result !== null && (
        <div>
          <h2 className="text-2xl">Quiz Completed!</h2>
          <p>
            Your Score: {result} out of {quiz.questions.length}
          </p>
          {/* Optionally display Elo rating update here */}
        </div>
      )}
    </div>
  );
};

export default QuizPage;

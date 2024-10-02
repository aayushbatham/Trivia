import React, { useEffect, useState } from "react";
import UserRankCard from "./UserRankCard"; // Adjust the path accordingly

const Home = () => {
  const [activeQuizzes, setActiveQuizzes] = useState([]);
  const [userRating, setUserRating] = useState(null); // State for user rating
  const [loading, setLoading] = useState(true); // Loading state for quizzes
  const [error, setError] = useState(null); // Error state for quizzes
  const [userRankLoading, setUserRankLoading] = useState(true); // Loading state for user rank
  const [userRankError, setUserRankError] = useState(null); // Error state for user rank

  // Fetch active quizzes from backend
  const fetchActiveQuizzes = async () => {
    try {
      const response = await fetch("http://172.20.10.2:3000/quiz/active", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch quizzes");
      }

      const data = await response.json();
      setActiveQuizzes(data.quizzes); // Update state with fetched quizzes
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      setError(error.message); // Set error message
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  // Fetch user rank rating from backend
  const fetchUserRank = async () => {
    try {
      const response = await fetch("http://172.20.10.2:3000/user/rank", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user rank");
      }

      const data = await response.json();
      setUserRating(data.rank); // Update state with user rating
    } catch (error) {
      console.error("Error fetching user rank:", error);
      setUserRankError(error.message); // Set error message
    } finally {
      setUserRankLoading(false); // Set loading to false
    }
  };

  // Use useEffect to fetch both quizzes and user rank when component mounts
  useEffect(() => {
    fetchActiveQuizzes();
    fetchUserRank();
  }, []);

  if (loading) return <div className="text-white">Loading quizzes...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  if (userRankLoading)
    return <div className="text-white">Loading user rank...</div>;
  if (userRankError) return <div className="text-red-500">{userRankError}</div>;

  return (
    <div className="p-4 text-white">
      <h2 className="text-2xl mb-4">Active Quizzes</h2>
      <div className="flex overflow-x-scroll space-x-4 pb-4">
        {activeQuizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="min-w-[200px] bg-[#333] rounded-lg p-4 shadow-lg"
          >
            <h3 className="text-lg font-bold">{quiz.title}</h3>
            <p className="text-sm mb-2">{quiz.description}</p>
            <button className="bg-[#d1c343] text-black px-4 py-2 rounded-lg">
              Start
            </button>
          </div>
        ))}
      </div>

      {/* Display User Rank Card */}
      {userRating !== null && <UserRankCard rating={userRating} />}
    </div>
  );
};

export default Home;

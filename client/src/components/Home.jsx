import React, { useEffect, useState } from "react";
import UserRankCard from "./UserRankCard"; // Adjust the path accordingly

const Home = () => {
  const [activeQuizzes, setActiveQuizzes] = useState([
    { id: 1, title: "Math Quiz" },
    { id: 2, title: "Science Quiz" },
    { id: 3, title: "History Quiz" },
    { id: 4, title: "Geography Quiz" },
    { id: 5, title: "Literature Quiz" },
  ]);

  const [userRating, setUserRating] = useState(null); // State for user rating
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch user rank rating from backend
  const fetchUserRank = async () => {
    try {
      const response = await fetch("http://192.168.1.13:3000/user/rank", {
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
      setError(error.message); // Set error message
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  // Use useEffect to fetch user rank when component mounts
  useEffect(() => {
    fetchUserRank();
  }, []);

  if (loading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-4 text-white">
      <h2 className="text-2xl mb-4">Active Quizzes</h2>
      <div className="flex overflow-x-scroll space-x-4 pb-4">
        {activeQuizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="min-w-[200px] bg-[#333] rounded-lg p-4 shadow-lg"
          >
            <h3 className="text-lg font-bold ">{quiz.title}</h3>
            <p className="text-sm mb-2">Description</p>
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

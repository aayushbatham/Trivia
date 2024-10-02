import React, { useState, useEffect } from "react";

const Leaderboard = () => {
  const [users, setUsers] = useState([]); // State to hold users
  const [loading, setLoading] = useState(true); // State to manage loading
  const [error, setError] = useState(null); // State to manage errors

  // Fetch the leaderboard data from the backend
  const fetchLeaderboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "http://172.20.10.2:3000/quiz/leaderboard", // Update this URL to your backend endpoint
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard data");
      }

      const data = await response.json();
      setUsers(data); // Assuming the backend returns the top 50 users
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  // Sort users by score in descending order
  const sortedUsers = users.sort((a, b) => b.score - a.score);

  return (
    <div className="p-6 text-white rounded-lg shadow-lg">
      <h2 className="text-3xl mb-6 text-center font-semibold">Leaderboard</h2>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="space-y-2">
        {sortedUsers.map((user, index) => (
          <div
            key={user.id}
            className={`flex justify-between items-center p-3 rounded-lg border-2 transition-transform duration-200 ${
              index === 0
                ? "border-[#FFD700] bg-[#333]"
                : index === 1
                ? "border-[#C0C0C0] bg-[#333]"
                : index === 2
                ? "border-[#cd7f32] bg-[#333]"
                : "border-transparent bg-[#444]"
            }`}
          >
            <span
              className={`text-lg ${index < 3 ? "font-bold" : "font-normal"}`}
            >
              {user.username}
            </span>
            <span
              className={`text-lg ${index < 3 ? "font-bold" : "font-normal"}`}
            >
              {user.score}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;

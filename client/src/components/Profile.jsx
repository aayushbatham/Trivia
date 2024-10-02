import React, { useState, useEffect } from "react";

const Profile = () => {
  // State to hold user data
  const [user, setUser] = useState(null); // User data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [newPassword, setNewPassword] = useState(""); // New password state
  const [message, setMessage] = useState(""); // Success message

  // Fetch user data from the backend
  const fetchUserData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://172.20.10.2:3000/user/profile", {
        // Update this URL to your backend endpoint
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Use token from local storage
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();
      setUser(data); // Assuming the backend returns the user data
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle password change
  const handleChangePassword = async () => {
    setMessage(""); // Reset message
    // Implement the logic to change password (e.g., send to backend)
    try {
      const response = await fetch(
        "http://172.20.10.2:3000/user/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ password: newPassword }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to change password");
      }

      setMessage("Password changed successfully!"); // Example success message
      setNewPassword(""); // Clear the password input
    } catch (err) {
      console.error(err);
      setMessage(err.message);
    }
  };

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading) {
    return <div className="p-4 text-white">Loading...</div>; // Loading state
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>; // Error state
  }

  if (!user) {
    return null; // If user data is not available
  }

  return (
    <div className="flex flex-col items-center p-6 bg-[#1a1a1a] rounded-lg shadow-lg text-white">
      <img
        src={user.profileIcon || "https://via.placeholder.com/100"} // Fallback to placeholder if icon is not available
        alt="Profile"
        className="w-24 h-24 rounded-full mb-4 border-2 border-[#d1c343] shadow-lg"
      />
      <h2 className="text-2xl font-semibold mb-2">{user.username}</h2>
      <p className="text-lg">Quizzes Taken: {user.quizzesTaken}</p>
      <p className="text-lg">Rating: {user.eloRating}</p>
      <p className="text-lg">Win Rate: {user.winRate}</p>

      <div className="mt-6 w-full">
        <h3 className="text-lg font-semibold mb-2">Change Password</h3>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New Password"
          className="w-full p-2 rounded-lg bg-[#333] text-white outline-none border border-[#555]"
        />
        <button
          onClick={handleChangePassword}
          className="mt-4 w-full bg-[#d1c343] text-black px-4 py-2 rounded-lg transition-transform duration-200 hover:scale-105"
        >
          Change Password
        </button>
      </div>

      {message && <p className="mt-4 text-green-500 text-center">{message}</p>}
    </div>
  );
};

export default Profile;

import React from "react";

const UserRankCard = ({ rating }) => {
  // Define rank and corresponding styles based on the rating value
  const getRank = (rating) => {
    if (rating >= 1000 && rating < 1200)
      return { name: "Silver", color: "text-slate-500" };
    if (rating >= 1200 && rating < 1400)
      return { name: "Gold", color: "text-yellow-400" };
    if (rating >= 1400 && rating < 1600)
      return { name: "Platinum", color: "text-blue-400" };
    if (rating >= 1600 && rating < 1800)
      return { name: "Diamond", color: "text-purple-500" };
    if (rating >= 1800 && rating < 2000)
      return { name: "Master", color: "text-red-500" };
    if (rating >= 2000 && rating < 2500)
      return { name: "Grandmaster", color: "text-green-500" };
    if (rating >= 2500 && rating <= 3000)
      return {
        name: "Legendary",
        color: "bg-gradient-to-r from-purple-500 to-pink-500 animate-gradient",
      };
    return { name: "Unranked", color: "text-gray-400" };
  };

  const { name: rank, color } = getRank(rating);

  return (
    <div className="p-4">
      <div className={`bg-[#0c0c0c] rounded-lg shadow-lg p-6 text-center`}>
        <h2 className="text-xl font-bold text-white mb-2">Current Rank</h2>
        <div
          className={`${color} text-4xl font-semibold mb-4 ${
            color.includes("bg-gradient") ? "bg-clip-text text-transparent" : ""
          }`}
        >
          {rank}
        </div>
        <p className="text-gray-400">Rating: {rating}</p>
      </div>
    </div>
  );
};

export default UserRankCard;

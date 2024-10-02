import React from "react";
import {
  HomeOutlined,
  SearchOutlined,
  TrophyOutlined,
  UserOutlined,
} from "@ant-design/icons";

const BottomBar = ({ setActiveComponent, activeComponent }) => {
  return (
    <div className="fixed bottom-5 left-2 right-2 mx-auto h-[5rem] bg-[#1c1c1c] shadow-lg flex justify-around items-center p-2 rounded-3xl">
      <div
        onClick={() => setActiveComponent("Home")}
        className="flex flex-col items-center"
      >
        <span
          className={`text-3xl transition-colors duration-300 ${
            activeComponent === "Home" ? "text-[#4CAF50]" : "text-white"
          }`}
        >
          <HomeOutlined />
        </span>
      </div>
      <div
        onClick={() => setActiveComponent("Search")}
        className="flex flex-col items-center"
      >
        <span
          className={`text-3xl transition-colors duration-300 ${
            activeComponent === "Search" ? "text-[#4CAF50]" : "text-white"
          }`}
        >
          <SearchOutlined />
        </span>
      </div>
      <div
        onClick={() => setActiveComponent("Leaderboard")}
        className="flex flex-col items-center"
      >
        <span
          className={`text-3xl transition-colors duration-300 ${
            activeComponent === "Leaderboard" ? "text-[#4CAF50]" : "text-white"
          }`}
        >
          <TrophyOutlined />
        </span>
      </div>
      <div
        onClick={() => setActiveComponent("Profile")}
        className="flex flex-col items-center"
      >
        <span
          className={`text-3xl transition-colors duration-300 ${
            activeComponent === "Profile" ? "text-[#4CAF50]" : "text-white"
          }`}
        >
          <UserOutlined />
        </span>
      </div>
    </div>
  );
};

export default BottomBar;

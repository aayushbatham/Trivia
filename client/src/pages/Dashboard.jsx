import React, { useState } from "react";
import { Layout } from "antd";
import BottomBar from "../components/Bottombar"; // Ensure the path is correct
import Home from "../components/Home";
import Search from "../components/Search";
import Leaderboard from "../components/Leaderboard";
import Profile from "../components/Profile";
import Navbar from "../components/Navbar";

const { Content } = Layout;

const Dashboard = () => {
  const [activeComponent, setActiveComponent] = useState("Home");

  const renderComponent = () => {
    switch (activeComponent) {
      case "Home":
        return <Home />;
      case "Search":
        return <Search />;
      case "Leaderboard":
        return <Leaderboard />;
      case "Profile":
        return <Profile />;
      default:
        return <Home />;
    }
  };

  return (
    <Layout className="bg-[#0c0c0c] min-h-screen">
      <Navbar />
      <Content className="flex-grow">{renderComponent()}</Content>
      <BottomBar setActiveComponent={setActiveComponent} />
    </Layout>
  );
};

export default Dashboard;

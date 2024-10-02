import React, { useEffect, useState } from "react";
import { Layout, Drawer, Badge, List, Button } from "antd"; // Import Button from antd
import { BellOutlined, UserOutlined } from "@ant-design/icons";

const { Header } = Layout;

const Navbar = () => {
  const [username, setUsername] = useState(""); // State to hold username
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // State for drawer visibility
  const [notifications, setNotifications] = useState([]); // State to hold notifications

  // Fetch username from backend
  const handleUsername = async () => {
    try {
      const response = await fetch("http://172.20.10.2:3000/user/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsername(data.username); // Set the username in state
      } else {
        console.error("Error fetching username:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Fetch notifications from backend
  const handleNotifications = async () => {
    try {
      const response = await fetch("http://172.20.10.2:3000/notifications", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications); // Assuming data.notifications is an array
      } else {
        console.error("Error fetching notifications:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Use useEffect to fetch the username and notifications when the component mounts
  useEffect(() => {
    handleUsername();
    handleNotifications();
  }, []);

  // Handle opening/closing of the notification drawer
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <>
      <Header className="flex justify-between items-center bg-[#0c0c0c] shadow-md p-4">
        {/* Left Side: User Profile */}
        <div className="flex items-center">
          <div className="flex items-center bg-[#2b2b2b] rounded-full p-3 mr-3">
            <UserOutlined className="text-white text-2xl" />
          </div>
          <span className="text-white text-lg">
            Welcome, <span className="font-extralight">{username}</span>
          </span>
        </div>

        {/* Right Side: Notification */}
        <div className="flex items-center">
          <div
            className="flex items-center bg-[#2b2b2b] rounded-full p-3 cursor-pointer"
            onClick={toggleDrawer}
          >
            <Badge count={notifications.length} size="small" className="">
              <BellOutlined className="text-2xl text-white" />
            </Badge>
          </div>
        </div>
      </Header>

      {/* Minimal, Dark-Themed, Floating Notification Drawer */}
      <Drawer
        title={
          <div className="flex justify-between items-center">
            <span className="text-white">Notifications</span>
            <button
              type="text"
              onClick={toggleDrawer}
              className="text-white font-light text-sm" // Style for close button
            >
              Close
            </button>
          </div>
        }
        placement="right"
        onClose={toggleDrawer}
        open={isDrawerOpen}
        closable={false}
        width={300}
        className="bg-[#1c1c1c] shadow-2xl"
        headerStyle={{
          background: "#1c1c1c", // Dark theme for the header
          borderBottom: "1px solid #444",
        }}
        bodyStyle={{
          padding: "10px",
          background: "#1c1c1c",
        }}
        style={{
          position: "absolute", // Float the drawer
          top: "30px",
          right: "20px",
          height: "calc(100vh - 80px)",
          borderRadius: "24px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
          overflow: "hidden", // Prevent overflow
        }}
      >
        {notifications.length === 0 ? (
          <span className="text-white text-center">No data</span> // Change to white
        ) : (
          <List
            dataSource={notifications}
            renderItem={(notification) => (
              <List.Item className="p-4 border-b border-gray-700 hover:bg-[#2b2b2b] transition-colors duration-200 text-white">
                {notification.message}
              </List.Item>
            )}
          />
        )}
      </Drawer>
    </>
  );
};

export default Navbar;

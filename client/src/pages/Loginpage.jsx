import React, { useState } from "react";
import { Layout } from "antd";

const { Header, Content } = Layout;

const Homepage = () => {
  // State to store email and password inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Function to handle login request
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form refresh

    try {
      const response = await fetch("http://172.20.10.2:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }), // Send email and password as JSON
      });

      const data = await response.json();
      if (response.ok) {
        // Handle success (e.g., redirect, show success message)
        console.log("Login successful:", data);
        localStorage.setItem("token", data.token);
        // Redirect to dashboard page
        window.location.href = "/dashboard";
      } else {
        // Handle error (e.g., show error message)
        console.error("Login failed:", data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Layout className="bg-white dark:bg-[#0c0c0c] h-screen flex flex-col justify-between p-6">
      {/* Transparent Header with App Title */}
      <Header className="bg-transparent text-center">
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-5xl md:text-6xl text-black dark:text-white font-bold">
            Quizly
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mt-2">
            <span className="text-red-700 dark:text-red-400">Level.</span>
            <span className="text-red-400 dark:text-red-300">Up.</span>
          </p>
        </div>
      </Header>

      {/* Centered Content for email and password */}
      <Content className="flex flex-col justify-center items-center flex-grow">
        <input
          type="email"
          placeholder="Email"
          className="w-64 md:w-72 p-3 text-base rounded-lg mt-5 border-gray-300 dark:border-gray-600 bg-white dark:bg-[#292929] text-black dark:text-white focus:outline-none focus:border-red-400 dark:focus:border-red-600"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Update email state
        />
        <input
          type="password"
          placeholder="Password"
          className="w-64 md:w-72 p-3 text-base mt-4 rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-[#292929] text-black dark:text-white focus:outline-none focus:border-red-400 dark:focus:border-red-600"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Update password state
        />

        {/* Forgot password link */}
        <div className="w-64 md:w-72 text-right mt-2">
          <a
            href="#"
            className="text-xs md:text-sm text-gray-500 dark:text-gray-400 hover:text-red-400 dark:hover:text-red-500"
          >
            Forgot Password?
          </a>
        </div>
      </Content>

      {/* Bottom Buttons Section */}
      <footer className="flex flex-col items-center gap-5 mt-8 pb-8">
        {/* Login Button */}
        <button
          className="w-64 md:w-72 p-3 text-base rounded-lg bg-red-400 dark:bg-red-500 text-white font-semibold hover:bg-red-500 dark:hover:bg-red-600"
          onClick={handleLogin} // Trigger login request on button click
        >
          Login
        </button>

        {/* Login with Google Button */}
        <button className="w-64 md:w-72 p-3 text-base rounded-lg bg-gray-100 dark:bg-[#292929] text-black dark:text-white font-semibold border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600">
          Login with Google
        </button>

        {/* Don't have an account? Register link */}
        <p className="text-base text-gray-500 dark:text-gray-400">
          Don’t have an account?{" "}
          <a
            href="/register"
            className="text-red-400 dark:text-red-500 font-semibold hover:underline"
          >
            Register
          </a>
        </p>
      </footer>
    </Layout>
  );
};

export default Homepage;

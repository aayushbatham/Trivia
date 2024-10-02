import React, { useState } from "react";
import { Layout } from "antd";
import toast, { Toaster } from "react-hot-toast"; // Import toast and Toaster

const { Header, Content } = Layout;

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match"); // Show error toast
      return;
    }

    try {
      const response = await fetch("http://172.20.10.2:3000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Registration successful!"); // Show success toast
        window.location.href = "/";
      } else {
        toast.error(data.message || "Registration failed"); // Show error toast
      }
    } catch (error) {
      toast.error("Error: " + error.message); // Show error toast
    }
  };

  return (
    <Layout className="bg-white dark:bg-[#0c0c0c] h-screen flex flex-col justify-between p-6">
      <Header className="bg-transparent text-center">
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-5xl text-black dark:text-white font-bold">
            Quizly
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            <span className="text-red-700 dark:text-red-400">Level.</span>
            <span className="text-red-400 dark:text-red-300">Up.</span>
          </p>
        </div>
      </Header>

      <Content className="flex flex-col justify-center items-center flex-grow">
        <input
          type="text"
          placeholder="Username"
          className="w-64 p-3 rounded-lg mt-4 border-gray-300 dark:border-gray-600 bg-white dark:bg-[#292929] text-black dark:text-white focus:outline-none focus:border-red-400 dark:focus:border-red-600"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-64 p-3 mt-4 rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-[#292929] text-black dark:text-white focus:outline-none focus:border-red-400 dark:focus:border-red-600"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-64 p-3 mt-4 rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-[#292929] text-black dark:text-white focus:outline-none focus:border-red-400 dark:focus:border-red-600"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-64 p-3 mt-4 rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-[#292929] text-black dark:text-white focus:outline-none focus:border-red-400 dark:focus:border-red-600"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </Content>

      <footer className="flex flex-col items-center gap-5 mt-8 pb-8">
        <button
          className="w-64 p-3 rounded-lg bg-red-400 dark:bg-red-500 text-white font-semibold hover:bg-red-500 dark:hover:bg-red-600"
          onClick={handleRegister}
        >
          Register
        </button>

        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Already have an account?{" "}
          <a
            href="/"
            className="text-red-400 dark:text-red-500 font-semibold hover:underline"
          >
            Login
          </a>
        </p>
      </footer>

      {/* Toaster for notifications */}
      <Toaster />
    </Layout>
  );
};

export default RegisterPage;

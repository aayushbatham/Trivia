import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Function to update theme color dynamically
const updateThemeColor = () => {
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  if (darkModeMediaQuery.matches) {
    themeColorMeta.setAttribute("content", "#0c0c0c"); // Dark theme color
  } else {
    themeColorMeta.setAttribute("content", "#ffffff"); // Light theme color
  }
};

// Add an event listener to detect changes in dark mode
const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
darkModeMediaQuery.addEventListener("change", updateThemeColor);

// Update theme color on initial load
updateThemeColor();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

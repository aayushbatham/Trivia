// Toast.js
import React from "react";

const Toast = ({ message, isVisible, onClose }) => {
  return (
    <div
      className={`fixed top-5 right-5 w-72 p-4 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-[-100%] opacity-0"
      } bg-white text-black border border-gray-300`}
    >
      <div className="flex justify-between items-center">
        <span className="font-semibold">{message}</span>
        <button
          onClick={onClose}
          className="text-red-500 hover:text-red-700 font-bold"
        >
          &times; {/* Close button */}
        </button>
      </div>
    </div>
  );
};

export default Toast;

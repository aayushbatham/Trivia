import React from "react";
import Loginpage from "./pages/Loginpage";
import Dashboard from "./pages/Dashboard";
import Registerpage from "./pages/Registerpage";
import QuizPage from "./pages/Quiz";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Loginpage />} />
        <Route path="/register" element={<Registerpage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/quiz" element={<QuizPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

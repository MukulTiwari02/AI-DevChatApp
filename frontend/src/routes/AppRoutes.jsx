import React from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import Login from "../screens/Login";
import Register from "../screens/Register";
import Project from "../screens/Project.jsx";
import LandingPage from "../screens/Landing.jsx";
import Dashboard from "../screens/Dashboard.jsx";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/project/:id" element={<Project />} />
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

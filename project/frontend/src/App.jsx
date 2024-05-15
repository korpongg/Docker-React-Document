import React from "react";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import "./App.css";

import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";

import Login from "./view/user/Login";
import Logout from "./view/user/Logout";

import Home from "./view/pages/Home";

import IndexPage from "./components/Occurrence"
import Occurrence from "./components/Occurrence/form";

import Missing from "./components/Missing";

const ROLES = {
  User: "1",
  Editor: "2",
  Admin: "3",
};

function App() {

  return (
    <>
      {/* <Header /> */}
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/" element={<Layout />}>
          <Route path="login" element={<Login />} />
          <Route path="logout" element={<Logout />} />
          
          <Route path="/home" element={<Home />} />

          <Route path="/occurrence" element={<IndexPage />} />
          <Route path="/occurrence/form" element={<Occurrence />} />

          {/* catch all */}
          <Route path="*" element={<Missing />} />
        </Route>
      </Routes>
      {/* <MobileNav /> */}
    </>
  );
}

export default App;
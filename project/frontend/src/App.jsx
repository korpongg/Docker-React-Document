import React from "react";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import "./App.css";

import Layout from "./components/Layout";
import Header from "./layout/Header";
import RequireAuth from "./components/RequireAuth";

import Login from "./view/user/Login";
import Logout from "./view/user/Logout";
import EventOcc from "./components/Occurrence/Event";

import Home from "./view/pages/Home";

import IndexPage from "./components/Occurrence/Dashboard"
import Occurrence from "./components/Occurrence/form";

import Usermanager from "./view/admin/Usermanager";

import Missing from "./components/Missing";

const ROLES = {
  User: "1",
  Editor: "2",
  Admin: "3",
};

function App() {
  const location = useLocation();

  return (
    <>
      {!["", "/login", "/logout"].includes(location.pathname) && <Header />}
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/" element={<Layout />}>
          <Route path="login" element={<Login />} />
          <Route path="logout" element={<Logout />} />

          <Route
            element={
              <RequireAuth
                allowedRoles={[ROLES.User, ROLES.Editor, ROLES.Admin]}
              />
            }
          >
            <Route path="/home" element={<Home />} />
            <Route path="/occurrence" element={<IndexPage />} />
            <Route path="/occurrence/event" element={<EventOcc />} />
            <Route path="/occurrence/:id" element={<Occurrence Mode="Show" />} />
            <Route path="/occurrence/form" element={<Occurrence Mode="Add" />} />
            <Route path="/occurrence/form/:id" element={<Occurrence Mode="Edit" />} />
          </Route>

          <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
            <Route path="usermanager" element={<Usermanager />} />
          </Route>

          {/* catch all */}
          <Route path="*" element={<Missing />} />
        </Route>
      </Routes>
      {/* <MobileNav /> */}
    </>
  );
}

export default App;
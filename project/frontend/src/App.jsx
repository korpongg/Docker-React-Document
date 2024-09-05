import React, { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import { useWebSocket } from "./context/WebSocketContext";
import "./App.css";

import Layout from "./components/Layout";
import Header from "./layout/Header";
import RequireAuth from "./components/RequireAuth";

import Login from "./view/user/Login";
import Logout from "./view/user/Logout";
import EventOcc from "./components/Occurrence/Event";

import Home from "./view/pages/Home";

import Dashboard from "./components/Occurrence/Dashboard"
import Occurrence from "./components/Occurrence/form";
import Medication from "./components/Medication";
import MedicationF from "./components/Occurrence/form/medex";

import AddUser from "./view/admin/AddUser";
import Usermanager from "./view/admin/Usermanager";

import OccurrenceReport from "./components/Report/OccurrenceReport";

import DeptManage from "./view/admin/DeptManage";

import Missing from "./components/Missing";
import Unauthorized from "./components/Unauthorized";

const ROLES = {
  User: "1",
  Editor: "2",
  Admin: "3",
};

function App() {
  const { disconnectWebSocket } = useWebSocket();
  const location = useLocation();
  
  useEffect(() => {
    disconnectWebSocket(); // Call disconnectWebSocket when the location changes
  }, [location.pathname]);

  return (
    <>
      {!["", "/login", "/logout"].includes(location.pathname) && <Header />}
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/" element={<Layout />}>
          <Route path="login" element={<Login />} />
          <Route path="logout" element={<Logout />} />
          <Route path="unauthorized" element={<Unauthorized />} />

          <Route
            element={
              <RequireAuth
                allowedRoles={[ROLES.User, ROLES.Editor, ROLES.Admin]}
              />
            }
          >
            <Route path="/home" element={<Home />} />

            <Route path="/occurrence" element={<Dashboard />} />
            <Route path="/occurrence/event" element={<EventOcc />} />
            <Route path="/occurrence/:id" element={<Occurrence Mode="Show" />} />
            <Route path="/occurrence/form" element={<Occurrence Mode="Add" />} />
            <Route path="/occurrence/form/:id" element={<Occurrence Mode="Edit" />} />

            <Route path="/medication" element={<Medication />} />
            <Route path="/medication/:id" element={<MedicationF Mode="Show" />} />
            <Route path="/medication/form" element={<MedicationF Mode="Add" />} />
            <Route path="/medication/form/:id" element={<MedicationF Mode="Edit" />} />
            <Route path="/medication/form/approve/:id" element={<MedicationF Mode="Aprove" />} />
          </Route>

          <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
            <Route path="adduser" element={<AddUser />} />
            <Route path="usermanager" element={<Usermanager />} />
            <Route path="occurrence/report" element={<OccurrenceReport />} />
            <Route path="/deptmanager" element={<DeptManage />} />
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
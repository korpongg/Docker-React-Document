import React, { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import { useWebSocket } from "./context/WebSocketContext";
import "./App.css";

import Layout from "./components/Layout";
import Header from "./layout/Header";
import RequireAuth from "./components/RequireAuth";

import Login from "./view/user/Login";
import Logout from "./view/user/Logout";

import Home from "./view/pages/Home";



import Dashboard2 from "./components/Document/Dashboard"
import Document from "./components/Document/form";

import Documentform2 from "./components/Document/form2";
import AddUser from "./view/admin/AddUser";
import Usermanager from "./view/admin/Usermanager";


import DeptManage from "./view/admin/DeptManage";
import SupManage from "./view/admin/SupManage";

import Missing from "./components/Missing";
import Unauthorized from "./components/Unauthorized";
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
const ROLES = {
  User: "1",
  Editor: "2",
  Admin: "3",
};

function App() {
  const { disconnectWebSocket } = useWebSocket();
  const location = useLocation();
  

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

        

            <Route path="/document" element={<Dashboard2 />} />
   
            <Route path="/document/:id" element={<Document Mode="Show" />} />
            <Route path="/document/form" element={<Document Mode="Add" />} />
            <Route path="/document/form/:id" element={<Document Mode="Edit" />} />
            <Route path="/document/form2/:id" element={<Documentform2 Mode="Add" />} />
<Route
  path="/document/form2/edit/:id"
  element={<Documentform2 Mode="Edit" />}
/>
      
          </Route>

          <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
            <Route path="/adduser" element={<AddUser />} />
            <Route path="/usermanager" element={<Usermanager />} />
            <Route path="/deptmanager" element={<DeptManage />} />
            <Route path="/supmanager" element={<SupManage />} />
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
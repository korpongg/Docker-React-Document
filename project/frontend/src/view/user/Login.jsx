import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Snackbar } from "@mui/material";
import axios from "axios";
import MuiAlert from "@mui/material/Alert";
import useAuth from "../../hooks/useAuth";
import { LoginBox } from "../../styles/Login.style";

import { createGlobalStyle } from "styled-components";
const GlobalStyle = createGlobalStyle`
  :root {
    background: linear-gradient(315deg, #c850c0, #4158d0);
  }
  #root {
    text-align: unset;
  }
`;

const Login = () => {
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const userRef = useRef();
  const passRef = useRef();

  const [userid, setUserid] = useState("");
  const [pass, setPass] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const storedAuth = JSON.parse(localStorage.getItem("auth"));
  const userData = storedAuth ? JSON.parse(localStorage.getItem("userData")) : null;

  const handleApiError = (err) => {
    if (!err?.response) {
      setErrMsg("ไม่มีการตอบกลับของเซิร์ฟเวอร์");
    } else {
      switch (err.response.status) {
        case 400:
          setErrMsg("โปรดตรวจสอบ รหัสพนักงาน, รหัสผ่าน");
          break;
        // case 401:
        //   setErrMsg("ไม่ได้รับอนุญาต");
        //   break;
        default:
          setErrMsg("ไม่สามารถเข้าสู่ระบบได้");
          break;
      }
    }
    setError(true);
    passRef.current.focus();
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setErrMsg("");
    setError(false);
  };

  const handleAuthSuccess = (response) => {
    const { accessToken, roles } = response?.data || {};
    localStorage.setItem("auth", JSON.stringify({ userid, roles, accessToken }));
    setAuth({ userid, roles, accessToken });
  };

  const handleUserData = async () => {
    try {
      const storedAuth = JSON.parse(localStorage.getItem("auth"));
      const config = { headers: { Authorization: `Bearer ${storedAuth.accessToken}` } };
      const url = `${apiUrl}/users/${userid}`;
      const response2 = await axios.get(url, { ...config });
      if (response2.status === 200 || response2.status === 201) {
        const userData = response2.data;
        localStorage.setItem("userData", JSON.stringify(userData));

        setUserid("");
        setPass("");
        navigate("/home", { replace: true });
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (err) {
      console.error("Failed to fetch user data", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await axios.post( `${apiUrl}/auth`, { userid, pass }, { headers: { "Content-Type": "application/json" } });

      handleAuthSuccess(response);
      await handleUserData();
    } catch (err) {
      if (err.response && err.response.status === 401) {
        alert("การเข้าถึงที่ไม่ได้รับอนุญาต, กรุณาตรวจสอบข้อมูลของคุณ.");
      } else {
        handleApiError(err);
      }
    } finally {
      setLoading(false);
    }
  };

  // เช็ค user login
  useEffect(() => {
    if (storedAuth?.userid && userData) {
      navigate("/home", { replace: true });
    }
  }, [storedAuth, navigate]);
  useEffect(() => {
    setErrMsg("");
  }, [userid, pass]);

  return (
    <>
      <LoginBox>
        <GlobalStyle />
        <form className="login" onSubmit={handleSubmit} autoComplete="off">
          <h1>ระบบการรายงานเหตุการณ์</h1>
          <input
            ref={userRef}
            type="text"
            name="userid"
            id="userid"
            value={userid}
            onChange={(e) => setUserid(e.target.value)}
            placeholder="รหัสพนักงาน"
            required
          />
          <input
            ref={passRef}
            type="password"
            name="password"
            id="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="รหัสผ่าน"
            required
          />
          <button disabled={loading}>เข้าสู่ระบบ</button>
        </form>
      </LoginBox>
    </>
  );
};

export default Login;
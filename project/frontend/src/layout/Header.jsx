import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useWebSocket } from "../context/WebSocketContext";
import axios from "axios";
import styled from "styled-components";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import FileDownloadIcon from '@mui/icons-material/FileDownloadRounded';
import LogoutIcon from "@mui/icons-material/Logout";
import SettingIcon from '@mui/icons-material/SettingsRounded';
import LogoWhite from "../assets/logo-white.svg";

import AvatarPic from "../assets/avatar2.png";
import { chkAdmin, chkAdmins, chkMedic } from "../components/Function";

const Header = () => {
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const { disconnectWebSocket } = useWebSocket();

  const storedAuth = JSON.parse(localStorage.getItem("auth"));
  const userData = storedAuth ? JSON.parse(localStorage.getItem("userData")) : null;
  const userPic = storedAuth ? JSON.parse(localStorage.getItem("userPic")) : null;
  const isAdmin = chkAdmin(userData?.role);
  const isHa = chkAdmins(userData?.role);
  const isEXEC = chkAdmin(userData?.level);

  const showMedicationMenu = isAdmin || chkMedic(userData?.AffID, userData?.faction) || isHa || (isEXEC && userData?.affiliation === "งานคุณภาพ");

  // Check Check Supervisor
  const fetchSupervisorData = async () => {
    const config = { headers: { Authorization: `Bearer ${storedAuth?.accessToken}` } };
    try {
      const response = await axios.get(`${apiUrl}/checksupervisor/${userData.userid}`, config);
      if (response.status === 200 || response.status === 201) {
        localStorage.setItem("supervisorData", JSON.stringify(response.data));
      } else {
        console.log("Get Supervisor", response.statusText);
      }
    } catch (error) {
      console.error("Error Get Supervisor", error);
    }
  };

  // Call fetchSupervisorData when component mounts or userData.userid changes
  useEffect(() => {
    if (userData?.userid) {
      fetchSupervisorData();
    }
  }, [userData?.userid]);

  // Check Authen
  const fetchData = async () => {
    const config = { headers: { Authorization: `Bearer ${storedAuth?.accessToken}` } };
    try {
      await axios.get(`${apiUrl}/refresh/check`, { ...config });
    } catch (error) {
      navigate('/logout');
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    if (storedAuth || userData) {
      if (storedAuth) {
        const isAuth = Object.keys(storedAuth).length > 0;
        if (isAuth) {
          if (isAuth && !userData) {
            navigate('/logout');
          } else {
            fetchData();
          }
        }
      }
      if (userData) {
        const isAuth = Object.keys(storedAuth).length > 0;
        const isUserData = Object.keys(userData).length > 0;
        if (!isAuth && isUserData) {
          fetchData();
        }
      }
    }
  }, [location.pathname]);

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path) => {
    if (disconnectWebSocket) {
      disconnectWebSocket(); // Disconnect WebSocket when navigating away
    }
    navigate(path);
    handleClose();
  };

  const MenuAdmin = () => {
    return (
      <>
        <MenuItem key="adduser" onClick={() => navigate("/adduser", { replace: true })}>
          <ListItemIcon>
            <PersonAddIcon fontSize="small" style={{color: "orange"}} />
          </ListItemIcon>
          เพิ่มผู้ใช้งาน
        </MenuItem>
        <MenuItem key="usermanager" onClick={() => handleNavigate("/usermanager")}>
          <ListItemIcon>
            <ManageAccountsIcon fontSize="small" style={{ color: "green" }} />
          </ListItemIcon>
          จัดการสิทธิ์
        </MenuItem>
        <MenuItem key="deptmanager" onClick={() => handleNavigate("/deptmanager")}>
          <ListItemIcon>
            <SettingIcon fontSize="small" style={{ color: "darkblue" }} />
          </ListItemIcon>
          จัดการแผนก/หน่วยงาน
        </MenuItem>
        <MenuItem key="exportdata" onClick={() => navigate("/occurrence/report")}>
          <ListItemIcon>
            <FileDownloadIcon fontSize="small" style={{color: "#2bcb2b"}} />
          </ListItemIcon>
          ดึงรายงานอุบัติการณ์
        </MenuItem>
        <Divider key="divider2" />
      </>
    );
  };

  const AvatarPicDisply = ({ style }) => (
    <Avatar src={userPic || AvatarPic} style={style}>
      {userData?.name ? userData.name.charAt(0).toUpperCase() : null}
    </Avatar>
  );

  return (
    <AppBarStyled>
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          style={{
            display: "flex",
            minHeight: "50px",
            alignItems: "center",
            paddingTop: "10px",
            paddingBottom: "10px",
            justifyContent: "space-between",
          }}
        >
          <LeftContent sx={{ flexGrow: 0, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
              sx={{ padding: "8px" }}
            >
              <MenuIcon />
            </IconButton>
            <StyledMenu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              <MenuItem onClick={() => handleNavigate("/home")}>หน้าหลัก</MenuItem>
              <MenuItem onClick={() => handleNavigate("/occurrence")}>Occurrence</MenuItem>
              <MenuItem onClick={() => handleNavigate("/occurrence/event")}>อยู่ระหว่างทบทวน</MenuItem>
              {showMedicationMenu && (
                <MenuItem onClick={() => handleNavigate("/medication")}>Medication</MenuItem>
              )}
            </StyledMenu>
          </LeftContent>

          <img
            onClick={() => handleNavigate("/home")}
            height="36"
            width="auto"
            src={LogoWhite}
            alt="โรงพยาบาลไทยนครินทร์"
            style={{ cursor: "pointer" }}
          />

          <Box sx={{ alignItems: "center", display: "flex", flexGrow: 0 }}>
            {userData && (
              <>
                <Typography variant="body1" onClick={() => handleNavigate("/home")} sx={{ display: { xs: "none", md: "block" } }} className="Button-Text">หน้าหลัก</Typography>
                <Typography variant="body1" onClick={() => handleNavigate("/occurrence")} sx={{ display: { xs: "none", md: "block" } }} className="Button-Text">Occurrence</Typography>
                <Typography variant="body1" onClick={() => handleNavigate("/occurrence/event")} sx={{ display: { xs: "none", md: "block" } }} className="Button-Text">อยู่ระหว่างทบทวน</Typography>
                {showMedicationMenu && (
                  <Typography variant="body1" onClick={() => handleNavigate("/medication")} sx={{ display: { xs: "none", md: "block" } }} className="Button-Text">Medication</Typography>
                )}

                <IconButton onClick={handleClick} sx={{ p: 0 }}>
                  <StyledBadge overlap="circular" anchorOrigin={{ vertical: "bottom", horizontal: "right" }} variant="dot">
                    <AvatarPicDisply />
                  </StyledBadge>
                </IconButton>
                <StyledMenu
                  id="account-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  onClick={handleClose}
                  transformOrigin={{ horizontal: "center", vertical: "center" }}
                  anchorOrigin={{ horizontal: "center", vertical: "center" }}
                >
                  <MenuItem key="profile-home" onClick={() => handleNavigate("/home")}>
                    <AvatarPicDisply style={{ marginRight: "10px" }} />
                    {userData?.name || "My account"}
                  </MenuItem>
                  <Divider key="divider2" />
                  {isAdmin && <MenuAdmin key="admin-menu" />}
                  <MenuItem key="logout" onClick={() => handleNavigate("/logout")}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" style={{ color: "red" }} />
                    </ListItemIcon>
                    ออกระบบ
                  </MenuItem>
                </StyledMenu>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBarStyled>
  );
};

const AppBarStyled = styled(AppBar)`
  background-color: #17a2b8 !important;
  box-shadow: 0px 2px 10px 0px #a3a3a3ad !important;

  .Button-Text {
    font-size: 1.188rem;
  }

  .MuiTypography-root {
    cursor: pointer;
    font-family: inherit !important;
    margin-right: 30px;
  }
  .MuiTypography-root:hover {
    text-decoration: underline;
  }
  .MuiTypography-root:hover {
    -webkit-mask-image: linear-gradient(-75deg, rgba(0,0,0,.6) 30%, #000 50%, rgba(0,0,0,.6) 70%);
    -webkit-mask-size: 200%;
    animation: shine 2s infinite;
  }
  @-webkit-keyframes shine {
    from { -webkit-mask-position: 150%; }
    to { -webkit-mask-position: -50%; }
  }
  @media screen and (max-width: 680px){
    .Button-Text {
      display: none !important;
    }
  }
`;

const StyledBadge = styled(Badge)`
  & .MuiBadge-badge {
    background-color: #44b700;
    color: #44b700;
    box-shadow: #b3c2f2 0px 0px 0px 1px;
    &::after {
      position: absolute;
      top: -1px;
      left: -1px;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      animation: ripple 1.2s infinite ease-in-out;
      border: 1px solid currentColor;
      content: "";
    }
  }
  @keyframes ripple {
    0% {
      transform: scale(0.8);
      opacity: 1;
    }
    100% {
      transform: scale(2);
      opacity: 0;
    }
  }
`;
const StyledMenu = styled(Menu)`
  .MuiTypography-root, .MuiAvatar-root, .MuiButtonBase-root.MuiMenuItem-root{
    font-family: inherit;
  }
`;
const LeftContent = styled(Box)`
  @media screen and (min-width: 900px){
    display: none !important;
  }
`;

export default Header;
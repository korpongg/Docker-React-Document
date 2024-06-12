import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { CheckCircleRounded as AcceptIcon } from "@mui/icons-material";
import LogoutIcon from "@mui/icons-material/Logout";
// import Logo from "../assets/logo.png";
import LogoWhite from "../assets/logo-white.svg";
// import XRay from "../assets/x-ray.png";

import AvatarPic from "../assets/avatar2.png";
import { chkAdmin, chkAdmins } from "../components/Function";

const Header = () => {
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const storedAuth = JSON.parse(localStorage.getItem("auth"));
  const userData = storedAuth ? JSON.parse(localStorage.getItem("userData")) : null;
  const userPic = storedAuth ? JSON.parse(localStorage.getItem("userPic")) : null;
  const isAdmin = chkAdmin(userData?.role);
  const isAdmins = chkAdmins(userData?.role);

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

  const MenuAdmin = () => {
    return (
      <>
        {/* <MenuItem key="adduser" onClick={() => navigate("/adduser", { replace: true })}>
          <ListItemIcon>
            <PersonAddIcon fontSize="small" style={{ color: "orange" }} />
          </ListItemIcon>
          เพิ่มผู้ใช้งาน
        </MenuItem> */}
        <MenuItem key="usermanager" onClick={() => navigate("/usermanager", { replace: true })}>
          <ListItemIcon>
            <ManageAccountsIcon fontSize="small" style={{ color: "green" }} />
          </ListItemIcon>
          จัดการสิทธิ์
        </MenuItem>
        <Divider key="divider2" />
      </>
    );
  };

  const AvatarPicDisply = ({ style }) => {
    return (
      <>
        {userPic ? (
          <Avatar src={userPic} style={style}>{userData.name ? userData.name.charAt(0).toUpperCase() : null}</Avatar>
        ) : (
          <Avatar src={AvatarPic} style={style}>{userData.name ? userData.name.charAt(0).toUpperCase() : null}</Avatar>
        )}
      </>
    );
  };

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
              <MenuItem onClick={handleCloseNavMenu}>
                <Typography textAlign="center" onClick={() => navigate("/home")}>หน้าหลัก</Typography>
              </MenuItem>

              <MenuItem onClick={handleCloseNavMenu}>
                <Typography textAlign="center" onClick={() => navigate("/occurrence")}>Occurrence</Typography>
              </MenuItem>

              <MenuItem onClick={handleCloseNavMenu}>
                <Typography textAlign="center" onClick={() => navigate("/occurrence/event")}>อยู่ระหว่างทบทวน</Typography>
              </MenuItem>

              <MenuItem onClick={handleCloseNavMenu}>
                <Typography textAlign="center" onClick={() => navigate("/medication")}>Medication</Typography>
              </MenuItem>
            </StyledMenu>
          </LeftContent>

          <img
            onClick={() => navigate("/home")}
            height="36"
            width="auto"
            src={LogoWhite}
            alt="โรงพยาบาลไทยนครินทร์"
            style={{ cursor: "pointer" }}
          />

          {/* <Box sx={{ alignItems: "center", display: { xs: "none", md: "flex" }, flexGrow: 0  }}>
            <img
              height="50"
              width="auto"
              src={XRay}
              alt="X-Ray CD Request"
            />
            <span style={{ fontSize: 24, marginLeft: 10 }}>X-Ray CD Request</span>
          </Box> */}

          <Box sx={{ alignItems: "center", display: "flex", flexGrow: 0 }}>
            {userData && (
              <>
                <Typography variant="body1" onClick={() => navigate("/home")} sx={{ display: { xs: "none", md: "block" } }} className="Button-Text">หน้าหลัก</Typography>
                <Typography variant="body1" onClick={() => navigate("/occurrence")} sx={{ display: { xs: "none", md: "block" } }} className="Button-Text">Occurrence</Typography>
                <Typography variant="body1" onClick={() => navigate("/occurrence/event")} sx={{ display: { xs: "none", md: "block" } }} className="Button-Text">อยู่ระหว่างทบทวน</Typography>
                <Typography variant="body1" onClick={() => navigate("/medication")} sx={{ display: { xs: "none", md: "block" } }} className="Button-Text">Medication</Typography>

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
                  <MenuItem key="profile-home" onClick={() => navigate("/home", { replace: true })}>
                    {/* <Avatar style={{ marginRight: "10px" }}>{userData.name ? userData.name.charAt(0).toUpperCase() : null}</Avatar> */}
                    <AvatarPicDisply style={{ marginRight: "10px" }} />
                    {userData.name ? userData?.name : "My account"}
                  </MenuItem>
                  <Divider key="divider2" />
                  {[
                    isAdmin && <MenuAdmin key="admin-menu" />,
                    <MenuItem key="logout" onClick={() => navigate("/logout", { replace: true })}>
                      <ListItemIcon>
                        <LogoutIcon fontSize="small" style={{ color: "red" }} />
                      </ListItemIcon>
                      ออกระบบ
                    </MenuItem>,
                  ]}
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
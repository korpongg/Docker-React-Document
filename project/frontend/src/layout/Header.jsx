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
import SupervisorIcon from '@mui/icons-material/SupervisorAccountRounded';
import LogoWhite from "../assets/logo-white.svg";
import { Chip, Stack,Paper } from '@mui/material';
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
      /*const response = await axios.get(`${apiUrl}/checksupervisor/${userData.userid}`, config);
      if (response.status === 200 || response.status === 201) {
        localStorage.setItem("supervisorData", JSON.stringify(response.data));
      } else {
        console.log("Get Supervisor", response.statusText);
      }*/
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
        <MenuItem key="supmanager" onClick={() => handleNavigate("/supmanager")}>
          <ListItemIcon>
            <SupervisorIcon fontSize="small" style={{ color: "olivedrab" }} />
          </ListItemIcon>
          Supervisor
        </MenuItem>
        <MenuItem key="deptmanager" onClick={() => handleNavigate("/deptmanager")}>
          <ListItemIcon>
            <SettingIcon fontSize="small" style={{ color: "darkblue" }} />
          </ListItemIcon>
          จัดการแผนก/หน่วยงาน
        </MenuItem>
        <MenuItem hidden={true} key="exportdata" onClick={() => navigate("/occurrence/report")}>
          <ListItemIcon>
            <FileDownloadIcon fontSize="small" style={{color: "#2bcb2b"}} />
          </ListItemIcon>
          ดึงข้อร้องเรียน
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
              <MenuItem onClick={() => handleNavigate("/occurrence")}>หน้าส่งเมลล์</MenuItem>
                            <MenuItem onClick={() => handleNavigate("/complaints")}>หน้า complaint</MenuItem>
               <MenuItem onClick={() => handleNavigate("/complaintresponse")}>หน้าบันทึก</MenuItem>
        
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

          <Box sx={{ alignItems: "center", display: "flex", flexGrow: 0 ,}}>
            {userData && (
              <>
                <Typography variant="body1" onClick={() => handleNavigate("/home")} sx={{ display: { xs: "none", md: "block" }/*{ xs: "none", md: "block" }*/ }} className="Button-Text">หน้าหลัก</Typography>
                <Typography variant="body1" onClick={() => handleNavigate("/occurrence")} sx={{ display: "none"/*{ xs: "none", md: "block" }*/ }} className="Button-Text">หน้าส่งเมลล์</Typography>
                <Typography variant="body1" onClick={() => handleNavigate("/occurrence/event")} sx={{ display: "none"/*{ xs: "none", md: "block" }*/ }} className="Button-Text">xxxx</Typography>
                 <Typography variant="body1" onClick={() => handleNavigate("/complaints")} sx={{ display: "none"/*{ xs: "none", md: "block" }*/ }} className="Button-Text">หน้า complaint</Typography>
                   <Typography variant="body1" onClick={() => handleNavigate("/complaintresponse")} sx={{ display: "none"/*{ xs: "none", md: "block" }*/ }} className="Button-Text">หน้าบันทึก</Typography>
                 
                {showMedicationMenu && (
                  <Typography variant="body1" onClick={() => handleNavigate("/medication")} sx={{ display: "none"/*{ xs: "none", md: "block" }*/ }} className="Button-Text">yyyyy</Typography>
                )}

<IconButton
  onClick={handleClick}
  sx={{
    p: 0.5,
    ml: 1.5,
    borderRadius: "50%",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "rgba(255,255,255,0.12)",
    },
  }}
>
  <StyledBadge
    overlap="circular"
    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    variant="dot"
  >
    <AvatarPicDisply />
  </StyledBadge>
</IconButton>
               <StyledMenu
  id="account-menu"
  anchorEl={anchorEl}
  open={open}
  onClose={handleClose}
  transformOrigin={{ horizontal: "right", vertical: "top" }}
  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
>
  {/* PROFILE HEADER */}
  <Box className="menu-profile">
    <AvatarPicDisply style={{ width: 48, height: 48 }} />
<Box>
  <Typography
    className="name"
    sx={{ fontWeight: 600, lineHeight: 1.2 }}
  >
    {userData?.name ? userData?.name+' '+userData?.lastname : "My account"}
  </Typography>

  <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
    <Typography
      variant="caption"
      sx={{ color: "text.secondary" }}
    >
      UID: {userData?.userid}
    </Typography>

    <Chip
      label={userData?.dep}
      size="small"
      sx={{
        height: 20,
        fontSize: 12,
        backgroundColor: "#f1f5f9",
        color: "#334155",
        fontWeight: 500,
      }}
    />
  </Stack>
</Box>
  </Box>

  <Divider />

  {/* ADMIN MENU */}
  {isAdmin && <MenuAdmin />}

  {/* LOGOUT */}
  <MenuItem className="logout" onClick={() => handleNavigate("/logout")}>
    <ListItemIcon>
      <LogoutIcon fontSize="small" />
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
background: linear-gradient(
  180deg,
  #163870ff 0%,
 #014c82ff
);

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
    background-color: #22c55e; /* emerald */
    color: #22c55e;
    box-shadow: 0 0 0 2px #0b3a2d;
    width: 10px;
    height: 10px;
    border-radius: 50%;

    &::after {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      animation: ripple 1.4s infinite ease-in-out;
      border: 1px solid currentColor;
      content: "";
    }
  }

  @keyframes ripple {
    0% {
      transform: scale(1);
      opacity: 0.9;
    }
    100% {
      transform: scale(1.8);
      opacity: 0;
    }
  }
`;
const StyledMenu = styled(Menu)`
  .MuiPaper-root {
    border-radius: 14px;
    min-width: 260px;
    padding: 8px 0;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
  }

  .MuiMenuItem-root {
    font-size: 0.95rem;
    padding: 10px 16px;
    border-radius: 8px;
    margin: 4px 8px;

    &:hover {
      background-color: rgba(11, 58, 45, 0.08);
    }
  }

  .menu-profile {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
  }

  .menu-profile .name {
    font-weight: 600;
    color: #1f2937;
  }

  .menu-profile .role {
    font-size: 0.8rem;
    color: #6b7280;
  }

  .logout {
    color: #dc2626;

    .MuiListItemIcon-root {
      color: #dc2626;
      min-width: 36px;
    }

    &:hover {
      background-color: rgba(220, 38, 38, 0.08);
    }
  }
`;
const LeftContent = styled(Box)`
  @media screen and (min-width: 900px){
    display: none !important;
  }
    
`;



export default Header;
import React from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { HomeBox } from "../../styles/Home.style";
import { chkAdmins, chkAdmin } from "../../components/Function";

const Home = () => {
  const navigate = useNavigate();
const storedAuth = JSON.parse(localStorage.getItem("auth"));
  const userData = storedAuth ? JSON.parse(localStorage.getItem("userData")) : null;
  const supData = JSON.parse(localStorage.getItem("supervisorData")) || null;
  const isAdmin = chkAdmins(userData?.role);
  const isEXEC = chkAdmin(userData?.level);

  return (
    <HomeBox>
      <Box className="ItemBox mb-3">
  <Box className="menu-grid">
    {[
      {id:1, img: "image.png", title: "เริ่มใช้งาน",shot_title: "เริ่มใช้งาน" },
   ].map((item, index) => (
      <>
       { item.id==1 && (
        <Box
        key={index}
        className="LinkToMNG"
        onClick={() => navigate("/document")}
      >
     <div className="menu-card">
  <div className="menu-icon">
    <img src={`public/image/${item.img}`} />
  </div>

  <div className="menu-text">
    <h5>{item.shot_title}</h5>
    <p>คลิกเพื่อเข้าสู่เมนู</p>
  </div>
</div>
      </Box>
      )}
   

      </>
      
    ))}
  </Box>
</Box>
    </HomeBox>
  );
};

export default Home;

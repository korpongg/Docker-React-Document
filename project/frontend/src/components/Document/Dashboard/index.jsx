import React, { useState, useEffect } from "react";
import { useWebSocket } from "../../../context/WebSocketContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

import { chkAdmins, chkAdmin } from "../../Function";

import DataTable from "./DataTable";


import { Container, Stack, Paper, Typography, Box } from "@mui/material";


const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

const Dashboard = () => {
  const { connectWebSocket,requestData,isConnected, disconnectWebSocket, dataCenter2, dataEvent, load } = useWebSocket();

  const navigate = useNavigate();
  const storedAuth = JSON.parse(localStorage.getItem("auth"));
  const userData = storedAuth
    ? JSON.parse(localStorage.getItem("userData"))
    : null;
  const supData = JSON.parse(localStorage.getItem("supervisorData")) || null;
  const isAdmin = chkAdmins(userData?.role);

  const isEXEC = chkAdmin(userData?.level);

  const config = {
    headers: { Authorization: `Bearer ${storedAuth.accessToken}` },
  };
  const [dashboard, setDashboard] = useState([]);
  const [loading, setLoading] = useState(load);

useEffect(() => {
  if (isConnected && userData?.userid) {
    console.log("Requesting DATA2...");
    requestData("DATA2", {
      createby: userData.userid,
      excludeStatus: "3",
    });
  }
}, [isConnected, userData?.userid]);



  // function format date "YYYY-MM-DD"



useEffect(() => {
  if (!dataCenter2) return;

  console.log("RAW:", dataCenter2); // 🔥 debug

  setDashboard(dataCenter2); // ✅ เอาตรง ๆ ก่อน

  setLoading(false);
}, [dataCenter2]);


useEffect(() => {
  const handleForceRefresh = (event) => {
    const wsData = event.detail;

    console.log("Dashboard refresh:", wsData);

    if (
      wsData.type === "FORCE_REFRESH" &&
      wsData.requestType === "DATA2" &&
      userData?.userid
    ) {
      requestData("DATA2", {
        createby: userData.userid,
        excludeStatus: "3",
      });
    }
  };

  window.addEventListener("force-refresh", handleForceRefresh);

  return () => {
    window.removeEventListener("force-refresh", handleForceRefresh);
  };
}, [userData?.userid, isConnected]);


  const handleAddItem = () => {

    navigate(`/document/form`);
  };

  const handleViewClick = (id, role) => {

    navigate(`/document/form2/${id}`, {
      state: {
        reportid: role.reportid,
      },
    });
  };

  const handleViewClick2 = (data, role) => {

    navigate(`/document/form3`, {
      state: {
        reportid: role.reportid,
      },
    });
  };

  const handleViewClick3 = (data, role) => {

    navigate(`/document/form4`, {
      state: {
        reportid: role.reportid,
      },
    });
  };




  const handleEditClick = (id, role) => {
 
      id = role.reportid;
    navigate(`/ComplaintResponse/form/${id}`, {
      state: {
        reportid: role.reportid,
      },
    });
  };
  const handleEditClick2 = (id, role) => {

    id = role.reportid;
    navigate(`/document/form/${id}`, {
      state: {
        reportid: role.reportid,
      },
    });
  };

  const handleEditClick3 = (id, role) => {

    navigate(`/document/form3/${id}`, {
      state: {
        reportid: role.reportid,
      },
    });
  };
const handleEditClick4 = (id, row) => {
  navigate(`/document/form2/edit/${id}`, {
    state: {
      reportid: row.reportid,
      documentId: id,
      row,
    },
  });
};

  const handleDeleteClick = async (id) => {
    const result = await Swal.fire({
      title: "ยืนยันยกเลิกรายการ?",
      text: "คุณจะไม่สามารถย้อนกลับสิ่งนี้ได้!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ปิด",
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.delete(
          `${apiUrl}/document/${id}`,
          config,
        );
        if (response.status === 200 || response.status === 201) {
          Swal.fire("สำเร็จ!", "ยกเลิกรายการเรียบร้อย.", "success");
        }
      } catch (error) {
        console.error("ไม่สามารถทำการยกเลิกรายการได้:", error);
        Swal.fire(
          "พบข้อผิดพลาด!",
          "ไม่สามารถทำการยกเลิกรายการได้, กรุณาลองอีกครั้ง.",
          "error",
        );
      }
    }
  };


  return (
    <>
      <Box>
        <Container   
  disableGutters
  className="px-2"
 sx={{minWidth:'1270px'}}>
          <Stack spacing={3}>
            <Paper
              elevation={2}
              sx={{ borderRadius: 2, borderTop: "4px solid #142698ff" }}
            >
              <div className="mt-3 flex items-center gap-3">
                <Typography
                  variant="h5"
                  fontWeight={700}
                  sx={{ color: "#1e293b" }}
                >
                  ทะเบียนคุมเอกสาร
                </Typography>

                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 14px",
                    borderRadius: "999px",
                    background:
                      "linear-gradient(135deg, rgba(99,102,241,0.16), rgba(59,130,246,0.18))",
                    border: "1px solid rgba(99,102,241,0.22)",
                    boxShadow:
                      "0 4px 10px rgba(99,102,241,0.12), inset 0 1px 0 rgba(255,255,255,0.6)",
                    backdropFilter: "blur(6px)",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.9rem",
                      color: "#475569",
                      fontWeight: 600,
                    }}
                  >
                    ทั้งหมด
                  </span>

                  <span
                    style={{
                      fontSize: "1rem",
                      fontWeight: 800,
                      color: "#4338ca",
                      lineHeight: 1,
                    }}
                  >
                    {dashboard.length.toLocaleString()}
                  </span>

                  <span
                    style={{
                      fontSize: "0.85rem",
                      color: "#64748b",
                      fontWeight: 600,
                    }}
                  >
                    รายการ
                  </span>
                </div>
              </div>
              <div className="p-3">
                <DataTable
                  data={dashboard}
                  isAdmin={isAdmin}
                  isEXEC={isEXEC}
                  level={userData?.level}
                  userData={userData}
                  handleAddItem={handleAddItem}
                  handleViewClick={handleViewClick}
                  handleViewClick2={handleViewClick2}
                  handleViewClick3={handleViewClick3}
            
                  handleEditClick={handleEditClick}
                  handleEditClick2={handleEditClick2}
                  handleEditClick3={handleEditClick3}
                  handleEditClick4={handleEditClick4}
                  handleDeleteClick={handleDeleteClick}

                />
              </div>
            </Paper>
          </Stack>

        </Container>
      </Box>
    </>
  );
};

export default Dashboard;

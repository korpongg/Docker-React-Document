import React, { useState, useEffect } from "react";
import { useWebSocket } from "../../../context/WebSocketContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

import { chkAdmins, chkAdmin } from "../../Function";
import SearchBox from "./SearchBox";
import DataTable from "./DataTable";
import TranferDialog from "./TranferDialog";
import CloseIncidentDialog from "../../CloseIncidentDialog";

import { DashboardBox } from "../../../styles/Dashboard.style";

import { createGlobalStyle } from "styled-components";
import { Container, Stack, Paper, Typography, Box } from "@mui/material";

export const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'Prompt', sans-serif !important;
  }
    
`;

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

  const [eventData, setEventData] = useState([]);
  const [loading, setLoading] = useState(load);
  const [rowData, setRowData] = useState(null);

  const [tranType, setTranTypeData] = useState(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isCloseIncidentDialogOpen, setCloseIncidentDialogOpen] =
    useState(false);
  const [closeReason, setCloseReason] = useState("");
  const [closeComment, setCloseComment] = useState("");

  const [reportNo, setReportNo] = useState("");
  const [hn, setHn] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [depSelect, setDepSelect] = useState([]);
  const [incidentType, setIncidentType] = useState("0");
  const [formStatus, setFormStatus] = useState("-");

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
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    const year = date.getUTCFullYear();
    return `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;
  };

  const filterDataSearch = (rowData) => {
    const startDateObj = startDate ? formatDate(startDate) : null;
    const endDateObj = endDate ? formatDate(endDate, true) : null;
    const OccurrenceDate = formatDate(rowData.occurrencedate);

    const isSameDate = (date1, date2) =>
      formatDate(date1) === formatDate(date2);

    const isStartDateValid = startDateObj
      ? isSameDate(OccurrenceDate, startDateObj)
      : true;
    const isBetweenDates =
      startDateObj && endDateObj
        ? OccurrenceDate >= startDateObj && OccurrenceDate <= endDateObj
        : true;

    const reportNoMatch =
      reportNo === "" ||
      (rowData.reportid && rowData.reportid.includes(reportNo));
    const hnMatch = hn === "" || (rowData.hn && rowData.hn.includes(hn));
    const isDepSelectValid =
      depSelect.length === 0 ||
      rowData.deptrelate.some((dept) => depSelect.includes(dept));

    return (
      reportNoMatch &&
      hnMatch &&
      (startDateObj && endDateObj ? isBetweenDates : isStartDateValid) &&
      isDepSelectValid &&
      (incidentType === "0" || rowData.reporttypename === incidentType) &&
      (formStatus === "-" || rowData.formstatus === formStatus)
    );
  };

  // useEffect(() => {
  //   const filterData = () => {
  //     if (isAdmin) {
  //       setDashboard(dataCenter.filter(filterDataSearch));
  //       setEventData(dataEvent);
  //     } else if (isEXEC) {
  //       if (userData.affiliation === "งานคุณภาพ") {
  //         setDashboard(dataCenter.filter(filterDataSearch));
  //         setEventData(dataEvent);
  //       } else {
  //         const filteredData = dataCenter.filter((item) => item.requestaff === userData.affiliation);
  //         setDashboard(filteredData.filter(filterDataSearch));
  //       }
  //     } else {
  //       const filteredData = dataCenter.filter((item) =>item.requestaff === userData.affiliation &&item.requestdep === userData.dep);
  //       setDashboard(filteredData.filter(filterDataSearch));
  //     }
  //     setLoading(false);
  //   };

  //   filterData();
  // }, [dataCenter, dataEvent, reportNo, hn, startDate, endDate, depSelect, incidentType, formStatus]);
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

  const handleViewClick = (data, role) => {

    navigate(`/ComplaintResponse/form`, {
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
  const handleTranfClick = (id, data, type) => {
    setRowData(data);
    setTranTypeData(type);
    setDialogOpen(true);
  };

  const handleCloseClick = async (id, data) => {
    setCloseIncidentDialogOpen(true);
    setRowData({ id, data });
  };

  const handleConfirmClose = async () => {
    if (!closeReason) {
      Swal.fire("ผิดพลาด", "กรุณาเลือกสถานะข้อร้องเรียน", "error");
      return;
    }
    if (!closeComment) {
      Swal.fire("ผิดพลาด", "กรุณาใส่ความคิดเห็น", "error");
      return;
    }

    try {
      const payload = {
        id: rowData.id,
        formstatus: closeReason,
        comment: closeComment,
        updateby: userData.userid,
      };
      const response = await axios.put(`${apiUrl}/document`, payload, {
        ...config,
      });
      if (response.status === 200 || response.status === 201) {
        Swal.fire("สำเร็จ", "แก้ไขสถานะข้อร้องเรียนเรียบร้อยแล้ว", "success");

        setCloseIncidentDialogOpen(false);
        setCloseComment("");
        setCloseReason("");
      }
    } catch (error) {
      console.error(error);
      Swal.fire(
        "ผิดพลาด",
        "เกิดข้อผิดพลาดในการแก้ไขสถานะข้อร้องเรียน",
        "error",
      );
    }
  };

  // const handleCloseClick = async (id, data) => {
  //   const confirmed = await Swal.fire({
  //     title: 'ยืนยันปิดข้อร้องเรียน?',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonText: 'ยืนยัน',
  //     cancelButtonText: 'ยกเลิก',
  //   });
  //   if (confirmed.isConfirmed) {
  //     try {
  //       const response = await axios.put(`${apiUrl}/occurrences`, { id: id, formstatus: '2' }, { ...config });
  //       console.log(response.data);
  //       Swal.fire('สำเร็จ', 'ปิดข้อร้องเรียนเรียบร้อยแล้ว', 'success');
  //     } catch (error) {
  //       console.error(error);
  //       Swal.fire('ผิดพลาด', 'เกิดข้อผิดพลาดในการปิดข้อร้องเรียน', 'error');
  //     }
  //   }
  // };

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
  const handleEditClick4 = (id, role) => {

    navigate(`/document/form4/${id}`, {
      state: {
        reportid: role.reportid,
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

  const handleCloseDialog = () => {
    setRowData(null);
    setTranTypeData(null);
    setDialogOpen(false);
  };

  return (
    <>
      <Box>
        <Container sx={{minWidth:'1270px'}}>
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
                  handleTranfClick={handleTranfClick}
                  handleCloseClick={handleCloseClick}
                  handleEditClick={handleEditClick}
                  handleEditClick2={handleEditClick2}
                  handleEditClick3={handleEditClick3}
                  handleEditClick4={handleEditClick4}
                  handleDeleteClick={handleDeleteClick}
                  loading={loading}
                />
              </div>
            </Paper>
          </Stack>

          {/* Dialog ควรอยู่นอก Paper */}
          <TranferDialog
            userData={userData}
            config={config}
            isAdmin={isAdmin}
            rowData={rowData}
            tranType={tranType}
            eventData={eventData}
            setEventData={setEventData}
            isDialogOpen={isDialogOpen}
            handleCloseDialog={handleCloseDialog}
          />

          <CloseIncidentDialog
            isOpen={isCloseIncidentDialogOpen}
            type="Occurrence"
            closeReason={closeReason}
            setCloseReason={setCloseReason}
            closeComment={closeComment}
            setCloseComment={setCloseComment}
            handleConfirmClose={handleConfirmClose}
            handleCloseDialog={() => setCloseIncidentDialogOpen(false)}
          />
        </Container>
      </Box>
    </>
  );
};

export default Dashboard;

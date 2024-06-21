import React, { useState, useEffect } from "react";
import { useWebSocket } from "../../../context/WebSocketContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Swal from "sweetalert2";

import { chkAdmins, chkAdmin } from "../../Function";
import DataTable from "./DataTable";
import TranferDialog from "./TranferDialog";
import CloseIncidentDialog from "./CloseIncidentDialog";

import { DashboardBox } from "../../../styles/Dashboard.style";

const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

const Dashboard = () => {
  const { connectWebSocket, disconnectWebSocket, dataCenter, dataEvent, load } = useWebSocket();
  const navigate = useNavigate();
  const storedAuth = JSON.parse(localStorage.getItem("auth"));
  const userData = storedAuth ? JSON.parse(localStorage.getItem("userData")) : null;
  const isAdmin = chkAdmins(userData?.role);
  const isEXEC = chkAdmin(userData?.level);
  const config = { headers: { Authorization: `Bearer ${storedAuth.accessToken}` } };
  const [dashboard, setDashboard] = useState([]);
  const [eventData, setEventData] = useState([]);
  const [loading, setLoading] = useState(load);
  const [rowData, setRowData] = useState(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isCloseIncidentDialogOpen, setCloseIncidentDialogOpen] = useState(false);
  const [closeReason, setCloseReason] = useState("");
  const [closeComment, setCloseComment] = useState("");

  useEffect(() => {
    connectWebSocket();

    return () => {
      disconnectWebSocket();
    };
  }, []);

  useEffect(() => {
    const filterData = () => {
      if (isAdmin) {
        setDashboard(dataCenter);
        setEventData(dataEvent);
      } else if (isEXEC) {
        if (userData.affiliation === "งานคุณภาพ") {
          setDashboard(dataCenter);
          setEventData(dataEvent);
        } else {
          const filteredData = dataCenter.filter((item) => item.requestaff === userData.affiliation);
          setDashboard(filteredData);
        }
      } else {
        const filteredData = dataCenter.filter((item) =>item.requestaff === userData.affiliation &&item.requestdep === userData.dep);
        setDashboard(filteredData);
      }
      setLoading(false);
    };

    filterData();
  }, [dataCenter, dataEvent]);

  const handleAddItem = () => {
    disconnectWebSocket();
    navigate(`/occurrence/form`);
  };

  const handleViewClick = (id, data, role) => {
    disconnectWebSocket();
    navigate(`/occurrence/${id}`);
  };

  const handleTranfClick = (id, data, role) => {
    setRowData(data);
    setDialogOpen(true);
  };

  const handleCloseClick = async (id, data) => {
    setCloseIncidentDialogOpen(true);
    setRowData({ id, data });
  };

  const handleConfirmClose = async () => {
    if (!closeReason) {
      Swal.fire("ผิดพลาด", "กรุณาเลือกสถานะอุบัติการณ์", "error");
      return;
    }
    if (closeReason === "5" && !closeComment) {
      Swal.fire(
        "ผิดพลาด",
        'กรุณาใส่ความคิดเห็นเมื่อเลือก "ไม่ใช่อุบัติการณ์"',
        "error"
      );
      return;
    }

    try {
      const payload = { id: rowData.id, formstatus: closeReason };
      if (closeReason === "5") {
        payload.comment = closeComment;
      }

      const response = await axios.put(`${apiUrl}/occurrences`, payload, {
        ...config,
      });
      console.log(response.data);
      Swal.fire("สำเร็จ", "แก้ไขสถานะอุบัติการณ์เรียบร้อยแล้ว", "success");

      setCloseIncidentDialogOpen(false);
      setCloseComment("");
      setCloseReason("");
    } catch (error) {
      console.error(error);
      Swal.fire("ผิดพลาด", "เกิดข้อผิดพลาดในการแก้ไขสถานะอุบัติการณ์", "error");
    }
  };

  // const handleCloseClick = async (id, data) => {
  //   const confirmed = await Swal.fire({
  //     title: 'ยืนยันปิดอุบัติการณ์?',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonText: 'ยืนยัน',
  //     cancelButtonText: 'ยกเลิก',
  //   });
  //   if (confirmed.isConfirmed) {
  //     try {
  //       const response = await axios.put(`${apiUrl}/occurrences`, { id: id, formstatus: '2' }, { ...config });
  //       console.log(response.data);
  //       Swal.fire('สำเร็จ', 'ปิดอุบัติการณ์เรียบร้อยแล้ว', 'success');
  //     } catch (error) {
  //       console.error(error);
  //       Swal.fire('ผิดพลาด', 'เกิดข้อผิดพลาดในการปิดอุบัติการณ์', 'error');
  //     }
  //   }
  // };

  const handleEditClick = (id, data) => {
    disconnectWebSocket();
    navigate(`/occurrence/form/${id}`);
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
          `${apiUrl}/occurrences/${id}`,
          config
        );
        if (response.status === 200 || response.status === 201) {
          Swal.fire("สำเร็จ!", "ยกเลิกรายการเรียบร้อย.", "success");
        }
      } catch (error) {
        console.error("ไม่สามารถทำการยกเลิกรายการได้:", error);
        Swal.fire(
          "พบข้อผิดพลาด!",
          "ไม่สามารถทำการยกเลิกรายการได้, กรุณาลองอีกครั้ง.",
          "error"
        );
      }
    }
  };

  const handleCloseDialog = () => {
    setRowData(null);
    setDialogOpen(false);
  };

  return (
    <DashboardBox>
      <h1>รายงานอุบัติการณ์</h1>

      <div>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            Accordion 1
          </AccordionSummary>
          <AccordionDetails>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2-content"
            id="panel2-header"
          >
            Accordion 2
          </AccordionSummary>
          <AccordionDetails>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </AccordionDetails>
        </Accordion>
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3-content"
            id="panel3-header"
          >
            Accordion Actions
          </AccordionSummary>
          <AccordionDetails>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </AccordionDetails>
        </Accordion>
      </div>

      <DataTable
        data={dashboard}
        isAdmin={isAdmin}
        isEXEC={isEXEC}
        userData={userData}
        handleAddItem={handleAddItem}
        handleViewClick={handleViewClick}
        handleTranfClick={handleTranfClick}
        handleCloseClick={handleCloseClick}
        handleEditClick={handleEditClick}
        handleDeleteClick={handleDeleteClick}
        loading={loading}
      />

      <TranferDialog
        userData={userData}
        config={config}
        isAdmin={isAdmin}
        rowData={rowData}
        eventData={eventData}
        setEventData={setEventData}
        isDialogOpen={isDialogOpen}
        handleCloseDialog={handleCloseDialog}
      />

      <CloseIncidentDialog
        isOpen={isCloseIncidentDialogOpen}
        closeReason={closeReason}
        setCloseReason={setCloseReason}
        closeComment={closeComment}
        setCloseComment={setCloseComment}
        handleConfirmClose={handleConfirmClose}
        handleCloseDialog={() => setCloseIncidentDialogOpen(false)}
      />
    </DashboardBox>
  );
};

export default Dashboard;
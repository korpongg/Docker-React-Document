import React, { useState, useEffect } from "react";
import { useWebSocket } from "../../context/WebSocketContext";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

import { chkHead, chkAdmins, chkAdmin, chkMedic } from "../Function";
import { DashboardBox } from "../../styles/Dashboard.style";
import DataTable from "./DataTable";
import CloseIncidentDialog from "../CloseIncidentDialog";
import ApproveDialog from "./ApproveDialog";

const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

const Medication = () => {
  const { connectWebSocket, disconnectWebSocket, dataMedic, load } = useWebSocket();
  const navigate = useNavigate();
  const storedAuth = JSON.parse(localStorage.getItem("auth"));
  const userData = storedAuth ? JSON.parse(localStorage.getItem("userData")) : null;
  const isHead = chkHead(userData?.level);
  const isAdmin = chkAdmins(userData?.role);
  const isEXEC = chkAdmin(userData?.level);
  const config = { headers: { Authorization: `Bearer ${storedAuth.accessToken}` } };
  const [dashboard, setDashboard] = useState([]);
  const [loading, setLoading] = useState(load);
  const [rowData, setRowData] = useState(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isCloseIncidentDialogOpen, setCloseIncidentDialogOpen] = useState(false);
  const [closeReason, setCloseReason] = useState("");
  const [closeComment, setCloseComment] = useState("");

  const showMedicationMenu = isAdmin || chkMedic(userData?.AffID, userData?.DepID) || (isEXEC && userData?.affiliation === "งานคุณภาพ");

  useEffect(() => {
    if (!showMedicationMenu) {
      disconnectWebSocket();
      window.location.href = '/unauthorized';
    }
  }, [showMedicationMenu]);

  useEffect(() => {
    connectWebSocket();
    return () => disconnectWebSocket();
  }, []);

  useEffect(() => {
    if (!dataMedic) return;

    let filteredData = dataMedic;
    if (!isAdmin) {
      if (isEXEC) {
        filteredData = userData.affiliation === "งานคุณภาพ"
          ? dataMedic
          : dataMedic.filter(item => item.deptAffInfo.AffName === userData.affiliation);
      } else {
        filteredData = dataMedic.filter(item => (item.requestaff === userData.affiliation && item.requestdep === userData.dep) || userData.DepID === item.deptrelate);
      }
    }

    if (JSON.stringify(dashboard) !== JSON.stringify(filteredData)) {
      setDashboard(filteredData);
    }

    setLoading(false);
  }, [dataMedic, isAdmin, isEXEC, userData, dashboard]);

  const handleAddItem = () => {
    disconnectWebSocket();
    navigate(`/medication/form`);
  };

  const handleViewClick = (id, data, role) => {
    disconnectWebSocket();
    navigate(`/medication/${id}`);
  };

  const handleApproveClick = (id, data, type) => {
    setRowData(data);
    setDialogOpen(true);
  };

  const handleCloseClick = async (id, data) => {
    setCloseIncidentDialogOpen(true);
    setRowData({ id, data });
  };

  const handleConfirmClose = async () => {
    if (!closeReason || (closeReason === "6" && !closeComment)) {
      const errorMessage = closeReason === "6" ? "กรุณาใส่ความคิดเห็นเมื่อเลือก 'ไม่ใช่อุบัติการณ์'" : "กรุณาเลือกสถานะความคลาดเคลื่อนยา";
      Swal.fire("ผิดพลาด", errorMessage, "error");
      return;
    }

    try {
      const payload = { id: rowData.id, formstatus: closeReason, updateby: userData.userid };
      if (closeReason === "5") {
        payload.comment = closeComment;
      }

      const response = await axios.put(`${apiUrl}/medication`, payload, { ...config });
      if (response.status === 200 || response.status === 201) {
        Swal.fire("สำเร็จ", "แก้ไขสถานะความคลาดเคลื่อนยาเรียบร้อยแล้ว", "success");
  
        setCloseIncidentDialogOpen(false);
        setCloseComment("");
        setCloseReason("");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("ผิดพลาด", "เกิดข้อผิดพลาดในการแก้ไขสถานะความคลาดเคลื่อนยา", "error");
    }
  };

  const handleCloseDialog = () => {
    setRowData(null);
    setCloseIncidentDialogOpen(false);
  };

  const handleEditClick = (id, data) => {
    disconnectWebSocket();
    navigate(`/medication/form/${id}`);
  };

  const handleDeleteClick = async (id) => {
    const result = await Swal.fire({
      title: 'ยืนยันยกเลิกรายการ?',
      text: "คุณจะไม่สามารถย้อนกลับสิ่งนี้ได้!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ปิด'
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.delete(`${apiUrl}/medication/${id}/${userData.userid}`, config);
        if (response.status === 200 || response.status === 201) {
          Swal.fire('สำเร็จ!', 'ยกเลิกรายการเรียบร้อย.', 'success');
        }
      } catch (error) {
        console.error("ไม่สามารถทำการยกเลิกรายการได้:", error);
        Swal.fire('พบข้อผิดพลาด!', 'ไม่สามารถทำการยกเลิกรายการได้, กรุณาลองอีกครั้ง.', 'error');
      }
    }
  };

  return (
    showMedicationMenu ? (
      <DashboardBox>
        <h1>รายงานความคลาดเคลื่อนยา</h1>
        <DataTable
          data={dashboard}
          isHead={isHead}
          isAdmin={isAdmin}
          isEXEC={isEXEC}
          userData={userData}
          handleAddItem={handleAddItem}
          handleViewClick={handleViewClick}
          handleApproveClick={handleApproveClick}
          handleCloseClick={handleCloseClick}
          handleEditClick={handleEditClick}
          handleDeleteClick={handleDeleteClick}
          loading={loading}
        />

        <ApproveDialog
          apiUrl={apiUrl}
          config={config}
          isOpen={isDialogOpen}
          setDialogOpen={setDialogOpen}
          reportData={rowData}
          setReportData={setRowData}
          userData={userData}
        />

        <CloseIncidentDialog
          isOpen={isCloseIncidentDialogOpen}
          type="Medication"
          closeReason={closeReason}
          setCloseReason={setCloseReason}
          closeComment={closeComment}
          setCloseComment={setCloseComment}
          handleConfirmClose={handleConfirmClose}
          handleCloseDialog={handleCloseDialog}
        />
      </DashboardBox>
    ) : null
  );
};

export default Medication;
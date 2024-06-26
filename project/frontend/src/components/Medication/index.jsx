import React, { useState, useEffect } from "react";
import { useWebSocket } from "../../context/WebSocketContext";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

import { chkAdmins, chkAdmin, chkMedic } from "../Function";
import DataTable from "./DataTable";

import { DashboardBox } from "../../styles/Dashboard.style";

const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

const Medication = () => {
  const { connectWebSocket, disconnectWebSocket, dataMedic, load } = useWebSocket();
  const navigate = useNavigate();
  const storedAuth = JSON.parse(localStorage.getItem("auth"));
  const userData = storedAuth ? JSON.parse(localStorage.getItem("userData")) : null;
  const isAdmin = chkAdmins(userData?.role);
  const isEXEC = chkAdmin(userData?.level);
  const config = { headers: { Authorization: `Bearer ${storedAuth.accessToken}` } };
  const [dashboard, setDashboard] = useState([]);
  const [loading, setLoading] = useState(load);

  const showMedicationMenu = isAdmin || chkMedic(userData?.AffID, userData?.DepID) || (isEXEC && userData?.affiliation === "งานคุณภาพ");

  useEffect(() => {
    if (!showMedicationMenu) {
      navigate('/unauthorized');
      return;
    }
  }, [showMedicationMenu]);

  useEffect(() => {
    connectWebSocket();

    return () => {
      disconnectWebSocket();
    };
  }, []);

  useEffect(() => {
    if (!dataMedic) return;

    let filteredData = [];
    if (isAdmin) {
      filteredData = dataMedic;
    } else if (isEXEC) {
      filteredData = userData.affiliation === "งานคุณภาพ" ? dataMedic : dataMedic.filter(item => item.deptAffInfo.AffName === userData.affiliation);
    } else {
      filteredData = dataMedic.filter(item => item.requestaff === userData.affiliation && item.requestdep === userData.dep);
    }
    setDashboard(filteredData);
    setLoading(false);
  }, [dataMedic, isAdmin, isEXEC, userData]);

  const handleAddItem = () => {
    disconnectWebSocket();
    navigate(`/medication/form`);
  };

  const handleViewClick = (id, data, role) => {
    disconnectWebSocket();
    navigate(`/medication/${id}`);
  };

  const handleEditClick = (id, data) => {
    disconnectWebSocket();
    navigate(`/medication/form/${id}`);
  };

  const handleApproveClick = (id, data) => {
    disconnectWebSocket();
    navigate(`/medication/form/approve/${id}`);
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
        const response = await axios.delete(`${apiUrl}/medication/${id}`, config);
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
          isAdmin={isAdmin}
          isEXEC={isEXEC}
          userData={userData}
          handleAddItem={handleAddItem}
          handleViewClick={handleViewClick}
          handleEditClick={handleEditClick}
          handleDeleteClick={handleDeleteClick}
          handleApproveClick={handleApproveClick}
          loading={loading}
        />
      </DashboardBox>
    ) : null
  );
};

export default Medication;
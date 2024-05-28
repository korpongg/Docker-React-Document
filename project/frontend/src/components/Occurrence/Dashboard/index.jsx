import React, { useState, useEffect } from "react";
import { useWebSocket } from '../../../context/WebSocketContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";

import { chkAdmins, chkAdmin } from "../../Function";
import DataTable from "./DataTable";
import TranferDialog from "./TranferDialog";

import { DashboardBox } from "../../../styles/Dashboard.style";

const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

const IndexPage = () => {
  const { connectWebSocket, disconnectWebSocket, dataCenter, load } = useWebSocket();
  const navigate = useNavigate();
  const storedAuth = JSON.parse(localStorage.getItem("auth"));
  const userData = storedAuth ? JSON.parse(localStorage.getItem("userData")) : null;
  const isAdmin = chkAdmins(userData?.role);
  const isEXEC = chkAdmin(userData?.level);
  const config = { headers: { Authorization: `Bearer ${storedAuth.accessToken}` } };
  const [dashboard, setDashboard] = useState([]);
  const [loading, setLoading] = useState(load);
  const [rowData, setRowData] = useState(null);
  const [eventData, setEventData] = useState([]);
  const [isDialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    connectWebSocket();

    return () => {
      disconnectWebSocket();
    };
  }, []);

  useEffect(() => {
    if (isAdmin) {
      setDashboard(dataCenter);
      setLoading(false);
    } else if (isEXEC) {
      if (userData.affiliation === "งานคุณภาพ") {
        setDashboard(dataCenter);
        setLoading(false);
      } else {
        const filteredData = dataCenter.filter(item => item.requestaff === userData.affiliation);
        setDashboard(filteredData);
        setLoading(false);
      }
    } else {
      const filteredData = dataCenter.filter(item => item.requestaff === userData.affiliation && item.requestdep === userData.dep);
      setDashboard(filteredData);
      setLoading(false);
    }
  }, [dataCenter]);

  const handleAddItem = () => {
    localStorage.removeItem("FormData");
    navigate(`/occurrence/form`);
  };

  const handleViewClick = (id, data, role) => {
    navigate(`/occurrence/${id}`);
  };

  const handleTranfClick = (id, data, role) => {
    setRowData(data);
    setDialogOpen(true);
  };

  const handleEditClick = (id, data) => {
    // console.log(data)
    navigate(`/occurrence/form/${id}`);
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
        const response = await axios.delete(`${apiUrl}/occurrences/${id}`, config);
        if (response.status === 200 || response.status === 201)
          Swal.fire(
            'สำเร็จ!',
            'ยกเลิกรายการเรียบร้อย.',
            'success'
          );
      } catch (error) {
        console.error("ไม่สามารถทำการยกเลิกรายการได้:", error);
        Swal.fire(
          'พบข้อผิดพลาด!',
          'ไม่สามารถทำการยกเลิกรายการได้, กรุณาลองอีกครั้ง.',
          'error'
        );
      }
    }
  };

  const handleCloseDialog = () => {
    setRowData(null);
    setEventData([]);
    setDialogOpen(false);
  };

  return (
    <>
      <DashboardBox>
        <DataTable
          data={dashboard}
          isAdmin={isAdmin}
          isEXEC={isEXEC}
          userData={userData}
          handleAddItem={handleAddItem}
          handleViewClick={handleViewClick}
          handleTranfClick={handleTranfClick}
          handleEditClick={handleEditClick}
          handleDeleteClick={handleDeleteClick}
          loading={loading}
        />

        <TranferDialog
          config={config}
          rowData={rowData}
          isAdmin={isAdmin}
          eventData={eventData}
          setEventData={setEventData}
          isDialogOpen={isDialogOpen}
          setDialogOpen={setDialogOpen}
          handleCloseDialog={handleCloseDialog}
        />
      </DashboardBox>
    </>
  );
};

export default IndexPage;
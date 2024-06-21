import React, { useState, useEffect } from "react";
import { useWebSocket } from "../../../context/WebSocketContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

import { chkAdmins, chkAdmin } from "../../Function";
import SearchBox from "./SearchBox";
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

  const [reportNo, setReportNo] = useState("");
  const [hn, setHn] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [depSelect, setDepSelect] = useState([]);
  const [incidentType, setIncidentType] = useState("0");

  useEffect(() => {
    connectWebSocket();

    return () => {
      disconnectWebSocket();
    };
  }, []);

  const filterDataSearch = (rowData) => {
    return (
      (reportNo === "" || rowData.reportid === reportNo) &&
      (hn === "" || rowData.hn === hn) &&
      (depSelect.length === 0 || depSelect.includes(rowData.deptrelate)) &&
      (incidentType === "0" || rowData.reporttypename === incidentType)
    );
  };

  useEffect(() => {
    const filterData = () => {
      if (isAdmin) {
        setDashboard(dataCenter.filter(filterDataSearch));
        setEventData(dataEvent);
      } else if (isEXEC) {
        if (userData.affiliation === "งานคุณภาพ") {
          setDashboard(dataCenter.filter(filterDataSearch));
          setEventData(dataEvent);
        } else {
          const filteredData = dataCenter.filter((item) => item.requestaff === userData.affiliation);
          setDashboard(filteredData.filter(filterDataSearch));
        }
      } else {
        const filteredData = dataCenter.filter((item) =>item.requestaff === userData.affiliation &&item.requestdep === userData.dep);
        setDashboard(filteredData.filter(filterDataSearch));
      }
      setLoading(false);
    };

    filterData();
  }, [dataCenter, dataEvent, reportNo, hn, startDate, endDate, depSelect, incidentType]);

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

      <SearchBox
        reportNo={reportNo}
        setReportNo={setReportNo}
        hn={hn}
        setHn={setHn}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        setDepSelect={setDepSelect}
        incidentType={incidentType}
        setIncidentType={setIncidentType}
      />

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
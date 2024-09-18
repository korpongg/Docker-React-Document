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

export const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'Prompt', sans-serif !important;
  }
`;

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
  const [tranType, setTranTypeData] = useState(null);
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
  const [formStatus, setFormStatus] = useState("-");

  useEffect(() => {
    connectWebSocket();

    return () => {
      disconnectWebSocket();
    };
  }, []);

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

    const isSameDate = (date1, date2) => formatDate(date1) === formatDate(date2);

    const isStartDateValid = startDateObj ? isSameDate(OccurrenceDate, startDateObj) : true;
    const isBetweenDates = startDateObj && endDateObj ? OccurrenceDate >= startDateObj && OccurrenceDate <= endDateObj : true;

    const reportNoMatch = reportNo === "" || (rowData.reportid && rowData.reportid.includes(reportNo));
    const hnMatch = hn === "" || (rowData.hn && rowData.hn.includes(hn));
    const isDepSelectValid = depSelect.length === 0 || rowData.deptrelate.some(dept => depSelect.includes(dept));

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
    if (!dataCenter) return;

    let filteredData = dataCenter;
    if (userData.userid === '500217') {
      filteredData = dataCenter.filter(item => [113].includes(item.requestdepID) || item.requestdep === userData.dep);
    }
    else if (userData.userid === '631201') {
      filteredData = dataCenter.filter(item => [92].includes(item.requestdepID) || item.requestdep === userData.dep);
    }
    else if (userData.userid === '600109') {
      filteredData = dataCenter.filter(item => [98].includes(item.requestdepID) || item.requestdep === userData.dep);
    }
    else if (userData.userid === '450043') {
      filteredData = dataCenter.filter(item => [156].includes(item.requestdepID) || item.requestdep === userData.dep);
    }
    else if (userData.userid === '590068') {
      filteredData = dataCenter.filter(item => [112].includes(item.requestdepID) || item.requestdep === userData.dep);
    }
    else if (userData.userid === '570058') {
      filteredData = dataCenter.filter(item => [122].includes(item.requestdepID) || item.requestdep === userData.dep);
    }
    else if (userData.userid === '670423') {
      filteredData = dataCenter.filter(item => [114].includes(item.requestdepID) || item.requestdep === userData.dep);
    }
    else if (userData.userid === '620511') {
      filteredData = dataCenter.filter(item => [117].includes(item.requestdepID) || item.requestdep === userData.dep);
    }
    else if (userData.userid === '650930') {
      filteredData = dataCenter.filter(item => [115].includes(item.requestdepID) || item.requestdep === userData.dep);
    }
    else if (userData.userid === '470029') {
      filteredData = dataCenter.filter(item => [120].includes(item.requestdepID) || item.requestdep === userData.dep);
    }
    else if (userData.userid === '600113') {
      filteredData = dataCenter.filter(item => [121].includes(item.requestdepID) || item.requestdep === userData.dep);
    }
    else if (!isAdmin) {
      if (isEXEC) {
        filteredData = userData.affiliation === "งานคุณภาพ" ? dataCenter : dataCenter.filter(item => item.requestaff === userData.affiliation);
      } else {
        filteredData = dataCenter.filter(item => (item.requestaff === userData.affiliation && item.requestdep === userData.dep));
      }
    }
    filteredData = filteredData.filter(filterDataSearch);

    if (JSON.stringify(dashboard) !== JSON.stringify(filteredData)) {
      setDashboard(filteredData);
    }

    setLoading(false);
  }, [dataCenter, isAdmin, isEXEC, userData, dashboard]);

  const handleAddItem = () => {
    disconnectWebSocket();
    navigate(`/occurrence/form`);
  };

  const handleViewClick = (id, data, role) => {
    disconnectWebSocket();
    navigate(`/occurrence/${id}`);
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
      Swal.fire("ผิดพลาด", "กรุณาเลือกสถานะอุบัติการณ์", "error");
      return;
    }
    if (!closeComment) {
      Swal.fire(
        "ผิดพลาด",
        'กรุณาใส่ความคิดเห็น',
        "error"
      );
      return;
    }

    try {
      const payload = { id: rowData.id, formstatus: closeReason, comment: closeComment, updateby: userData.userid };
      const response = await axios.put(`${apiUrl}/occurrences`, payload, { ...config });
      if (response.status === 200 || response.status === 201) {
        Swal.fire("สำเร็จ", "แก้ไขสถานะอุบัติการณ์เรียบร้อยแล้ว", "success");
  
        setCloseIncidentDialogOpen(false);
        setCloseComment("");
        setCloseReason("");
      }
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
    setTranTypeData(null);
    setDialogOpen(false);
  };

  return (
    <>
      <GlobalStyle />
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
          depSelect={depSelect}
          setDepSelect={setDepSelect}
          incidentType={incidentType}
          setIncidentType={setIncidentType}
          formStatus={formStatus}
          setFormStatus={setFormStatus}
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
      </DashboardBox>
    </>
  );
};

export default Dashboard;
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";

import { chkAdmins, chkAdmin } from "../../Function";
import DataTable from "./DataTable";
import TranferDialog from "./TranferDialog";

import { DashboardBox } from "../../../styles/Dashboard.style";

const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

const IndexPage = () => {
  const navigate = useNavigate();
  const storedAuth = JSON.parse(localStorage.getItem("auth"));
  const userData = storedAuth ? JSON.parse(localStorage.getItem("userData")) : null;
  const isAdmin = chkAdmins(userData?.role);
  const isEXEC = chkAdmin(userData?.level);
  const config = { headers: { Authorization: `Bearer ${storedAuth.accessToken}` } };
  const [dashboard, setDashboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rowData, setRowData] = useState(null);
  const [eventData, setEventData] = useState([]);
  const [isDialogOpen, setDialogOpen] = useState(false);

  const filterData = (data) => {
    if (isAdmin) return data;

    if (isEXEC) {
      if (userData.affiliation === "งานคุณภาพ") {
        return data;
      }
      return data.filter(item =>
        item.deptAffInfo.some(dept => dept.AffName === userData.affiliation)
      );
    }

    return data.filter(item =>
      item.deptAffInfo.some(dept => dept.AffName === userData.affiliation && dept.DepName === userData.dep)
    );
  };

  // Fetch data based on start and end dates
  const fetchData = async () => {
    setLoading(true);
    try {
      const url = `${apiUrl}/occurrences`;
      const response = await axios.get(url, { ...config });
      const filteredData = filterData(response.data);
      setDashboard(filteredData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch data on component mount
  }, []);

  const handleAddItem = () => {
    navigate(`/occurrence/form`);
  };

  const handleViewClick = (id, data, role) => {
    navigate(`/occurrence/${id}`);
  };

  const handleTranfClick = (id, data, role) => {
    setRowData(data);
    setDialogOpen(true);
  };

  const handleEditClick = (id, row) => {
    console.log(row)
    navigate(`/occurrence/form/${id}`);
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
          userData={userData}
          handleAddItem={handleAddItem}
          handleViewClick={handleViewClick}
          handleTranfClick={handleTranfClick}
          handleEditClick={handleEditClick}
          loading={loading}
        />

        <TranferDialog
          config={config}
          rowData={rowData}
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
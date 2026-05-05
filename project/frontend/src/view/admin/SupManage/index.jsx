import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, TextField, InputAdornment, IconButton } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import SupTable from "./SupTable";
import AddSup from "./AddSup";
import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'Prompt', sans-serif !important;
  }
    
  ::-webkit-scrollbar {
    width: 20px;
  }
`;

const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

const SupManagement = () => {
  const storedAuth = JSON.parse(localStorage.getItem("auth"));
  const config = { headers: { Authorization: `Bearer ${storedAuth.accessToken}` } };
  const [supData, setSupData] = useState([]);
  const [depData, setDepData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const url = `${apiUrl}/supervisor`;
      const response = await axios.get(url, { ...config });
      if (response.status === 200 || response.status === 201) {
        setSupData(response.data);
      } else {
        console.error("Error", response.status);
      }
    } catch (error) {
      console.error("Error Get Supervisor", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDeptData = async () => {
    try {
      const url = `${apiUrl}/departments`;
      const response = await axios.get(url);
      setDepData(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchDeptData();
  }, []);

  const handleFilterChange = (e) => {
    setFilter(e.target.value); // Update the filter state as user types
  };

  const handleClearFilter = () => {
    setFilter(""); // Clear the filter input
  };

  const filteredData = supData.filter((sup) => {
    const lowerCaseFilter = filter.toLowerCase();
  
    const matchesSupName = sup.supName.toLowerCase().includes(lowerCaseFilter);
    const matchesUserId = sup.userid.toLowerCase().includes(lowerCaseFilter);
    const matchesDepName = sup.deptAffInfo.some(dep =>
      dep.DepName.toLowerCase().includes(lowerCaseFilter)
    );
  
    return matchesSupName || matchesUserId || matchesDepName;
  });

  return (
    <SupBox>
      <GlobalStyle />
      <Box className="SupManageFrame">
        <Box className="SupHeader">Supervisor Manager</Box>

        <Box className="SupToolbox">
          <Box sx={{ width: "250px", marginLeft: "20px" }}>
            <TextField
              label="ค้นหารหัส, ชื่อ, แผนก"
              variant="outlined"
              size="small"
              placeholder="รหัสพนักงาน, ชื่อ, แผนก"
              value={filter}
              onChange={handleFilterChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {filter && (
                      <IconButton onClick={handleClearFilter}>
                        <ClearIcon />
                      </IconButton>
                    )}
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Box sx={{ marginRight: "20px" }}>
            <AddSup depData={depData} fetch={fetchData} />
          </Box>
        </Box>

        <SupTable data={filteredData} depData={depData} fetch={fetchData} loading={loading} />
      </Box>
    </SupBox>
  );
};

export default SupManagement;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, TextField, InputAdornment, IconButton } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import AddDept from "./AddDept";
import DeptTable from "./DeptTable";
import { DepartBox } from "../../../styles/DeptManage.style";
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

const DeptManagement = () => {
    const [deptData, setDeptData] = useState([]);
    const [affData, setAffData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState("");

    const fetchData = async () => {
        setLoading(true);
        try {
            const url = `${apiUrl}/departments`;
            const response = await axios.get(url);
            if (response.status === 200 || response.status === 201) {
                setDeptData(response.data);
            }
            else {
                console.error("Error", response.status)
            }
        } catch (error) {
            console.error("Error Get Department", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAff = async () => {
        try {
            const url = `${apiUrl}/affiliations`;
            const response = await axios.get(url);
            if (response.status === 200 || response.status === 201) {
                setAffData(response.data);
            }
            else {
                console.error("Error", response.status)
            }
        } catch (error) {
            console.error("Error", error);
        }
    };

    useEffect(() => {
        fetchData();
        fetchAff();
    }, []);

    const handleFilterChange = (e) => {
        setFilter(e.target.value); // Update the filter state as user types
    };

    const handleClearFilter = () => {
        setFilter(""); // Clear the filter input
    };

    const filteredData = deptData.filter((dept) =>
        dept.DepName.toLowerCase().includes(filter.toLowerCase()) // Filter by department name
    );

    return (
        <DepartBox>
            <GlobalStyle />
            <Box className="DepManageFrame">
                <Box className="DepHeader">Department Manager</Box>

                <Box className="DepToolbox">
                    <Box sx={{ width: "250px", marginLeft: "20px" }}>
                        <TextField
                          label="ค้นหาแผนก/หน่วยงาน"
                          variant="outlined"
                          size="small"
                          placeholder="ชื่อแผนก"
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
                        <AddDept affs={affData} fetch={fetchData} />
                    </Box>
                </Box>

                <DeptTable data={filteredData} affs={affData} fetch={fetchData} loading={loading} />
            </Box>
        </DepartBox>
    )
}

export default DeptManagement;
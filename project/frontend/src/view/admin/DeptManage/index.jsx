import React, { useEffect, useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
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

    const fetchData = async () => {
        setLoading(true);
        try {
            const url = `${apiUrl}/departments`;
            const response = await axios.get(url);
            if (response.status === 200 || response.status === 201) {
                setDeptData(response.data);
            }
            else {
                console.error("Error compute", response.status)
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
                console.error("Error group", response.status)
            }
        } catch (error) {
            console.error("Error Get Method with 'group' Function", error);
        }
    };

    useEffect(() => {
        fetchData();
        fetchAff();
    }, []);

    return (
        <DepartBox>
            <GlobalStyle />
            <Box className="QuestionManagementFrame">
                <Box className="QuestionsHeader">Department Manager</Box>

                <Box className="QMToolbox">
                    <Box sx={{ width: "250px", marginLeft: "20px" }}></Box>
                    <Box sx={{ marginRight: "20px" }}>
                        <AddDept affs={affData} fetch={fetchData} />
                    </Box>
                </Box>

                <DeptTable data={deptData} affs={affData} fetch={fetchData} loading={loading} />
            </Box>
        </DepartBox>
    )
}

export default DeptManagement;
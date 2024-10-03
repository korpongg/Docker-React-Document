import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { Box, TextField, Button, Select, MenuItem, FormControl, InputLabel, Alert } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

const AddUser = () => {
    const navigate = useNavigate();
    const storedAuth = JSON.parse(localStorage.getItem("auth"));
    const config = { headers: { Authorization: `Bearer ${storedAuth.accessToken}` } };
    const [factData, setFactData] = useState([]);
    const [depData, setDepData] = useState([]);
    const [filterDepData, setFilterDepData] = useState([]);
    const [userId, setUserId] = useState('');
    const [jobtitle, setJobTitle] = useState('');
    const [name, setName] = useState('');
    const [lastname, setLastname] = useState('');
    const [title, setTitle] = useState('');
    const [affiliation, setAff] = useState('');
    const [faction, setFact] = useState('');
    const [dep, setDep] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchFactData = async () => {
        try {
            const url = `${apiUrl}/factions`;
            const response = await axios.get(url, { ...config });
            if (response.status === 200 || response.status === 201) {
                setFactData(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    };

    const fetchDepData = async () => {
        try {
            const url = `${apiUrl}/departments`;
            const response = await axios.get(url, { ...config });
            if (response.status === 200 || response.status === 201) {
                setDepData(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    };

    useEffect(() => {
        fetchDepData();
        fetchFactData();
    }, []);

    const handleAddUser = async (event) => {
        event.preventDefault();
        setLoading(true);

        // Validation checks
        let isValid = true;

        if (!userId || userId.length < 6 || userId.length > 10) {
            console.log(userId);
            setResponse({ success: false, message: 'รหัสพนักงานต้องมีความยาวระหว่าง 6-10 ตัวอักษร' });
            isValid = false;
            setLoading(false);
            return;
        }

        if (!faction) {
            setResponse({ success: false, message: 'กรุณาเลือกสังกัด' });
            isValid = false;
            setLoading(false);
            return;
        }

        if (!dep) {
            setResponse({ success: false, message: 'กรุณาเลือกแผนก' });
            isValid = false;
            setLoading(false);
            return;
        }

        if (!title) {
            setResponse({ success: false, message: 'กรุณาเลือกคำนำหน้า' });
            isValid = false;
            setLoading(false);
            return;
        }

        if (!name) {
            setResponse({ success: false, message: 'กรุณากรอกชื่อ' });
            isValid = false;
            setLoading(false);
            return;
        }

        if (!lastname) {
            setResponse({ success: false, message: 'กรุณากรอกนามสกุล' });
            isValid = false;
            setLoading(false);
            return;
        }

        if (!isValid) {
            return; // Stop submission if there are validation errors
        }

        try {
            // Assuming depItem is fetched from depData based on selected dep
            const depItem = depData.find(item => item.DepName === dep);

            const response = await axios.post(`${apiUrl}/users`, {
                userid: userId,
                jobtitle,
                name,
                lastname,
                title,
                affiliation: depItem.AffName,
                faction,
                dep,
            }, { ...config });
            if (response.status === 200 || response.status === 201) {
                alert('เพิ่มผู้ใช้งานเรียบร้อยแล้ว');
                navigate('/usermanager');
            }

            setResponse({ success: true, message: result.data.message });
        } catch (error) {
            setResponse({ success: false, message: error });
        } finally {
            setLoading(false);
        }
    };

    // Function to handle faction change
    const handleFactionChange = async (event) => {
        const selectedFactionName = event.target.value;
        setFact(selectedFactionName); // Update local state with selected faction
    
        // Reset dep select whenever faction changes or resets
        setDep('');
    
        try {
            // Fetch the related faction data based on the selected faction name
            const selectedFaction = factData.find(item => item.name === selectedFactionName);
    
            if (selectedFaction) {
                // Get the related affiliation ID from selected faction
                const affId = selectedFaction.relateid;
    
                // Filter departments based on affiliation ID
                const filteredDepartments = depData.filter(dep => dep.AffID === affId);
                
                // Update filterDepData state with filtered departments
                setFilterDepData(filteredDepartments);
            }
        } catch (error) {
            console.error("Failed to filter departments:", error);
        }
    };

    return (
        <AddUserBox>
            <h1>เพิ่มผู้ใช้งาน</h1>
            <form onSubmit={handleAddUser}>
                <Grid container spacing={2}>

                    <Grid xs={12} md={6}>
                        <input style={{ marginBottom: 0 }} type="text" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="รหัสพนักงาน" minLength={6} maxLength={10} disabled={loading} />
                    </Grid>
                    
                    <Grid xs={12} md={6}>
                        <input style={{ marginBottom: 0 }} type="text" value={jobtitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="ตำแหน่ง" minLength={1} maxLength={100} disabled={loading} />
                    </Grid>

                    <Grid container xs={12}>
                        <Grid xs={12} md={6}>
                            <select value={faction} onChange={handleFactionChange} disabled={loading}>
                                <option value="">เลือกสังกัด</option>
                                <option value="-">ไม่ระบุ</option>
                                {factData.map((factItem, index) => (
                                    <option key={index} value={factItem.name}>{factItem.name}</option>
                                ))}
                            </select>
                        </Grid>

                        <Grid xs={12} md={6}>
                            <select value={dep} onChange={(e) => setDep(e.target.value)} disabled={loading || !faction}>
                                <option value="">เลือกแผนก</option>
                                <option value="-">ไม่ระบุ</option>
                                {filterDepData.map((depItem, index) => (
                                    <option key={index} value={depItem.DepName}>{depItem.DepName}{depItem.FacName ? ' ('+depItem.FacName+')' : null}</option>
                                ))}
                            </select>
                        </Grid>
                    </Grid>
                    
                    <Grid container xs={12}>
                        <Grid container spacing={0} xs={12} md={4}>
                            <select value={title} onChange={(e) => setTitle(e.target.value)} disabled={loading}>
                                <option value="">เลือกคำนำหน้า</option>
                                <option value="นาย">นาย</option>
                                <option value="นางสาว">นางสาว</option>
                                <option value="นาง">นาง</option>
                                <option value="นพ.">นพ.</option>
                                <option value="พญ.">พญ.</option>
                            </select>
                        </Grid>

                        <Grid container xs={12} md={8}>
                            <Grid xs={12} sm={6}>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="ชื่อ" disabled={loading} maxLength={30} />
                            </Grid>

                            <Grid xs={12} sm={6}>
                                <input type="text" value={lastname} onChange={(e) => setLastname(e.target.value)} placeholder="นามสกุล" disabled={loading} maxLength={30} />
                            </Grid>
                        </Grid>
                    </Grid>

                </Grid>

                <button onClick={handleAddUser} disabled={loading}>บันทึก</button>
            </form>

            {response && (<Alert severity={response.success ? 'success' : 'error'}>{response.message}</Alert>)}
        </AddUserBox>
    );
};

const AddUserBox = styled(Box)`
  display: block;
  justify-content: center;
  background-color: #fff;
  border-radius: 14px;
  padding: 30px;
  width: 50vw;

  h1 {
    font-size: 1.625rem;
    margin-top: 0;
  }

  input {
    background: rgb(242, 242, 242);
    border: none;
    border-radius: 18px;
    color: #000;
    // display: block;
    font-family: inherit;
    font-size: 1rem;
    padding: 10px 15px;
    position: relative;
    width: 90%;
  }
  select {
    background: rgb(242, 242, 242);
    border-radius: 18px;
    color: #000;
    cursor: pointer;
    font-family: inherit;
    font-size: 1rem;
    padding: 10px 15px;
    width: 98%;
  }

  button {
    background: rgb(242, 242, 242);
    border: none;
    border-radius: 20px;
    font-family: inherit;
    font-size: 1rem;
    height: 44px;
    margin-top: 25px;
    margin-bottom: 15px;
    padding: 10px 30px;
    position: relative;
    background: rgb(22, 188, 182);
    color: rgb(255, 255, 255);
    cursor: pointer;
    height: 50px;
  }

  @media screen and (max-width: 1200px) {
    margin-top: 30px;
    padding: 30px 10px;
    width: 86vw;
  }
`;

export default AddUser;
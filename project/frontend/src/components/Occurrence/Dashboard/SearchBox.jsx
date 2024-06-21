import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Autocomplete, Checkbox, TextField, MenuItem, FormControl, InputLabel, Select } from "@mui/material";
import CheckBoxOutlineIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { SearchContainer } from "../../../styles/Dashboard.style";

const icon = <CheckBoxOutlineIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

const SearchBox = ({reportNo, setReportNo, hn, setHn, startDate, setStartDate, endDate, setEndDate, setDepSelect, incidentType, setRiskLevel }) => {
  const [departmentData, setDepartmentData] = useState([]);
  
  const fetchDeptData = useCallback(async () => {
    let response;
    try {
      response = await axios.get(apiUrl + "/departments");
      setDepartmentData(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  }, [apiUrl]);
  
  useEffect(() => {
    fetchDeptData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  return (
    <>
      <SearchContainer>
        <Grid2 container spacing={2}>
          <Grid2 container xs={12} md={6} align="center" justify="center" alignItems="center">
            <Grid2 xs={4} style={{textAlign: "right"}}>เลขที่เอกสาร</Grid2>
            <Grid2 xs={8}>
              <TextField
                id="reportNo"
                fullWidth
                onBlur={(e) => setReportNo(e.target.value)}
                variant="outlined"
              />
            </Grid2>
          </Grid2>
          <Grid2 container xs={12} md={6} align="center" justify="center" alignItems="center">
            <Grid2 xs={4} align="right">HN</Grid2>
            <Grid2 xs={8}>
              <TextField
                id="hn"
                fullWidth
                onBlur={(e) => setHn(e.target.value)}
                variant="outlined"
              />
            </Grid2>
          </Grid2>
          <Grid2 container xs={12} md={6} align="center" justify="center" alignItems="center">
            <Grid2 xs={4} align="right">วันที่เกิดเหตุ</Grid2>
            <Grid2 xs={8}>
              <TextField
                id="startDate"
                fullWidth
                type="date"
                value={startDate}
                onChange={handleStartDateChange}
                variant="outlined"
                InputLabelProps={{
                  shrink: true
                }}
                // InputProps={{
                //   inputProps: {
                //     max: formatDate(new Date().toISOString()),
                //   },
                // }}
              />
            </Grid2>
          </Grid2>
          <Grid2 container xs={12} md={6} align="center" justify="center" alignItems="center">
            <Grid2 xs={4} align="right">ถึงวันที่</Grid2>
            <Grid2 xs={8}>
              <TextField
                id="endDate"
                fullWidth
                type="date"
                value={endDate}
                onChange={handleEndDateChange}
                variant="outlined"
                InputLabelProps={{
                  shrink: true
                }}
                // InputProps={{
                //   inputProps: {
                //     max: formatDate(new Date().toISOString()),
                //   },
                // }}
              />
            </Grid2>
          </Grid2>
          <Grid2 container xs={12} md={6} align="center" justify="center" alignItems="center">
            <Grid2 xs={4} align="right">แผนก</Grid2>
            <Grid2 xs={8}>
              <FormControl fullWidth variant="outlined">
                <Autocomplete
                  multiple
                  limitTags={1}
                  id="checkboxes-deps"
                  options={departmentData}
                  onChange={(event, newValue) => {
                    const selectedIds = newValue.map(option => option.id);
                    setDepSelect(selectedIds);
                  }}
                  disableCloseOnSelect
                  // getOptionLabel={(option) => option.DepName}
                  getOptionLabel={(option) => `${option.DepName} (${option.AffName})`}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {/* {option.DepName} */}
                      {`${option.DepName} (${option.AffName})`}
                    </li>
                  )}
                  style={{ paddingRight: "10px", width: "100%" }}
                  renderInput={(params) => (<TextField {...params} label="แผนก" placeholder="แผนก" />)}
                />
              </FormControl>
            </Grid2>
          </Grid2>
          <Grid2 container xs={12} md={6} align="center" justify="center" alignItems="center">
            <Grid2 xs={4} align="right">ประเภทอุบัติการณ์</Grid2>
            <Grid2 xs={8}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>ประเภทอุบัติการณ์</InputLabel>
                <Select
                  value={incidentType}
                  onChange={(e) => setRiskLevel(e.target.value)}
                  label="ประเภทอุบัติการณ์"
                >
                    <MenuItem value="0">แสดงผลทั้งหมด</MenuItem>
                    <MenuItem value="Clinical Risk">Clinical Risk</MenuItem>
                    <MenuItem value="General Risk">General Risk</MenuItem>
                </Select>
              </FormControl>
            </Grid2>
          </Grid2>
        </Grid2>
      </SearchContainer>
    </>
  );
};

export default SearchBox;
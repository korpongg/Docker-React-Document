import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Autocomplete, Checkbox, Chip, TextField, MenuItem, FormControl, InputLabel, Select, Button } from "@mui/material";
import CheckBoxOutlineIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import ClearIcon from '@mui/icons-material/SearchOffRounded';
import { SearchContainer } from "../../../styles/Dashboard.style";

const icon = <CheckBoxOutlineIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

const SearchBox = ({ reportNo, setReportNo, hn, setHn, startDate, setStartDate, endDate, setEndDate, depSelect, setDepSelect, incidentType, setIncidentType, reportType }) => {
  const [value, setValue] = useState("");
  const [value2, setValue2] = useState("");
  const [departmentData, setDepartmentData] = useState([]);

  const fetchDeptData = useCallback(async () => {
    try {
      const baseUrl = reportType !== 'Medication' ? `${apiUrl}/departments` : `${apiUrl}/departmentsMed`;
      const response = await axios.get(baseUrl);
      setDepartmentData(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  }, [reportType]);

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

  const handleClear = () => {
    setReportNo("");
    setValue("");
    setHn("");
    setValue2("");
    setStartDate("");
    setEndDate("");
    setDepSelect([]);
    if (reportType !== "Medication") setIncidentType("0");
  };

  const handleDeptChange = (event, newValue) => {
    const selectedIds = newValue.map((option) => option.id);
    setDepSelect(selectedIds);
  };

  const handleSelectChange = (e) => {
    setIncidentType(e.target.value);
  };

  return (
    <>
      <SearchContainer>
        <Grid2 container spacing={2}>
          <Grid2 container spacing={1} xs={12} md={6} align="center" justify="center" alignItems="center">
            <Grid2 xs={12} md={4} style={{ textAlign: "right" }}>เลขที่เอกสาร</Grid2>
            <Grid2 xs={12} md={8}>
              <TextField
                id="reportNo"
                fullWidth
                variant="outlined"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onBlur={(e) => setReportNo(e.target.value)}
              />
            </Grid2>
          </Grid2>
          <Grid2 container spacing={1} xs={12} md={6} align="center" justify="center" alignItems="center">
            <Grid2 xs={12} md={4} align="right">HN</Grid2>
            <Grid2 xs={12} md={8}>
              <TextField
                id="hn"
                fullWidth
                variant="outlined"
                value={value2}
                onChange={(e) => setValue2(e.target.value)}
                onBlur={(e) => setHn(e.target.value)}
              />
            </Grid2>
          </Grid2>
          <Grid2 container spacing={1} xs={12} md={6} align="center" justify="center" alignItems="center">
            <Grid2 xs={12} md={4} align="right">วันที่เกิดเหตุ</Grid2>
            <Grid2 xs={12} md={8}>
              <TextField
                id="startDate"
                fullWidth
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </Grid2>
          </Grid2>
          <Grid2 container spacing={1} xs={12} md={6} align="center" justify="center" alignItems="center">
            <Grid2 xs={12} md={4} align="right">ถึงวันที่</Grid2>
            <Grid2 xs={12} md={8}>
              <TextField
                id="endDate"
                fullWidth
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: startDate }}
              />
            </Grid2>
          </Grid2>
          <Grid2 container spacing={1} xs={12} md={6} align="center" justify="center" alignItems="center">
            <Grid2 xs={12} md={4} align="right">แผนก</Grid2>
            <Grid2 xs={12} md={8}>
              <FormControl fullWidth variant="outlined">
                <Autocomplete
                  multiple
                  limitTags={1}
                  id="checkboxes-deps"
                  options={departmentData}
                  value={departmentData.filter((dep) => depSelect.includes(dep.id))}
                  onChange={handleDeptChange}
                  disableCloseOnSelect
                  // getOptionLabel={(option) => option.DepName}
                  getOptionLabel={(option) => `${option.DepName} (${option.AffName})`}
                  renderOption={(props, option, { selected }) => {
                    const { key, ...restProps } = props;
                    return (
                      <li key={key} {...restProps}>
                        <Checkbox
                          icon={icon}
                          checkedIcon={checkedIcon}
                          style={{ marginRight: 8 }}
                          checked={selected}
                        />
                        {`${option.DepName} (${option.AffName})`}
                      </li>
                    );
                  }}
                  renderTags={(value, getTagProps) => 
                    value.map((option, index) => {
                      const { key, ...restProps } = getTagProps({ index });
                      return (
                        <Chip
                          key={key}
                          label={option.DepName} // or however you want to display the label
                          {...restProps}
                        />
                      );
                    })
                  }
                  
                  style={{ paddingRight: "10px", width: "100%" }}
                  renderInput={(params) => (<TextField {...params} label="แผนก" placeholder="แผนก" />)}
                />
              </FormControl>
            </Grid2>
          </Grid2>
          <Grid2 container spacing={1} xs={12} md={6} align="center" justify="center" alignItems="center">
            {reportType !== 'Medication' && (
              <>
                <Grid2 xs={12} md={4} align="right">ประเภทอุบัติการณ์</Grid2>
                <Grid2 xs={12} md={8}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>ประเภทอุบัติการณ์</InputLabel>
                    <Select
                      value={incidentType}
                      onChange={handleSelectChange}
                      label="ประเภทอุบัติการณ์"
                    >
                      <MenuItem value="0">แสดงผลทั้งหมด</MenuItem>
                      <MenuItem value="Clinical Risk">Clinical Risk</MenuItem>
                      <MenuItem value="General Risk">General Risk</MenuItem>
                    </Select>
                  </FormControl>
                </Grid2>
              </>
           )}
          </Grid2>
          <Grid2 container spacing={1} xs={12} align="center" justify="center" alignItems="center">
            <Grid2 xs={12} align="right">
              <Button color="error" variant="contained" startIcon={<ClearIcon />} onClick={handleClear}>Clear</Button>
            </Grid2>
          </Grid2>
        </Grid2>
      </SearchContainer>
    </>
  );
};

export default SearchBox;
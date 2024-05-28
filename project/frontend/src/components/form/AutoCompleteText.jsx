import React, { useState, useEffect, useCallback } from "react";
import { TextField, Autocomplete } from '@mui/material';
import axios from "axios";

function jsonStringToArray(jsonString) {
  try {
    const parsedValue = JSON.parse(jsonString);
    if (Array.isArray(parsedValue)) {
      return parsedValue;
    } else {
      throw new Error('The parsed value is not an array.');
    }
  } catch (error) {
    console.error('Invalid JSON string:', error);
    return null;
  }
}

function filterDataByIds(data, ids) {
  return data.filter(item => ids.includes(item.id));
}

function AutoCompleteText({ data, datacolumn, handleDataChangeCheckbox, label }) {
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

  const [departmentData, setDepartmentData] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState(data[datacolumn]||[]);
  const fetchDeptData = useCallback(async () => {
    try {
      const response = await axios.get(apiUrl + "/departments");
      setDepartmentData(response.data);

      if (data[datacolumn]) {
        const initialSelectedDepartments = response.data.filter(dept => data[datacolumn].includes(dept.id));
        setSelectedDepartments(initialSelectedDepartments);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  }, [apiUrl, data, datacolumn]);

  useEffect(() => {
    fetchDeptData();
  }, []);
  useEffect(() => {
    setSelectedDepartments(filterDataByIds(departmentData, data[datacolumn]))
  }, [departmentData]);

  useEffect(() => {
    handleDataChangeCheckbox(selectedDepartments.map(dept => dept.id), datacolumn);
  }, [selectedDepartments]);

  const handleChange = (event, values) => {
    setSelectedDepartments(values);
  };

  return (
    <>
      <Autocomplete
        multiple
        sx={{width:"860px",padding:"unset"}}
        options={departmentData}
        getOptionLabel={(option) => option.DepName}
        value={selectedDepartments}
        onChange={handleChange}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        renderInput={(params) => (
          <TextField {...params} label={label} variant="outlined" />
        )}
      />
    </>
  );
}

export default AutoCompleteText;

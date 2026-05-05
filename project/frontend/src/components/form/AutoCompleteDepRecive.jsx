import React, { useState, useEffect, useCallback } from "react";
import { TextField, Autocomplete } from '@mui/material';
import axios from "axios";

function AutoCompleteText({ Mode,data, item = {}, datacolumn,index,datacolumn2,setChangePerson, handleDataChangeCheckbox, label }) {
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
  const [departmentData, setDepartmentData] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);

  const fetchDeptData = useCallback(async () => {
    let response;
    try {
      
        response = await axios.get(apiUrl + "/departments");
      
      setDepartmentData(response.data);

      if (data[datacolumn]) {
        }
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  }, [apiUrl]);

  useEffect(() => {
 
    fetchDeptData();
  }, []);

useEffect(() => {
  if (departmentData.length > 0) {
    const found = departmentData.find(
      (opt) => opt.id.toString() === data.department_received?.toString()
    );

    if (found?.id?.toString() !== selectedValue?.id?.toString()) {
      setSelectedValue(found || null);
    }
  }
}, [departmentData, data.department_received]); // ✅ ใช้อันนี้

const handleChange = (event, newValue) => {
  setSelectedValue(newValue);
  setChangePerson(event, newValue, index);
};
  
  return (
    <>
<Autocomplete
  options={departmentData}
  
  getOptionLabel={(option) =>
    option ? `${option.id}  ${option.DepName}` : ""
  }
  isOptionEqualToValue={(option, value) =>
    option.id.toString() === value?.id?.toString()
  }
 value={selectedValue}
onChange={(event, newValue) => {
  setSelectedValue(newValue);
  setChangePerson(newValue.id); // ไม่ต้องส่ง event ก็ได้
}}
style={{width:'400px',marginLeft:'10px'}}
  renderInput={(params) => (
    <TextField {...params} label="ค้นหา" />
  )}
/>
    </>
  );
}

export default AutoCompleteText;

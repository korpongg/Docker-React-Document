import React, { useState, useEffect, useCallback } from "react";
import { TextField, Autocomplete } from '@mui/material';
import axios from "axios";

function AutoCompleteTextSingle({ Mode,data, datacolumn,setDataFunction,setSingleDataFunction, handleDataChangeCheckbox }) {
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

  const [departmentData, setDepartmentData] = useState([]);
  // const [selectedDepartmentNo, setSelectedDepartmentNo] = useState(data[datacolumn] || null);
  // const [selectedDepartment, setSelectedDepartment] = useState(null);

  const fetchDeptData = useCallback(async () => {
    let response;
    try {
      
      response = await axios.get(apiUrl + "/departmentsMed");
      setDepartmentData(response.data);
      
    } catch (error) {
      console.error("Error fetching department:", error);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchDeptData();
  }, []);


  // useEffect(() => {
  //   if (data[datacolumn]) {
  //     const initialSelectedDepartment = departmentData.filter(row => data[datacolumn] === row.id);
  //     setSelectedDepartment(initialSelectedDepartment[0]);
      
  //   }
  // }, [departmentData]);

  // useEffect(() => {
  //   if(selectedDepartmentNo){
  //     setSingleDataFunction(selectedDepartmentNo.id,datacolumn);
  //   }
  // }, [selectedDepartmentNo]);

  // const handleDepartmentChange = (event, newValue) => {
  //   setSelectedDepartmentNo(newValue);
  // };

  return (
    <>
    {/* {console.log("Ori",departmentData)} */}

    {/* <Autocomplete
      disablePortal
      id="deptrelate"
      disabled={Mode === "Show"}
      sx={{ width: "860px", padding: "unset" }}
      options={departmentData}
      onChange={handleDepartmentChange}
      isOptionEqualToValue={(option, value) => option.id === value.id} // Customize equality check
      value={selectedDepartment || null}
      getOptionLabel={(option) => option.DepName}
      renderInput={(params) => <TextField {...params} variant="outlined" />}
    /> */}
      <select
        className="SelectInput"
        id={datacolumn}
        disabled={Mode==="Show"}
        name={datacolumn}
        style={{width:"800px"}}
        form={datacolumn}
        value={data[datacolumn] || "0"}
        onChange={(e) => setDataFunction(e, [datacolumn])}
      >
        {departmentData.map((row,departmentDataindex)=>(
          <option key={departmentDataindex} value={row.id}>{row.DepName}</option>

        ))}
        <option value="0">-กรุณาเลือก-</option>
      </select>

    </>
  );
}

export default AutoCompleteTextSingle;

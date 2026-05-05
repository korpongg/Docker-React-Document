import React, { useState, useEffect, useCallback } from "react";
import { TextField, Autocomplete } from "@mui/material";
import axios from "axios";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

function AutoCompleteText({
  Mode,
  data,
  datacolumn,
  datacolumn2,
  handleDataChangeCheckbox,
  label,
      setErrors,
                errors,
                inputRefs,
}) {
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
  const [departmentData, setDepartmentData] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);

  const fetchDeptData = useCallback(async () => {
    try {
      const response = await axios.get(apiUrl + "/departments");
      setDepartmentData(response.data|| []);
    } catch (error) {
      console.error(error);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchDeptData();
  }, [fetchDeptData]);

  // ✅ set ค่าเริ่มต้น
useEffect(() => {
  if (
    departmentData.length > 0 &&
    Array.isArray(data?.[datacolumn])
  ) {
    const initialSelected = departmentData.filter(dept =>
      data[datacolumn].includes(dept.id)
    );

    setSelectedDepartments(initialSelected);
  }
}, [departmentData, data, datacolumn]);

  return (
    <>
<Autocomplete
  multiple
  limitTags={4}
  fullWidth
  disabled={Mode === "Show"}
  options={departmentData}
  getOptionLabel={(option) => option.DepName || ""}
  value={selectedDepartments}
  onChange={(event, values) => {
    setSelectedDepartments(values);

    // clear error เมื่อมีค่า
    setErrors((prev) => ({ ...prev, deptrelate: false }));

    handleDataChangeCheckbox(
      values.map((d) => d.id),
      values.map((d) => d.email),
      datacolumn,
      datacolumn2
    );
  }}
  isOptionEqualToValue={(option, value) => option.id === value.id}
  renderInput={(params) => (
    <TextField
      {...params}
      label="หน่วยงานที่เกี่ยวข้อง"
      variant="outlined"
      error={errors.deptrelate}
     helperText={
  errors.deptrelate && (
    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <ErrorOutlineIcon fontSize="small" />
      กรุณาเลือกอย่างน้อย 1 หน่วยงาน
    </span>
  )
}
      inputRef={(el) => (inputRefs.current.deptrelate = el)}
    />
  )}
/>
    </>
  );
}

export default AutoCompleteText;

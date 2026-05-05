import React, { useState, useEffect, useCallback, useRef } from "react";
import { TextField, Autocomplete } from "@mui/material";
import axios from "axios";

function AutoCompleteText2({
  Mode,
  data,
  datacolumn,
  datacolumn2,
  handleDataChangeCheckbox,
  label
}) {
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

  const [departmentData, setDepartmentData] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);

  const initializedRef = useRef(false); // ⭐ สำคัญมาก

  // 1️⃣ fetch departments
  const fetchDeptData = useCallback(async () => {
    try {
      const res = await axios.get(`${apiUrl}/departments`);
      setDepartmentData(res.data || []);
    } catch (err) {
      console.error(err);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchDeptData();
  }, [fetchDeptData]);

  // 2️⃣ set ค่าเริ่มต้น แค่ครั้งเดียว
  useEffect(() => {
    if (
      !initializedRef.current &&
      departmentData.length > 0 &&
      Array.isArray(data?.[datacolumn])
    ) {
      const initialSelected = departmentData.filter(dept =>
        data[datacolumn].map(Number).includes(Number(dept.id))
      );

      setSelectedDepartments(initialSelected);
      initializedRef.current = true; // 🔒 ล็อกไว้
    }
  }, [departmentData, data, datacolumn]);

  // 3️⃣ user change เท่านั้น ถึงส่งขึ้น parent
  const handleChange = (event, values) => {
    setSelectedDepartments(values);

    handleDataChangeCheckbox(
      values.map(v => v.id),
      values.map(v => v.email),
      datacolumn,
      datacolumn2
    );
  };

  return (
    <Autocomplete
      multiple
      limitTags={4}
      fullWidth
      disabled={Mode === "Show"}
      options={departmentData}
      value={selectedDepartments}
      getOptionLabel={(option) => option.DepName || ""}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      onChange={handleChange}
      renderInput={(params) => (
        <TextField {...params} label={label} variant="outlined" />
      )}
    />
  );
}

export default AutoCompleteText2;
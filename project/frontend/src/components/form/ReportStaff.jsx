import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';

import ReportStaffStyle from "../../styles/ReportStaffStyle.style";

const ReportStaff = ({ Mode,data, setDataFunction, setData }) => {
  const [isChecked, setIsChecked] = useState(data?.reportdoc === "0");
  const [isCheckedAcknowledge, setIsCheckedAcknowledge] = useState(data?.reportacknowledge === "0");
  const [isCheckedOther, setIsCheckedOther] = useState(data?.reportother === "0");

  useEffect(() => {
    if (data) {
      setIsChecked(data.reportdoc === "1");
      setIsCheckedAcknowledge(data.reportacknowledge === "1");
      setIsCheckedOther(data.reportother === "1");
    }
  }, [data]);

  const handleCheckboxChange = (event) => {
    const { checked } = event.target;
    setIsChecked(checked);
    setData(checked ? "1" : "0", "reportdoc");
  };

  const handleCheckboxChangeAcknowledge = (event) => {
    const { checked } = event.target;
    setIsCheckedAcknowledge(checked);
    setData(checked ? "1" : "0", "reportacknowledge");
  };

  const handleCheckboxChangeOther = (event) => {
    const { checked } = event.target;
    setIsCheckedOther(checked);
    setData(checked ? "1" : "0", "reportother");
  };

  return (
    <>
      <ReportStaffStyle>
        <Box className="TopicHeader">การดำเนินการหลังเกิดเหตุการณ์</Box>
        <Box className="CheckBoxMain" sx={{ marginBottom: "25px", width: "900px" }}>
          <RadioGroup
            sx={{ p: 1 }}
            row
            id="medicalrecorded"
            aria-labelledby="medicalrecorded"
            defaultValue="0"
            name="medicalrecorded"
            onChange={(e) => setDataFunction(e, "medicalrecorded")}
            value={data?.medicalrecorded || "0"}
          >
            <FormControlLabel
              sx={{ p: 1 }}
              disabled={Mode==="Show"}
              value="0"
              control={<Radio />}
              label="ไม่ได้บันทึกในเวชระเบียน"
            />
            <FormControlLabel
              sx={{ p: 1 }}
              disabled={Mode==="Show"}
              value="1"
              control={<Radio />}
              label="บันทึกในเวชระเบียน"
            />
          </RadioGroup>

          <FormGroup>
            <FormControlLabel
              control={<Checkbox checked={isChecked} disabled={Mode==="Show"} onChange={handleCheckboxChange} />}
              label="รายงานแพทย์"
            />
          </FormGroup>

          {isChecked && (
            <TextField
              fullWidth
              disabled={Mode==="Show"}
              id="docname"
              label="คำสั่งแพทย์"
              value={data?.docname || ""}
              onChange={(e) => setDataFunction(e, "docname")}
              variant="filled"
            />
          )}

          <FormGroup>
            <FormControlLabel
              control={<Checkbox disabled={Mode==="Show"} checked={isCheckedAcknowledge} onChange={handleCheckboxChangeAcknowledge} />}
              label="รายงานหัวหน้าแผนก/ผู้จัดการฝ่าย/ผู้ตรวจการพยาบาล รับทราบ"
            />
          </FormGroup>

          <FormGroup>
            <FormControlLabel
              control={<Checkbox checked={isCheckedOther} disabled={Mode==="Show"} onChange={handleCheckboxChangeOther} />}
              label="อื่นๆ..."
            />
          </FormGroup>

          {isCheckedOther && (
            <TextField
              fullWidth
              id="reportotherremark"
              disabled={Mode==="Show"}
              label="อื่นๆ"
              value={data?.reportotherremark || ""}
              onChange={(e) => setDataFunction(e, "reportotherremark")}
              variant="filled"
            />
          )}
        </Box>
      </ReportStaffStyle>
    </>
  );
};

export default ReportStaff;

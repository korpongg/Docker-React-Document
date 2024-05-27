import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
// import StatusLable from "../label.json";

import ReportStaffStyle from "../../styles/ReportStaffStyle.style";

const ReportStaff = ({data,setDataFunction,setData}) => {
  const [isChecked, setIsChecked] = useState(data?.reportdoc || false);
  const [isCheckedAcknowledge, setIsCheckedAcknowledge] = useState(data?.reportacknowledge || false);
  const [isCheckedOther, setIsCheckedOther] = useState(data?.reportother || false);
  // const [isCheckedmedicalrecorded, setIsCheckedmedicalrecorded] = useState(data?.medicalrecorded || false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };
  const handleCheckboxChangeAcknowledge = () => {
    setIsCheckedAcknowledge(!isCheckedAcknowledge);
  };
  const handleCheckboxChangeOther = () => {
    setIsCheckedOther(!isCheckedOther);
  };

  // const handleCheckboxChangemedicalrecorded = () => {
  //   setIsCheckedmedicalrecorded(!isCheckedmedicalrecorded);
  // };

  useEffect(()=>{
    setData(isChecked,"reportdoc")
  },[isChecked])
  useEffect(()=>{
    setData(isCheckedAcknowledge,"reportacknowledge")
  },[isCheckedAcknowledge])
  useEffect(()=>{
    setData(isCheckedOther,"reportother")
  },[isCheckedOther])
  // useEffect(()=>{
  //   setData(isCheckedmedicalrecorded,"medicalrecorded")
  // },[isCheckedmedicalrecorded])

  return (
    <>
      <ReportStaffStyle>
        <Box className="TopicHeader">รายงานบุคลากร</Box>
        <Box className="CheckBoxMain">
          <FormGroup>
            <FormControlLabel value={data?.reportdoc || false} control={<Checkbox checked={isChecked} onChange={handleCheckboxChange} />} label="รายงานแพทย์" />
          </FormGroup>
          {isChecked && 
            <>
              <TextField fullWidth id="docname" label="คำสั่งแพทย์" value={data?.docname || ""} onChange={(e) => setDataFunction(e, "docname")} variant="filled" />
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
                  value="0"
                  control={<Radio />}
                  label="ไม่ได้บันทึกในเวชระเบียน"
                />
                <FormControlLabel
                  sx={{ p: 1 }}
                  value="1"
                  control={<Radio />}
                  label="บันทึกในเวชระเบียน"
                />
              </RadioGroup>
            </>
          }

          <FormGroup>
            <FormControlLabel value={data?.reportacknowledge || false} control={<Checkbox checked={isCheckedAcknowledge} onChange={handleCheckboxChangeAcknowledge} />} label="รายงานหัวหน้าแผนก/ผู้จัดการฝ่าย/ผู้ตรวจการพยาบาล รับทราบ" />
          </FormGroup>

          <FormGroup>
            <FormControlLabel value={data?.reportother || false} control={<Checkbox checked={isCheckedOther} onChange={handleCheckboxChangeOther} />} label="อื่นๆ..." />
          </FormGroup>
          {isCheckedOther && 
            <>
              <TextField fullWidth id="reportotherremark" label="อื่นๆ" value={data?.reportotherremark || ""} onChange={(e) => setDataFunction(e, "reportotherremark")} variant="filled" />
            </>
          }
        </Box>
      </ReportStaffStyle>
    </>
  );
};



export default ReportStaff;
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
  const [isCheckedmedicalrecorded, setIsCheckedmedicalrecorded] = useState(data?.medicalrecorded || false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleCheckboxChangemedicalrecorded = () => {
    setIsCheckedmedicalrecorded(!isCheckedmedicalrecorded);
  };

  useEffect(()=>{
    setData(isChecked,"reportdoc")
  },[isChecked])

  useEffect(()=>{
    setData(isCheckedmedicalrecorded,"medicalrecorded")
  },[isCheckedmedicalrecorded])

  return (
    <>
    {/* {console.log(isChecked)} */}
      <ReportStaffStyle>
      ReportStaff
        <FormGroup>
          <FormControlLabel value={data?.reportdoc || false} control={<Checkbox checked={isChecked} onChange={handleCheckboxChange} />} label="รายงานแพทย์" />
        </FormGroup>
        {isChecked && 
          <>
            <TextField id="docname" label="คำสั่งแพทย์" value={data?.docname || ""} onChange={(e) => setDataFunction(e, "docname")} variant="filled" />
            {/* <FormGroup>
              <FormControlLabel value={data?.medicalrecorded || false} control={<Checkbox checked={isCheckedmedicalrecorded} onChange={handleCheckboxChangemedicalrecorded} />} label="บันทึกในเวชระเบียน" />
            </FormGroup> */}
            <RadioGroup
              sx={{ p: 1 }}
              row
              id="medicalrecorded"
              aria-labelledby="medicalrecorded"
              defaultValue="0"
              name="medicalrecorded"
              onChange={(e) => setDataFunction(e, "medicalrecorded")}
              value={data?.urgenttype || "0"}
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
        {/* <TextField id="isnew" label="หน่วยงานที่เกี่ยวข้อง" value={data?.dx || ""} onChange={(e) => setDataFunction(e, "isnew")} variant="filled" /> */}
        <RadioGroup
          sx={{ p: 1 }}
          row
          id="isnew"
          aria-labelledby="isnew"
          defaultValue="1"
          name="isnew"
          onChange={(e) => setDataFunction(e, "isnew")}
          value={data?.isnew || "1"}
        >
          <FormControlLabel
            sx={{ p: 1 }}
            value="1"
            control={<Radio />}
            label="อุบัติการณ์ใหม่"
          />
          <FormControlLabel
            sx={{ p: 1 }}
            value="0"
            control={<Radio />}
            label="อุบัติการณ์ซ้ำ"
          />
        </RadioGroup>
      </ReportStaffStyle>
    </>
  );
};



export default ReportStaff;
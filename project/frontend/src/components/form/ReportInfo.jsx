import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
// import StatusLable from "../label.json";

import ReportInfoStyle from "../../styles/ReportInfoStyle.style";

const ReportInfo = ({data,setDataFunction}) => {

  
  return (
    <>
      <ReportInfoStyle>
      ReportInfo
        <TextField id="reportid" label="เลขที่เอกสาร" value={data?.reportid || ""} onChange={(e) => setDataFunction(e, "reportid")} variant="filled" />
        <TextField id="acceptdate" label="วันที่รับเรื่อง" value={data?.acceptdate || ""} onChange={(e) => setDataFunction(e, "acceptdate")} variant="filled" />
        <TextField id="responsedate" label="วันที่รับคืน" value={data?.responsedate || ""} onChange={(e) => setDataFunction(e, "responsedate")} variant="filled" />
        {/* <TextField id="urgenttype" label="เวลาที่เกิดเหตุการณ์" value={data?.gender || ""} onChange={(e) => setDataFunction(e, "urgenttype")} variant="filled" /> */}
        <RadioGroup
          sx={{ p: 1 }}
          row
          id="urgenttype"
          aria-labelledby="urgenttype"
          defaultValue="0"
          name="urgenttype"
          onChange={(e) => setDataFunction(e, "urgenttype")}
          value={data?.urgenttype || "0"}
        >
          <FormControlLabel
            sx={{ p: 1 }}
            value="0"
            control={<Radio />}
            label="ไม่เร่งด่วน"
          />
          <FormControlLabel
            sx={{ p: 1 }}
            value="1"
            control={<Radio />}
            label="เร่งด่วน"
          />
        </RadioGroup>
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
            label="ข้อร้องเรียนใหม่"
          />
          <FormControlLabel
            sx={{ p: 1 }}
            value="0"
            control={<Radio />}
            label="ข้อร้องเรียนซ้ำ"
          />
        </RadioGroup>
      </ReportInfoStyle>
    </>
  );
};



export default ReportInfo;
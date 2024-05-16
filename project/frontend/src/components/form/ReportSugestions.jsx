import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import ReportSugestionsStyle from "../../styles/ReportSugestionsStyle.style";

const ReportSugestions = ({data,setDataFunction}) => {
  
  return (
    <>
      <ReportSugestionsStyle>
        <TextField id="impromptusolution" label="การแก้ไขปัญหาเฉพาะหน้า" value={data?.impromptusolution || ""} onChange={(e) => setDataFunction(e, "impromptusolution")} variant="filled" multiline rows={4} />
        <TextField id="activefailure" label="ความคลาดเคลื่อนที่เกิดขึ้น (Active Failure) : ระบุความผิดพลาด/การละเมิดต่อมาตรการที่เกิดขึ้น" value={data?.activefailure || ""} onChange={(e) => setDataFunction(e, "activefailure")} variant="filled" multiline rows={2} />
        <TextField id="suggestion" label="ข้อเสนอแนะเพื่อการแก้ไขปัญหา / แนวทางแก้ไขปัญหา (ถ้ามี)" value={data?.suggestion || ""} onChange={(e) => setDataFunction(e, "suggestion")} variant="filled" multiline rows={2} />
      </ReportSugestionsStyle>
    </>
  );
};



export default ReportSugestions;
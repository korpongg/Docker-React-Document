import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import ReportSugestionsStyle from "../../styles/ReportSugestionsStyle.style";

const ReportSugestions = ({Mode,data,setDataFunction,missingKeys}) => {
  
  return (
    <>
      {/* <ReportSugestionsStyle> */}
        <div className="TopicHeader">การแก้ปัญหา</div>
        <div className="GeneralBox" >
        <div className="ContentBox" style={{display:"flex",flexDirection:"column"}}>
          <div className={missingKeys.some(item => item.key === "impromptusolution") ? "AreaBOX SETERRORBOX":"AreaBOX" }>
            <TextField fullWidth id="impromptusolution" disabled={Mode==="Show"} label="การแก้ไขปัญหาเฉพาะหน้า" value={data?.impromptusolution || ""} onChange={(e) => setDataFunction(e, "impromptusolution")} variant="filled" multiline rows={4} sx={{marginBottom:1}}/>
          </div>
          
          <div className={missingKeys.some(item => item.key === "activefailure") ? "AreaBOX SETERRORBOX":"AreaBOX" }>
          <TextField fullWidth id="activefailure" disabled={Mode==="Show"} label="ความคลาดเคลื่อนที่เกิดขึ้น (Active Failure) : ระบุความผิดพลาด/การละเมิดต่อมาตรการที่เกิดขึ้น" value={data?.activefailure || ""} onChange={(e) => setDataFunction(e, "activefailure")} variant="filled" multiline rows={2} sx={{marginBottom:1}}/>
          </div>

          <div className={missingKeys.some(item => item.key === "suggestion") ? "AreaBOX SETERRORBOX":"AreaBOX" }>
          <TextField fullWidth id="suggestion" disabled={Mode==="Show"} label="ข้อเสนอแนะเพื่อการแก้ไขปัญหา / แนวทางแก้ไขปัญหา (ถ้ามี)" value={data?.suggestion || ""} onChange={(e) => setDataFunction(e, "suggestion")} variant="filled" multiline rows={2} sx={{marginBottom:1}}/>
          </div>
          </div>
          </div>
{/*           
        <Box className="ContentBoxMain">
          <TextField id="impromptusolution" disabled={Mode==="Show"} label="การแก้ไขปัญหาเฉพาะหน้า" value={data?.impromptusolution || ""} onChange={(e) => setDataFunction(e, "impromptusolution")} variant="filled" multiline rows={4} sx={{marginBottom:1}}/>
          <TextField id="activefailure" disabled={Mode==="Show"} label="ความคลาดเคลื่อนที่เกิดขึ้น (Active Failure) : ระบุความผิดพลาด/การละเมิดต่อมาตรการที่เกิดขึ้น" value={data?.activefailure || ""} onChange={(e) => setDataFunction(e, "activefailure")} variant="filled" multiline rows={2} sx={{marginBottom:1}}/>
          <TextField id="suggestion" disabled={Mode==="Show"} label="ข้อเสนอแนะเพื่อการแก้ไขปัญหา / แนวทางแก้ไขปัญหา (ถ้ามี)" value={data?.suggestion || ""} onChange={(e) => setDataFunction(e, "suggestion")} variant="filled" multiline rows={2} sx={{marginBottom:1}}/>
        </Box> */}
      {/* </ReportSugestionsStyle> */}
    </>
  );
};



export default ReportSugestions;
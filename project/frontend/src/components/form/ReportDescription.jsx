import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import ReportDescriptionStyle from "../../styles/ReportDescriptionStyle.style";

const ReportDescription = ({data,setDataFunction}) => {

  
  return (
    <>
      <Box className="TopicHeader">บันทึกรายละเอียด</Box>
      <Box className="ContentBoxMain">
        <TextField id="description" label="บรรยายสรุปเหตุการณ์ (เกิดเหตุการณ์อะไร เกิดที่ไหน เกิดเมื่อไหร่ ใครคือผู้เกี่ยวข้อง เกี่ยวข้องอย่างไร)" value={data?.description || ""} onChange={(e) => setDataFunction(e, "description")} variant="filled" multiline rows={6} sx={{marginBottom:1}}/>
        <TextField id="effectremark" label="ระบุความเสียหายที่เกิดขึ้น" value={data?.effectremark || ""} onChange={(e) => setDataFunction(e, "effectremark")} variant="filled" multiline rows={3} sx={{marginBottom:1}}/>
      </Box>
    </>
  );
};



export default ReportDescription;
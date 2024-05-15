import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import ReportDescriptionStyle from "../../styles/ReportDescriptionStyle.style";

const ReportDescription = ({data,setDataFunction}) => {

  
  return (
    <>
      <ReportDescriptionStyle>
        <TextField id="description" label="บรรยายสรุปเหตุการณ์ที่เกิดขึ้น" value={data?.description || ""} onChange={(e) => setDataFunction(e, "description")} variant="filled" multiline rows={4} />
        <TextField id="effectremark" label="ระบุความเสียหายที่เกิดขึ้น" value={data?.effectremark || ""} onChange={(e) => setDataFunction(e, "effectremark")} variant="filled" multiline rows={2} />
        
      </ReportDescriptionStyle>
    </>
  );
};



export default ReportDescription;
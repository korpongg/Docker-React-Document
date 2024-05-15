import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import ReportLogStyle from "../../styles/ReportLogStyle.style";

const ReportLog = ({data,setDataFunction}) => {

  
  return (
    <>
      <ReportLogStyle>
      ReportLog
        <TextField id="reportlocation" label="สถานที่เกิดเหตุ" value={data?.reportlocation || ""} onChange={(e) => setDataFunction(e, "reportlocation")} variant="filled" />
        <TextField id="reportdate" label="วันที่รายงานเหตุการ" value={data?.reportdate || ""} onChange={(e) => setDataFunction(e, "reportdate")} variant="filled" />
        <TextField id="occurrencedate" label="วันที่เกิดเหตุการณ์" value={data?.occurrencedate || ""} onChange={(e) => setDataFunction(e, "occurrencedate")} variant="filled" />
        <TextField id="occurrencetime" label="เวลาที่เกิดเหตุการณ์" value={data?.occurrencetime || ""} onChange={(e) => setDataFunction(e, "occurrencetime")} variant="filled" />
        <TextField id="deptrelate" label="หน่วยงานที่เกี่ยวข้อง" value={data?.deptrelate || ""} onChange={(e) => setDataFunction(e, "deptrelate")} variant="filled" />
      </ReportLogStyle>
    </>
  );
};



export default ReportLog;
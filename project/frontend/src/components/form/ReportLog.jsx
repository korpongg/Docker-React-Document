import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

// import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import ReportLogStyle from "../../styles/ReportLogStyle.style";

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const ReportLog = ({data,setDataFunction,handleDateChange}) => {

  return (
    <>
    {/* {console.log("reportDate",reportDate)} */}
      <ReportLogStyle>
          <Box className="TopicHeader">ข้อมูลสถานการณ์</Box>
          <TextField id="reportlocation" label="สถานที่เกิดเหตุ" value={data?.reportlocation || ""} onChange={(e) => setDataFunction(e, "reportlocation")} variant="filled" />
          {/* <TextField id="reportdate" label="วันที่รายงานเหตุการ" value={data?.reportdate || ""} onChange={(e) => setDataFunction(e, "reportdate")} variant="filled" /> */}
        {/* <LocalizationProvider dateAdapter={AdapterDayjs} >
            <DatePicker id="reportdate" label="วันที่รายงานเหตุการ" value={data?.reportdate} onChange={(e)=>handleDateChange(e,"reportdate")} />
        </LocalizationProvider> */}
        <input id="reportdate" className="DatetimeInput"  placeholder="วันที่รายงานเหตุการ" type="date" value={data?.reportdate} onChange={(e)=>handleDateChange(e,"reportdate")}/>
          {/* <input className="DatetimeInput" type="date" /> */}
          <TextField id="occurrencedate" label="วันที่เกิดเหตุการณ์" value={data?.occurrencedate || ""} onChange={(e) => setDataFunction(e, "occurrencedate")} variant="filled" />
          <TextField id="occurrencetime" label="เวลาที่เกิดเหตุการณ์" value={data?.occurrencetime || ""} onChange={(e) => setDataFunction(e, "occurrencetime")} variant="filled" />
          <TextField id="deptrelate" label="หน่วยงานที่เกี่ยวข้อง" value={data?.deptrelate || ""} onChange={(e) => setDataFunction(e, "deptrelate")} variant="filled" />
      </ReportLogStyle>
    </>
  );
};



export default ReportLog;
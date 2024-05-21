import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import ReportLogStyle from "../../styles/ReportLogStyle.style";
import AutoCompleteText from "./AutoCompleteText";
import { getCurrentDate } from "../Function";

const ReportLog = ({data,setDataFunction,handleDateChange,handleDataChangeCheckbox}) => {

  return (
    <>
      <ReportLogStyle>
          <Box className="TopicHeader">ข้อมูลสถานการณ์</Box>
          <TextField id="reportlocation" label="สถานที่เกิดเหตุ" value={data?.reportlocation || ""} onChange={(e) => setDataFunction(e, "reportlocation")} variant="filled" />
         
        <div className="DatetimeBox">
          <span>วันที่รายงานเหตุการณ์</span>
          <input id="reportdate" className="DatetimeInput"  placeholder="วันที่รายงานเหตุการณ์" type="datetime-local" value={getCurrentDate(data?.reportdate)} onChange={(e)=>handleDateChange(e,"reportdate")}/>
        </div>
        
        <div className="DatetimeBox">
          <span>วัน-เวลาที่เกิดเหตุการณ์</span>
          <input id="occurrencedate" className="DatetimeInput"  placeholder="วันที่รายงานเหตุการณ์" type="datetime-local" value={getCurrentDate(data?.occurrencedate)} onChange={(e)=>handleDateChange(e,"occurrencedate")}/>
        </div>
        <div className="AutoBox">
          <AutoCompleteText 
            data={data} 
            datacolumn="deptrelate"
            // optionsdata={depoptiondata} //
            // optioncolumn="faction"
            handleDataChangeCheckbox={handleDataChangeCheckbox}
            label="หน่วยงานที่เกี่ยวข้อง"
          />
        </div>
      </ReportLogStyle>
    </>
  );
};



export default ReportLog;
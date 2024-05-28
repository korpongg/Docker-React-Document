import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import ReportLogStyle from "../../styles/ReportLogStyle.style";
import AutoCompleteText from "./AutoCompleteText";
import { getCurrentDate } from "../Function";

const ReportLog = ({data,setDataFunction,handleDateChange,handleDataChangeCheckbox,missingKeys}) => {

  return (
    <>
    {/* <Box className="TopicHeader">ข้อมูลสถานการณ์</Box> */}
    <div className="GeneralBox">
      <div className="ContentBox">
          <div className="ContentRow">
            <div className="w30P">สถานที่เกิดเหตุ</div>
            <div className="w70P">
              <input className="TextInputContent" id="reportlocation" label="สถานที่เกิดเหตุ" value={data?.reportlocation || ""} onChange={(e) => setDataFunction(e, "reportlocation")} />
            </div>
          </div>
          {/* <div className="ContentRow">
            <div className="w30P">วัน-เวลาที่รายงานเหตุการณ์</div>
            <div className="w70P">
            <input disabled id="reportdate" className="DatetimeInput"  placeholder="วันที่รายงานเหตุการณ์" type="datetime-local" value={getCurrentDate(data?.reportdate)} onChange={(e)=>handleDateChange(e,"reportdate")}/>
            </div>
          </div> */}
          <div className="ContentRow">
            <div className="w30P">วัน-เวลาที่เกิดเหตุการณ์</div>
            <div className="w70P">
            <input id="occurrencedate" className="DatetimeInput"  placeholder="วันที่รายงานเหตุการณ์" type="datetime-local" value={getCurrentDate(data?.occurrencedate)} onChange={(e)=>handleDateChange(e,"occurrencedate")}/>
            </div>
          </div>
          <div className="ContentRow" style={{marginBottom:"10px"}}>
            <div className="w30P">หน่วยงานที่เกี่ยวข้อง</div>
            <div className="w70P">
            <AutoCompleteText
              required
              data={data} 
              datacolumn="deptrelate"
              handleDataChangeCheckbox={handleDataChangeCheckbox}
              // label="หน่วยงานที่เกี่ยวข้อง"
              />
            </div>
          </div>
        </div>
      </div>
{/*       
      <ReportLogStyle>
          <Box className="TopicHeader">ข้อมูลสถานการณ์</Box>
          <Box className={missingKeys.some(item => item.key === 'reportlocation') ? "SETERROR":"FormInputBorder" }>
            <TextField fullWidth required id="reportlocation" label="สถานที่เกิดเหตุ" value={data?.reportlocation || ""} onChange={(e) => setDataFunction(e, "reportlocation")} variant="filled" />
          </Box>
         
        <div className="DatetimeBox">
          <span>วัน-เวลาที่รายงานเหตุการณ์</span>
          <input disabled id="reportdate" className="DatetimeInput"  placeholder="วันที่รายงานเหตุการณ์" type="datetime-local" value={getCurrentDate(data?.reportdate)} onChange={(e)=>handleDateChange(e,"reportdate")}/>
        </div>
        
        <div className="DatetimeBox">
          <span>วัน-เวลาที่เกิดเหตุการณ์</span>
          <input id="occurrencedate" className="DatetimeInput"  placeholder="วันที่รายงานเหตุการณ์" type="datetime-local" value={getCurrentDate(data?.occurrencedate)} onChange={(e)=>handleDateChange(e,"occurrencedate")}/>
        </div>
        <Box className={missingKeys.some(item => item.key === 'deptrelate') ? "SETERROR":"FormInputBorder" }>
          <div className="AutoBox">
            <AutoCompleteText
              required
              data={data} 
              datacolumn="deptrelate"
              handleDataChangeCheckbox={handleDataChangeCheckbox}
              label="หน่วยงานที่เกี่ยวข้อง"
              />
          </div>
        </Box>
      </ReportLogStyle> */}
    </>
  );
};



export default ReportLog;
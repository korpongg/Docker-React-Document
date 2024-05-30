import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import ReportLogStyle from "../../styles/ReportLogStyle.style";
import AutoCompleteText from "./AutoCompleteText";
import { getCurrentDate } from "../Function";
import Divider from '@mui/material/Divider';

const ReportLog = ({Mode,data,setDataFunction,handleDateChange,handleDataChangeCheckbox,missingKeys}) => {

  return (
    <>
    <div className="TopicHeader">ข้อมูลสถานการณ์</div>
    <div className="GeneralBox">
      <div className="ContentBox">
          <div className="ContentRow">
            <div className="w30P">สถานที่เกิดเหตุ</div>
            <div className="w70P">
              <input className={missingKeys.some(item => item.key === "reportlocation") ? "TextInputContent SETERROR":"TextInputContent" } disabled={Mode==="Show"} id="reportlocation" label="สถานที่เกิดเหตุ" value={data?.reportlocation || ""} onChange={(e) => setDataFunction(e, "reportlocation")} />
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
            <input id="occurrencedate" disabled={Mode==="Show"} className={missingKeys.some(item => item.key === "occurrencedate") ? "DatetimeInput SETERROR":"DatetimeInput" } placeholder="วันที่รายงานเหตุการณ์" type="datetime-local" value={getCurrentDate(data?.occurrencedate)} onChange={(e)=>handleDateChange(e,"occurrencedate")}/>
            </div>
          </div>
          <Divider variant="middle" flexItem sx={{marginLeft:5,marginTop:1}} />
          <div className="ContentRow" style={{margin:"0px"}}>
            <div className="w30P">หน่วยงานที่เกี่ยวข้อง</div>
            
          </div>
          <div className="ContentRow" style={{margin:"5px",paddingLeft:"0px",flexDirection:"column"}}>
            <div className={missingKeys.some(item => item.key === "deptrelate") && "SETERROR" }>
              {/* {data?.deptrelate.map((row)=>(
                row
              ))} */}
            <AutoCompleteText
              required
              Mode={Mode}
              data={data} 
              // disabled={Mode==="Show"}
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
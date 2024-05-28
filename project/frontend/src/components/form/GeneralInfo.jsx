import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import { getCurrentDate } from "../Function";

import GeneralInfoStyle from "../../styles/GeneralInfoStyle.style";

const GeneralInfo = ({data,setDataFunction,userdata}) => {
  
  return (
    <>
        <Box className="TopicHeader">ข้อมูลทั่วไป</Box>
        <div className="GeneralBox" style={{marginTop:"15px"}}>
          <div className="ContentBox">
            <div className="ContentRow">
              <div className="w30P">HN</div>
              <div className="w70P">
                <input className="TextInputContent" type="text" id="hn" label="HN" value={data?.hn || ""} onChange={(e) => setDataFunction(e, "hn")}/>
                {/* <button className="SyncBTN"><AutorenewIcon/></button> */}
              </div>
            </div>
            <div className="ContentRow">
              <div className="w30P">AN/VN</div>
              <div className="w70P">
                <input className="TextInputContent" type="text" id="an" label="AN" value={data?.an || ""} onChange={(e) => setDataFunction(e, "an")} />
              </div>
            </div>
            <div className="ContentRow">
              <div className="w30P">อายุ</div>
              <div className="w70P">
              <div className="ContentRow">
              <div className="w70P">
                <input className="TextInputContent" type="text" id="age" label="อายุ" value={data?.age || ""} onChange={(e) => setDataFunction(e, "age")} />
              </div>
              <div className="w30P">เพศ</div>
              <div className="w70P">
                {/* <input className="TextInputContent" type="text" id="gender" label="เพศ" value={data?.gender && data?.gender==="M" ? "ชาย" : "หญิง" || ""} /> */}
                <select className="SelectInput" id="gender" name="gender" form="gender" value={data?.gender || "M"} onChange={(e) => setDataFunction(e, "gender")}>
                  <option value="M">ชาย</option>
                  <option value="F">หญิง</option>
                </select>
              </div>
            </div>
              </div>
            </div>
            {/* <div className="ContentRow">
              <div className="w30P">ประเภท</div>
              <div className="w70P">
              <RadioGroup
                sx={{ p: 1 }}
                row
                id="type"
                aria-labelledby="type"
                defaultValue="opd"
                name="type"
                onChange={(e) => setDataFunction(e, "type")}
                value={data?.type || "opd"}
              >
                <FormControlLabel
                  sx={{ p: 1 }}
                  value="opd"
                  control={<Radio />}
                  label="opd"
                />
                <FormControlLabel
                  sx={{ p: 1 }}
                  value="ipd"
                  control={<Radio />}
                  label="ipd"
                />
              </RadioGroup>
              </div>
            </div> */}
            <div className="ContentRow">
              <div className="w30P">Dx.</div>
              <div className="w70P">
                <input className="TextInputContent" type="text" id="hn" label="HN" value={data?.hn || ""} onChange={(e) => setDataFunction(e, "hn")} />
              </div>
            </div>

            <div className="ContentRow">
            <div className="" style={{justifyContent:"flex-start", paddingLeft:"50px" , paddingRight:"50px"}}>PCT ที่เกี่ยวข้อง</div>
            <div className="">
              {/* <input className="TextInputContent" id="reportlocation" label="สถานที่เกิดเหตุ" value={data?.reportlocation || ""} onChange={(e) => setDataFunction(e, "reportlocation")} /> */}
              <select className="SelectInput" id="pct" name="pct" form="pct" value={data?.pct || null}>
                  <option value="PCT ศัลยกรรม">PCT ศัลยกรรม</option>
                  <option value="PCT สูตินรีเวช-ปริกำเนิด">PCT สูตินรีเวช-ปริกำเนิด</option>
                  <option value="PCT หัวใจและหลอดเลือด">PCT หัวใจและหลอดเลือด</option>
                  <option value="PCT อายุรกรรม">PCT อายุรกรรม</option>
                  <option value="PCT หู คอ จมูก">PCT หู คอ จมูก</option>
                  <option value="PCT อายุรกรรมทางเดินอาหาร">PCT อายุรกรรมทางเดินอาหาร</option>
                  <option value="PCT ตา">PCT ตา</option>
                  <option value="PCT กุมารเวชกรรม">PCT กุมารเวชกรรม</option>
                  <option value="PCT ฉุกเฉิน">PCT ฉุกเฉิน</option>
                </select>
            </div>
            
          </div>
          {/* <div className="AreaContentBox">
              <div className="TextAreaTopic">Dx.</div>
                <textarea className="TextAreaInputContent" style={{width:"380px"}} rows={4} type="text"  id="hn" label="HN" value={data?.hn || ""} onChange={(e) => setDataFunction(e, "hn")} />
            </div> */}
          </div>
          <Divider orientation="vertical" variant="middle" flexItem sx={{m:1}} />
          <div className="ContentBox">
            <div className="ContentRow">
              <div className="w30P">รหัสพนักงาน</div>
              <div className="w70P">
                <input className="TextInputContent" disabled type="text" id="userreport" label="ID" value={data?.userreport || ""} />
              </div>
            </div>
            <div className="ContentRow">
              <div className="w30P">สังกัด</div>
              <div className="w70P">
                <input className="TextInputContent" disabled type="text" id="aff" label="สังกัด" value={data?.aff || ""} />
              </div>
            </div>
            <div className="ContentRow">
              <div className="w30P">ฝ่าย</div>
              <div className="w70P">
                <input className="TextInputContent" disabled type="text" id="faction" label="ฝ่าย" value={data?.faction || ""} />
              </div>
            </div>
            <div className="ContentRow">
              <div className="w30P">แผนก</div>
              <div className="w70P">
                <input className="TextInputContent" disabled type="text" id="dep" label="แผนก" value={data?.dep || ""} />
              </div>
            </div>
            <div className="ContentRow">
            <div className="w30P">วัน-เวลาที่รายงานเหตุการณ์</div>
            <div className="w70P">
            <input disabled id="reportdate" className="DatetimeInput"  placeholder="วันที่รายงานเหตุการณ์" type="datetime-local" value={getCurrentDate(data?.reportdate)} onChange={(e)=>handleDateChange(e,"reportdate")}/>
            </div>
          </div>
          </div>
        </div>
        <div className="GeneralBox">
          
          <div className="ContentBox">
          
            {/* <div className="AreaContentBox">
              <div className="TextAreaTopic">Dx.</div>
                <textarea className="TextAreaInputContent" rows={4} type="text"  id="hn" label="HN" value={data?.hn || ""} onChange={(e) => setDataFunction(e, "hn")} />
            </div> */}
            {/* <div className="AreaContentBox">
              <div className="TextAreaTopic">PCT ที่เกี่ยวข้อง</div>
                <textarea className="TextAreaInputContent" rows={4} type="text"  id="hn" label="HN" value={data?.hn || ""} onChange={(e) => setDataFunction(e, "hn")} />
            </div> */}
            
          </div>
        </div>

        {/* <Box className="TopicHeader">ข้อมูลผู้ยื่น</Box>
        <TextField disabled id="userreport" label="ID" value={data?.userreport || ""} variant="filled" />
        <TextField id="hn" label="HN" value={data?.hn || ""} onChange={(e) => setDataFunction(e, "hn")} variant="filled" />
        <TextField id="an" label="AN" value={data?.an || ""} onChange={(e) => setDataFunction(e, "an")} variant="filled" />
        <TextField id="age" label="อายุ" value={data?.age || ""} onChange={(e) => setDataFunction(e, "age")} variant="filled" />
        <TextField disabled id="gender" label="เพศ" value={data?.gender && data?.gender==="M" ? "ชาย" : "หญิง" || ""} variant="filled" />

        <TextField disabled id="aff" label="สังกัด" value={data?.aff || ""} variant="filled" />
        <TextField disabled id="faction" label="ฝ่าย" value={data?.faction || ""} variant="filled" />
        <TextField disabled id="dep" label="แผนก" value={data?.dep || ""} variant="filled" />

        <TextField multiline rows={3} id="dx" label="Dx." value={data?.dx || ""} onChange={(e) => setDataFunction(e, "dx")} variant="filled" />
        <TextField multiline rows={3} id="pct" label="PCT ที่เกี่ยวข้อง" value={data?.pct || ""} onChange={(e) => setDataFunction(e, "pct")} variant="filled" /> */}
    </>
  );
};



export default GeneralInfo;
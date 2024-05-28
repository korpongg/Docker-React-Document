import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import GeneralInfoStyle from "../../styles/GeneralInfoStyle.style";
import Divider from '@mui/material/Divider';
import AutorenewIcon from '@mui/icons-material/Autorenew';

const MainForm = ({data,setDataFunction,userdata}) => {
  
  return (
    <>
        {/* {console.log(userdata)} */}
      {/* <GeneralInfoStyle> */}
        <Box className="TopicHeader">ข้อมูลผู้ยื่น</Box>
        <div className="GeneralBox">
          <div className="ContentBox">
            <div className="ContentRow">
              <div className="w30P">HN</div>
              <div className="w70P">
                <input className="TextInputContent" type="text"  id="hn" label="HN" value={data?.hn || ""} onChange={(e) => setDataFunction(e, "hn")} />
                <button className="SyncBTN"><AutorenewIcon/></button>
              </div>
            </div>
            <div className="ContentRow">
              <div className="w30P">AN</div>
              <div className="w70P">
                <input className="TextInputContent" type="text"  id="hn" label="HN" value={data?.hn || ""} onChange={(e) => setDataFunction(e, "hn")} />
              </div>
            </div>
            <div className="ContentRow">
              <div className="w30P">อายุ</div>
              <div className="w70P">
              <div className="ContentRow">
              <div className="w70P">
                <input className="TextInputContent" type="text"  id="hn" label="HN" value={data?.hn || ""} onChange={(e) => setDataFunction(e, "hn")} />
              </div>
              <div className="w30P">เพศ</div>
              <div className="w70P">
                <input className="TextInputContent" type="text"  id="hn" label="HN" value={data?.hn || ""} onChange={(e) => setDataFunction(e, "hn")} />
              </div>
            </div>
              </div>
            </div>
            <div className="ContentRow">
              <div className="w30P">ประเภท</div>
              <div className="w70P">
                <input className="TextInputContent" type="text"  id="hn" label="HN" value={data?.hn || ""} onChange={(e) => setDataFunction(e, "hn")} />
              </div>
            </div>
          </div>
          <Divider orientation="vertical" variant="middle" flexItem />
          <div className="ContentBox">
            <div className="ContentRow">
              <div className="w30P">รหัสพนักงาน</div>
              <div className="w70P">
                <input className="TextInputContent" disabled type="text"  id="hn" label="HN" value={data?.hn || ""} onChange={(e) => setDataFunction(e, "hn")} />
              </div>
            </div>
            <div className="ContentRow">
              <div className="w30P">สังกัด</div>
              <div className="w70P">
                <input className="TextInputContent" disabled type="text"  id="hn" label="HN" value={data?.hn || ""} onChange={(e) => setDataFunction(e, "hn")} />
              </div>
            </div>
            <div className="ContentRow">
              <div className="w30P">ฝ่าย</div>
              <div className="w70P">
                <input className="TextInputContent" disabled type="text"  id="hn" label="HN" value={data?.hn || ""} onChange={(e) => setDataFunction(e, "hn")} />
              </div>
            </div>
            <div className="ContentRow">
              <div className="w30P">แผนก</div>
              <div className="w70P">
                <input className="TextInputContent" disabled type="text"  id="hn" label="HN" value={data?.hn || ""} onChange={(e) => setDataFunction(e, "hn")} />
              </div>
            </div>
          </div>
        </div>
        <div className="GeneralBox">
          <div className="ContentBox">
            <div className="AreaContentBox">
              <div className="TextAreaTopic">Dx.</div>
                <textarea className="TextAreaInputContent" rows={4} type="text"  id="hn" label="HN" value={data?.hn || ""} onChange={(e) => setDataFunction(e, "hn")} />
            </div>
            <div className="AreaContentBox">
              <div className="TextAreaTopic">PCT ที่เกี่ยวข้อง</div>
                <textarea className="TextAreaInputContent" rows={4} type="text"  id="hn" label="HN" value={data?.hn || ""} onChange={(e) => setDataFunction(e, "hn")} />
            </div>
            
          </div>
        </div>
        <TextField disabled id="userreport" label="ID" value={data?.userreport || ""} variant="filled" />
        {/* <TextField disabled id="FullName" label="FullName" value={data?.requestby} variant="filled" /> */}
        <TextField id="hn" label="HN" value={data?.hn || ""} onChange={(e) => setDataFunction(e, "hn")} variant="filled" />
        <TextField id="an" label="AN" value={data?.an || ""} onChange={(e) => setDataFunction(e, "an")} variant="filled" />
        <TextField id="age" label="อายุ" value={data?.age || ""} onChange={(e) => setDataFunction(e, "age")} variant="filled" />
        <TextField disabled id="gender" label="เพศ" value={data?.gender && data?.gender==="M" ? "ชาย" : "หญิง" || ""} variant="filled" />

        <TextField disabled id="aff" label="สังกัด" value={data?.aff || ""} variant="filled" />
        <TextField disabled id="faction" label="ฝ่าย" value={data?.faction || ""} variant="filled" />
        <TextField disabled id="dep" label="แผนก" value={data?.dep || ""} variant="filled" />

        <TextField multiline rows={3} id="dx" label="Dx." value={data?.dx || ""} onChange={(e) => setDataFunction(e, "dx")} variant="filled" />
        <TextField multiline rows={3} id="pct" label="PCT ที่เกี่ยวข้อง" value={data?.pct || ""} onChange={(e) => setDataFunction(e, "pct")} variant="filled" />
      {/* </GeneralInfoStyle> */}
    </>
  );
};



export default MainForm;
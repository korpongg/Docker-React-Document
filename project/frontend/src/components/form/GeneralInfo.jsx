import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import GeneralInfoStyle from "../../styles/GeneralInfoStyle.style";

const GeneralInfo = ({data,setDataFunction,userdata}) => {
  
  return (
    <>
        {console.log(userdata)}
      <GeneralInfoStyle>
        <Box className="TopicHeader">ข้อมูลผู้ยื่น</Box>
        <TextField disabled id="userreport" label="ID" value={data?.userreport || ""} onChange={(e) => setDataFunction(e, "userreport")} variant="filled" />
        <TextField disabled id="FullName" label="FullName" value={userdata?.title+" "+userdata?.name+" "+userdata?.lastname} variant="filled" />
        <TextField id="hn" label="HN" value={data?.hn || ""} onChange={(e) => setDataFunction(e, "hn")} variant="filled" />
        <TextField id="an" label="AN" value={data?.an || ""} onChange={(e) => setDataFunction(e, "an")} variant="filled" />
        <TextField disabled id="age" label="อายุ" value={data?.age || ""} onChange={(e) => setDataFunction(e, "age")} variant="filled" />
        <TextField disabled id="gender" label="เพศ" value={data?.gender || ""} onChange={(e) => setDataFunction(e, "gender")} variant="filled" />
        <TextField id="dx" label="Dx." value={data?.dx || ""} onChange={(e) => setDataFunction(e, "dx")} variant="filled" />
        <TextField id="pct" label="PCT ที่เกี่ยวข้อง" value={data?.pct || ""} onChange={(e) => setDataFunction(e, "pct")} variant="filled" />
      </GeneralInfoStyle>
    </>
  );
};



export default GeneralInfo;
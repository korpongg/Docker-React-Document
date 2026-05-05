import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ConfirmDialog from "./ConfirmDialog";

const NavForm = ({Mode,Data,Access,submitfunction,handleSubmitEdit,Stage,MaxStage,FirstStage,LastStage,PrevStage,NextStage,ToStage}) => {
  const NavPage = [];
  for (let i = 0; i < MaxStage; i++) {
    NavPage.push(
      <IconButton key={i+1} onClick={()=>ToStage(i+1,MaxStage)} >
        <Box className="StageNo">{i+1}</Box>
      </IconButton>
    );
  }
  return (
  <>
  {/* {console.log(Access)} */}
   <Box className="action-bar"   style={{
       background: "#ffffff",
    borderBottom: "6px solid #141553ff",   // เส้นบนแทน
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    position: "relative",
    minHeight: "72px",
    display: "flex",
    alignItems: "center",
          }}>
    {/* <span>
      {Stage>1 ?
      <>
        <Tooltip title="หน้าแรก">
          <IconButton aria-label="prev" onClick={FirstStage}>
            <FirstPageIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="ย้อนกลับ">
          <IconButton aria-label="prev" onClick={PrevStage}>
            <ChevronLeftIcon />
          </IconButton>
        </Tooltip>
      </>
        :
        <Tooltip title="ไม่สามารถย้อนไปได้อีก">
          <IconButton aria-label="stop" >
            <DoDisturbOnIcon sx={{opacity:0.25}}/>
          </IconButton>
        </Tooltip>
      }
    </span> */}
    {Stage===MaxStage ? 
    Mode!=="Show" &&(

        (Mode==="Add" ?
          <>
          <ConfirmDialog submitfunction={submitfunction} SubmitMode="Draft" Access={Access} Mode={Mode} Lable="บันทึกข้อมูล" /> 
        {/* <ConfirmDialog submitfunction={submitfunction} SubmitMode="Submit" Access={Access} Mode={Mode} Lable="บันทึก"/>  */}
          </>
        :
        <>
        <ConfirmDialog submitfunction={handleSubmitEdit} Access={Access} Mode={Mode} SubmitMode="Draft" Lable="แก้ไขข้อมูล"/>
      
        </>
      
      )
    
    
      )
        : "Page "+Stage+" of "+MaxStage}
    {/* <span>
      {Stage===MaxStage ? 
        <Tooltip title="ไม่สามารถย้อนไปได้อีก">
          <IconButton aria-label="stop" >
            <DoDisturbOnIcon sx={{opacity:0.25}}/>
          </IconButton>
        </Tooltip>
      :
      <>
        <Tooltip title="ต่อไป">
          <IconButton aria-label="next" onClick={NextStage}>
            <ChevronRightIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="หน้าสุดท้าย">
          <IconButton aria-label="next" onClick={()=>LastStage(MaxStage)}>
            <LastPageIcon />
          </IconButton>
        </Tooltip>
      </>
      }
    </span> */}
  </Box>
  </>
  );
};



export default NavForm;



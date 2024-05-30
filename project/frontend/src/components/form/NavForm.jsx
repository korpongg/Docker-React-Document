import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import DoDisturbOnIcon from '@mui/icons-material/DoDisturbOn';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Tooltip from '@mui/material/Tooltip'
import ConfirmDialog from "./ConfirmDialog";
import NavFormStyle from "../../styles/NavFormStyle.style";

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';

const NavForm = ({Mode,Access,submitfunction,handleSubmitEdit,Stage,MaxStage,FirstStage,LastStage,PrevStage,NextStage,ToStage}) => {
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
    <Box className="FormFooter" >
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
      Access && (

        (Mode==="Add" ?
        <ConfirmDialog submitfunction={submitfunction} Access={Access} Mode={Mode}/> 
        :
        <ConfirmDialog submitfunction={handleSubmitEdit} Access={Access} Mode={Mode}/> ))
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



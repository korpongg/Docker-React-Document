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

const NavForm = ({submitfunction,Stage,MaxStage,PrevStage,NextStage,ToStage}) => {
  const NavPage = [];
  for (let i = 0; i < MaxStage; i++) {
    NavPage.push(
      <IconButton key={i+1} onClick={()=>ToStage(i+1,MaxStage)} >
        <Box className="StageNo">{i+1}</Box>
      </IconButton>
    );
  }
  return (
    <Box className="FormFooter" >
    <span>
      {Stage>1 ?
        <Tooltip title="ย้อนกลับ">
          <IconButton aria-label="prev" onClick={PrevStage}>
            <ArrowBackIosNewIcon />
          </IconButton>
        </Tooltip>
        :
        <Tooltip title="ไม่สามารถย้อนไปได้อีก">
          <IconButton aria-label="stop" >
            <DoDisturbOnIcon sx={{opacity:0.25}}/>
          </IconButton>
        </Tooltip>
      }
    </span>
    {Stage+" of "+MaxStage}
    <span>
      {Stage===MaxStage ? 
        // <Tooltip title="ต่อไป">
        //   <IconButton aria-label="next" onClick={NextStage}>
        //     <ArrowForwardIosIcon />
        //   </IconButton>
        // </Tooltip>
        <ConfirmDialog submitfunction={submitfunction}/>
      :
        <Tooltip title="ต่อไป">
          <IconButton aria-label="next" onClick={NextStage}>
            <ArrowForwardIosIcon />
          </IconButton>
        </Tooltip>
      }
    </span>
  </Box>
      
  );
};



export default NavForm;



import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Tooltip from '@mui/material/Tooltip'

import NavFormStyle from "../../styles/NavFormStyle.style";

const NavForm = ({Stage,MaxStage,PrevStage,NextStage,ToStage}) => {
  const NavPage = [];
  for (let i = 0; i < MaxStage; i++) {
    NavPage.push(
      <IconButton key={i+1} onClick={()=>ToStage(i+1,MaxStage)} >
        <Box className="StageNo">{i+1}</Box>
      </IconButton>
    );
  }
  return (
    <Box className="FormFooter">
    <span>
    <Tooltip title="ย้อนกลับ">
      <IconButton aria-label="delete" onClick={PrevStage}>
        <ArrowBackIosNewIcon />
      </IconButton>
    </Tooltip>
    </span>
    {Stage+" of "+MaxStage}
    <span>
    <Tooltip title="ต่อไป">
      <IconButton aria-label="next" onClick={NextStage}>
        <ArrowForwardIosIcon />
      </IconButton>
    </Tooltip>
    </span>
  </Box>
      
  );
};



export default NavForm;



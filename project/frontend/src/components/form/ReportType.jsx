import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
// import StatusLable from "../label.json";
import ReportLog from "./ReportLog";
import RadioList from "./RadioList";

import ReportTypeStyle from "../../styles/ReportTypeStyle.style";

const ReportType = ({
  data,
  setDataFunction,
}) => {

  return (
    <>
      <ReportTypeStyle>
        <Box className="TopicHeader">ประเภท</Box>
        {/* {console.log("optionsdata",optionsdata)} */}
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
        
      </ReportTypeStyle>
    </>
  );
};



export default ReportType;
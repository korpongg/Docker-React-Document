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

const ReportRiskType = ({
  data,
  setDataFunction,
  optionsdata,
  tocolumn,
  datacolumn,
  handleDataChangeCheckbox,
  handleDataChange,
  missingKeys,
}) => {

  return (
    <>
      <ReportTypeStyle>        
        <Box className="TopicHeader">ประเภทอุบัติการณ์</Box>
        <RadioGroup
          sx={{ p: 1 }}
          row
          id="reporttype"
          aria-labelledby="reporttype"
          defaultValue="0"
          name="reporttype"
          onChange={(e) => setDataFunction(e, "reporttype")}
          value={data?.reporttype || "0"}
        >
          <FormControlLabel
            sx={{ p: 1 }}
            value="0"
            control={<Radio />}
            label="General Risk"
          />
          <FormControlLabel
            sx={{ p: 1 }}
            value="1"
            control={<Radio />}
            label="Clinical Risk"
          />
        </RadioGroup>
        {/* <Box className={missingKeys.some(item => item.key === 'deptrelate') ? "SETERROR":"FormInputBorder" }> */}
{/* test */}
        {data?.reporttype==="0" && 
          <>
            <RadioList
              data={data}
              optionsdata={optionsdata}
              datacolumn={datacolumn[0]}
              tocolumn={tocolumn}
              remark={false}
              handleDataChangeCheckbox={handleDataChangeCheckbox}
              handleDataChange={handleDataChange}
              missingKeys={missingKeys}
              />
          </>
        }
        {data?.reporttype==="1" && 
          <>
            <RadioList
              data={data}
              optionsdata={optionsdata}
              datacolumn={datacolumn[1]}
              tocolumn={tocolumn}
              remark={false}
              handleDataChangeCheckbox={handleDataChangeCheckbox}
              handleDataChange={handleDataChange}
              missingKeys={missingKeys}
              />
          </>
        }
        {/* </Box> */}
        
      </ReportTypeStyle>
    </>
  );
};



export default ReportRiskType;
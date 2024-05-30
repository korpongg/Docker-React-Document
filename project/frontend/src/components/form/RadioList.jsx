import React, { useState, useEffect } from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import Box from '@mui/material/Box';

import RadioListStyle from "../../styles/RadioListStyle.style";

const RadioList = ({
  Mode,
  data,
  optionsdata,
  datacolumn,
  tocolumn,
  handleDataChange,
  missingKeys,
}) => {

  return (
    <>
    <div className="TopicHeader" id={tocolumn}>
      {/* {optionsdata[datacolumn].topic && optionsdata[datacolumn].topic} */}
    ระดับความเสี่ยง</div>
      {optionsdata && datacolumn && (
        <RadioListStyle>
          <div className={missingKeys.some(item => item.key === tocolumn) ? "RadioBoxED SETERROR":"RadioBoxED FormInputBorder" }>

          <RadioGroup
            sx={{ p: 1 }}
            
            id={datacolumn}
            aria-labelledby={datacolumn}
            // defaultValue={optionsdata[datacolumn].options[0].code}
            name={datacolumn}
            onChange={(e) => handleDataChange(e, tocolumn)}
            // value={data[datacolumn] || optionsdata[datacolumn].options[0].code}
            value={data[tocolumn] || null}
            >
            {optionsdata[datacolumn].options.map((datarow, radiodatakey) => (
              <FormControlLabel
              key={radiodatakey}
              sx={{ p: 1 }}
              disabled={Mode==="Show"}
              value={datarow.code}
              control={<Radio />}
              label={datarow.code+" "+datarow.title}
              />
            ))}
          </RadioGroup>
            </div>
        </RadioListStyle>
      )}
    </>
  );
};

export default RadioList;

import React, { useState, useEffect } from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";

import RadioListStyle from "../../styles/RadioListStyle.style";

const RadioList = ({
  data,
  optionsdata,
  datacolumn,
  handleDataChange,
}) => {

  return (
    <>
    <div className="TopicHeader">{optionsdata[datacolumn].topic && optionsdata[datacolumn].topic}</div>
      {optionsdata && datacolumn && (
        <RadioListStyle>
          <RadioGroup
            sx={{ p: 1 }}
            
            id={datacolumn}
            aria-labelledby={datacolumn}
            // defaultValue={optionsdata[datacolumn].options[0].code}
            name={datacolumn}
            onChange={(e) => handleDataChange(e, datacolumn)}
            // value={data[datacolumn] || optionsdata[datacolumn].options[0].code}
            value={data[datacolumn] || null}
          >
            {optionsdata[datacolumn].options.map((datarow, radiodatakey) => (
              <FormControlLabel
                key={radiodatakey}
                sx={{ p: 1 }}
                value={datarow.code}
                control={<Radio />}
                label={datarow.code+" "+datarow.title}
              />
            ))}
          </RadioGroup>
        </RadioListStyle>
      )}
    </>
  );
};

export default RadioList;

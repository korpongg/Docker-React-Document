import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";

const SelectBoxList = ({
  data,
  optionsdata,
  datacolumn,
  handleDataChangeCheckbox,
  handleDataChange,
  remark,
  remarkno,
  remarkcolumn,
}) => {
  const [pickdata, setPickdata] = useState(data[datacolumn] || []);

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setPickdata((prevData) => [...prevData, value]);
    } else {
      setPickdata((prevData) => prevData.filter((item) => item !== value));
    }
  };

  useEffect(() => {
    handleDataChangeCheckbox(pickdata, datacolumn); //array to string
  }, [pickdata]);

  return (
    <>
      {optionsdata && datacolumn && (
        <Box className="CheckBoxMain">
          <FormGroup
            sx={{ width: "100%", alignItems: "left", textAlign: "left" }}
          >
            {optionsdata[datacolumn].options.map((datarow, datakey) => (
              <FormControlLabel
                key={datakey}
                value={datarow.code}
                control={
                  <Checkbox
                    checked={pickdata.includes(datarow.code.toString())}
                    onChange={handleCheckboxChange}
                  />
                }
                label={datarow.code + " " + datarow.title}
              />
            ))}
            {remark && (
              <>
                <FormControlLabel
                  value={remarkno}
                  control={
                    <Checkbox
                      checked={pickdata.includes(remarkno.toString())}
                      onChange={handleCheckboxChange}
                    />
                  }
                  label={remarkno + " อื่นๆ..."}
                />
                {pickdata.includes(remarkno.toString()) && (
                  <TextField
                    fullWidth
                    id={remarkcolumn}
                    label="ระบุรายละเอียด"
                    value={data[remarkcolumn] || ""}
                    onChange={(e) => handleDataChange(e, remarkcolumn)}
                    variant="filled"
                  />
                )}
              </>
            )}
          </FormGroup>
        </Box>
      )}
    </>
  );
};

export default SelectBoxList;

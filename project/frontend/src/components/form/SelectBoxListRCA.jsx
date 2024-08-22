import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";

const SelectBoxListRCA = ({
  Mode,
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
    const subOptions = getSubOptions(value);

    if (checked) {
      const updatedPickdata = [...pickdata, value];
      if (subOptions.length > 0) {
        updatedPickdata.push(subOptions[0]); // Add first suboption as default
      }
      setPickdata(updatedPickdata);
    } else {
      setPickdata((prevData) =>
        prevData.filter((item) => item !== value && !subOptions.includes(item))
      );
    }
  };

  const getSubOptions = (parentCode) => {
    const parentOption = optionsdata[datacolumn].options.find(
      (option) => option.code.toString() === parentCode
    );
    return parentOption && parentOption.suboption
      ? parentOption.suboption.map((sub) => sub.code.toString())
      : [];
  };

  const setDataFunction = (e, key, parentCode) => {
    const value = e.target.value;
    const subOptions = getSubOptions(parentCode);

    let newData = [...pickdata];

    // Remove any existing subOptions
    newData = newData.filter((item) => !subOptions.includes(item));
    // Add the new selected subOption
    newData.push(value);

    setPickdata(newData);
  };

  useEffect(() => {
    handleDataChangeCheckbox(pickdata, datacolumn); // Update the parent component with the new pickdata
  }, [pickdata]);

  return (
    <>
      {optionsdata && datacolumn && (
        <Box className="CheckBoxMain">
          <FormGroup
            sx={{ width: "100%", alignItems: "left", textAlign: "left" }}
          >
            {optionsdata[datacolumn].options.map((datarow, datakey) => (
              <React.Fragment key={datakey}>
                <FormControlLabel
                disabled={Mode==="Show"}
                  value={datarow.code}
                  control={
                    <Checkbox
                      checked={pickdata.includes(datarow.code.toString())}
                      onChange={handleCheckboxChange}
                    />
                  }
                  label={datarow.code + " " + datarow.title}
                />
                {datarow.suboption &&
                  pickdata.includes(datarow.code.toString()) && (
                    <RadioGroup
                      sx={{ p: 1 }}
                      row
                      id={`suboption-${datarow.code}`}
                      aria-labelledby={`suboption-${datarow.code}`}
                      name={`suboption-${datarow.code}`}
                      onChange={(e) =>
                        setDataFunction(e, "pickdata", datarow.code.toString())
                      }
                      value={
                        pickdata.find((item) =>
                          datarow.suboption.map((opt) => opt.code).includes(item)
                        ) || datarow.suboption[0].code
                      }
                    >
                      {datarow.suboption.map((subrow, subkey) => (
                        <FormControlLabel
                        disabled={Mode==="Show"}
                          key={subkey}
                          sx={{ p: 1 }}
                          value={subrow.code}
                          control={<Radio />}
                          label={subrow.title}
                        />
                      ))}
                    </RadioGroup>
                  )}
                {/* Example custom content based on conditions */}
                {/* {datarow.code.toString() === "5" &&
                  pickdata.includes(datarow.code.toString()) && (
                    <span>test</span>
                  )} */}
              </React.Fragment>
            ))}
            {remark && (
              <>
                <FormControlLabel
                  disabled={Mode==="Show"}
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
                    // fullWidth
                    sx={{ width: "98%" }}
                    disabled={Mode==="Show"}
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

export default SelectBoxListRCA;

import React from "react";
import Box from "@mui/material/Box";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Divider from "@mui/material/Divider";
import RadioList from "./RadioList";


const ReportRiskType = ({
  Mode,
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
      <Box className="TopicHeader">ประเภทข้อร้องเรียน</Box>
      <div className="ContentRow" style={{ paddingLeft: "50px" }}>
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
            disabled={Mode === "Show"}
            value="opd"
            control={<Radio />}
            label="OPD"
          />
          <FormControlLabel
            sx={{ p: 1 }}
            disabled={Mode === "Show"}
            value="ipd"
            control={<Radio />}
            label="IPD"
          />
        </RadioGroup>
        <Divider
          orientation="vertical"
          variant="middle"
          flexItem
          sx={{ m: 1, marginLeft: "50px", marginRight: "50px" }}
        />
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
          {datacolumn[0] !== "" && (
            <FormControlLabel
              sx={{ p: 1 }}
              disabled={Mode === "Show"}
              value="0"
              control={<Radio />}
              label="General Risk"
            />
          )}
          <FormControlLabel
            sx={{ p: 1 }}
            disabled={Mode === "Show"}
            value="1"
            control={<Radio />}
            label="Clinical Risk"
          />
        </RadioGroup>
      </div>
      {data?.reporttype === "0" && (
        <>
          <RadioList
            Mode={Mode}
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
      )}
      {data?.reporttype === "1" && (
        <>
          <RadioList
            Mode={Mode}
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
      )}
    </>
  );
};

export default ReportRiskType;

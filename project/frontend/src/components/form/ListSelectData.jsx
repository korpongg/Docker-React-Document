import React, { useState, useEffect } from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import DataDict_OccurrenceForm from "../../data/form/DataDict_OccurrenceForm";
import RadioListStyle from "../../styles/RadioListStyle.style";

import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const ListSelectData = ({
  data,
  Mode,
  DeleteFunction,
  setOccStage,
}) => {
  function getTopicByKey(key) {
    const section = DataDict_OccurrenceForm[key];
    if (!section) {
      return `Section with key ${key} not found.`;
    }

    return section.topic;
  }

  function getTitleByCode(code) {
    if (code === "199") {
      return data.patientcareremark;
    }
    if (code === "299") {
      return data.patientsupportremark;
    }
    if (code === "399") {
      return data.utilityremark;
    }
    if (code === "499") {
      return data.equipmentremark;
    }
    if (code === "599") {
      return data.safetyremark;
    }
    if (code === "699") {
      return data.serviceremark;
    }
    if (code === "799") {
      return data.managementremark;
    } else {
      for (const key in DataDict_OccurrenceForm) {
        const section = DataDict_OccurrenceForm[key];
        const option = section.options.find(
          (option) => option.code === parseInt(code)
        );
        if (option) {
          return option.title;
        }
      }
    }
    return `Title with code ${code} not found.`;
  }

  // function checkDataLength(data, KeyMapping) {
  //   // Loop through each key in KeyMapping
  //   for (let key of KeyMapping) {
  //     // Check if the key exists in data and has a length of at least 1
  //     if (!data.hasOwnProperty(key) && data[key].length < 1) {
  //       return false;
  //     }
  //   }
  //   return true;
  // }

  function sumLengths(data, keyMapping) {
    let sum = 0;
    keyMapping.forEach((key) => {
      if (data[key]) {
        sum += data[key].length;
      }
    });
    return sum;
  }

  const KeyMapping = [
    "patientcare",
    "patientsupport",
    "utility",
    "equipment",
    "safety",
    "service",
    "management",
  ];

  return (
    <>
    {/* {console.log(sumLengths(data, KeyMapping))} */}
    {/* {console.log(data, KeyMapping)} */}
      {/* {data && sumLengths(data, KeyMapping)>0 && ( */}

      <div id="ListSelect" className="ListSelectTable">
        <div className="ListSelectTable_Row">
          <div className="ListSelectTable_Cell" style={{ width: 300 ,  color: Mode === "Show" && "#00000050"}}>
            Code
          </div>
          <Divider
            orientation="vertical"
            variant="middle"
            flexItem
            sx={{ m: 0.5 }}
          />
          <div className="ListSelectTable_Cell" style={{ color: Mode === "Show" && "#00000050"}}>รายละเอียด</div>
          <Divider
            orientation="vertical"
            variant="middle"
            flexItem
            sx={{ m: 0.5 }}
          />
          <div className="ListSelectTable_Cell" style={{ width: 600 ,  color: Mode === "Show" && "#00000050"}}>
            หัวข้อ
          </div>
          {/* <Divider
            orientation="vertical"
            variant="middle"
            flexItem
            sx={{ m: 0.5 }}
          />
          <div className="ListSelectTable_Cell" style={{ width: 120 }}>
            ลบ
          </div> */}
        </div>
        {KeyMapping.map((KeyM) => (
          <>
            {data[KeyM] && data[KeyM].length > 0 && (
              <>
                {/* <div>{KeyM}</div> */}
                {data[KeyM].map((row,index) => (
                  <>
                    {/* {console.log("row", row)} */}
                    {/* {let klkkbju = 0} */}
                    <div className="ListSelectTable_Row" onClick={()=>setOccStage(parseInt(row[0],10))}>
                      <div
                        className="ListSelectTable_Cell"
                        style={{ width: 300 ,  color: Mode === "Show" && "#00000050"}}
                      >
                        {row}
                      </div>
                      <Divider
                        orientation="vertical"
                        variant="middle"
                        flexItem
                        sx={{ m: 0.5 }}
                      />
                      <div
                        className="ListSelectTable_Cell"
                        style={{ textAlign: "left" ,  color: Mode === "Show" && "#00000050"}}
                      >
                        {getTitleByCode(row)}
                      </div>
                      <Divider
                        orientation="vertical"
                        variant="middle"
                        flexItem
                        sx={{ m: 0.5 }}
                      />
                      <div
                        className="ListSelectTable_Cell"
                        style={{ width: 600 ,  color: Mode === "Show" && "#00000050"}}
                      >
                        {getTopicByKey(KeyM)}
                      </div>
                      {/* <Divider
                        orientation="vertical"
                        variant="middle"
                        flexItem
                        sx={{ m: 0.5 }}
                      />
                      <div
                        className="ListSelectTable_Cell"
                        style={{ width: 120 }}
                      >
                        <IconButton
                          aria-label="delete"
                          size="small"
                          color="error"
                          onClick={()=>DeleteFunction(KeyM,row)}
                        >
                          <CloseIcon fontSize="inherit" />
                        </IconButton>
                      </div> */}
                    </div>
                    {/* <div>
            {"Code : "+row+"MATCH_TITLE_REPLACE_HERE"}
            </div> */}
                  </>
                ))}
              </>
            )}
          </>
        ))}
      </div>

      {/* )} */}
    </>
  );
};

export default ListSelectData;

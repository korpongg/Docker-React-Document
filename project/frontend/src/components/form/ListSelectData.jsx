import React from "react";
import Divider from "@mui/material/Divider";
import DataDict_OccurrenceForm from "../../data/form/DataDict_OccurrenceForm";

const ListSelectData = ({ data, Mode, setOccStage }) => {
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
      <div id="ListSelect" className="ListSelectTable">
        <div className="ListSelectTable_Row">
          <div
            className="ListSelectTable_Cell"
            style={{ width: 300, color: Mode === "Show" && "#00000050" }}
          >
            Code
          </div>
          <Divider
            orientation="vertical"
            variant="middle"
            flexItem
            sx={{ m: 0.5 }}
          />
          <div
            className="ListSelectTable_Cell"
            style={{ color: Mode === "Show" && "#00000050" }}
          >
            รายละเอียด
          </div>
          <Divider
            orientation="vertical"
            variant="middle"
            flexItem
            sx={{ m: 0.5 }}
          />
          <div
            className="ListSelectTable_Cell"
            style={{ width: 600, color: Mode === "Show" && "#00000050" }}
          >
            หัวข้อ
          </div>
        </div>
        {KeyMapping.map((KeyM, KeyMindex) => (
          <React.Fragment key={KeyMindex}>
            {data[KeyM] && data[KeyM].length > 0 && (
              <>
                {data[KeyM].map((row, subKeyMindex) => (
                  <React.Fragment key={subKeyMindex}>
                    <div
                      className="ListSelectTable_Row"
                      onClick={() => setOccStage(parseInt(row[0], 10))}
                    >
                      <div
                        className="ListSelectTable_Cell"
                        style={{
                          width: 300,
                          color: Mode === "Show" && "#00000050",
                        }}
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
                        style={{
                          textAlign: "left",
                          color: Mode === "Show" && "#00000050",
                        }}
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
                        style={{
                          width: 600,
                          color: Mode === "Show" && "#00000050",
                        }}
                      >
                        {getTopicByKey(KeyM)}
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </>
            )}
          </React.Fragment>
        ))}
      </div>
    </>
  );
};

export default ListSelectData;

import React from "react";
import Divider from "@mui/material/Divider";
import DataDict_OccurrenceForm from "../../data/form/DataDict_OccurrenceForm";
import DataDict_MedicationForm from "../../data/form/DataDict_MedicationForm";

const ListSelectData = ({ OccType,data, Mode, setOccStage }) => {
  
  function getTopicByKey(key) {
    const section = DataDict_OccurrenceForm[key];
    if (!section) {
      return `Section with key ${key} not found.`;
    }

    return section.topic;
  };
  function getTopicByKeyMed(key) {
    const section = DataDict_MedicationForm[key];
    if (!section) {
      return `Section with key ${key} not found.`;
    }

    return section.topic;
  };

  // if(OccType==="Occurrence"){

  // }
  function getTitleByCode(code) {
    if (code === "199") {
      return data.patientcareremark;
    }
    else if (code === "299") {
      return data.patientsupportremark;
    }
    else if (code === "399") {
      return data.utilityremark;
    }
    else if (code === "499") {
      return data.equipmentremark;
    }
    else if (code === "599") {
      return data.safetyremark;
    }
    else if (code === "699") {
      return data.serviceremark;
    }
    else if (code === "799") {
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
  };

  function getTitleByCodeMed(code) {
    if (code === "4.1.99") {
      return data.prescribingremark;
    }
    else if (code === "4.2.99") {
      return data.dispensingremark;
    }
    else if (code === "4.3.99") {
      return data.administrationremark;
    } else {
      for (const key in DataDict_MedicationForm) {
        const section = DataDict_MedicationForm[key];
        const option = section.options.find(
          (option) => option.code === code
        );
        if (option) {
          return option.title;
        }
      }
    }
    return `Title with code ${code} not found.`;
  };

  // function sumLengths(data, keyMapping) {
  //   let sum = 0;
  //   keyMapping.forEach((key) => {
  //     if (data[key]) {
  //       sum += data[key].length;
  //     }
  //   });
  //   return sum;
  // }

  const KeyMapping = [
    "patientcare",
    "patientsupport",
    "utility",
    "equipment",
    "safety",
    "service",
    "management",
  ];

  const KeyMappingMed = [
    "prescribing",
    "dispensing",
    "administration",
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
        {OccType==="Occurrence" && KeyMapping.map((KeyM, KeyMindex) => (
          <React.Fragment key={KeyMindex}>
            {data[KeyM] && data[KeyM].length > 0 && (
              <>
                {data[KeyM].map((row, subKeyMindex) => (
                  <React.Fragment key={subKeyMindex}>
                    <div
                      className="ListSelectTable_Row"
                      onClick={() => setOccStage(parseInt(row[0], 10))}
                    >
                      {/* {console.log(row[0])} */}
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

        {OccType==="Medication" && KeyMappingMed.map((KeyM, KeyMindex) => (
          <React.Fragment key={KeyMindex}>
            {data[KeyM] && data[KeyM].length > 0 && (
              <>
                {data[KeyM].map((row, subKeyMindex) => (
                  <React.Fragment key={subKeyMindex}>
                    <div
                      className="ListSelectTable_Row"
                      onClick={() => setOccStage(parseFloat(row[2], 10))}
                    >
                      {/* {console.log(row)} */}
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
                        {getTitleByCodeMed(row)}
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
                        {getTopicByKeyMed(KeyM)}
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

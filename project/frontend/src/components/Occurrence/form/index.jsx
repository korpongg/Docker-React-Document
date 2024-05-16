import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import IconButton from '@mui/material/IconButton';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import Tooltip from '@mui/material/Tooltip'

import GeneralInfo from "../../form/GeneralInfo";
import ReportLog from "../../form/ReportLog";
// import ReportInfo from "../../form/ReportInfo";
import ReportType from "../../form/ReportType";
import SelectBoxList from "../../form/SelectBoxList";
import RadioList from "../../form/RadioList";
import ReportDescription from "../../form/ReportDescription";
import ReportStaff from "../../form/ReportStaff";
import ReportSugestions from "../../form/ReportSugestions";
import NavForm from "../../form/NavForm";

import DataDict_OccurrenceForm from "../../../data/form/DataDict_OccurrenceForm";
import DataDict_Risk from "../../../data/form/DataDict_Risk";

import OccurrenceStyle from "../../../styles/OccurrenceStyle.style";

const Occurrence = () => {
  const UserData = JSON.parse(localStorage.getItem("userData"));
  const TempFormData = JSON.parse(localStorage.getItem("FormData")) || {};
  const [Stage,setStage] = useState(1);
  const [FormData,setFormData] = useState({
    ...TempFormData,
    userreport:UserData.userid,
    hn:UserData.hn,
    an:UserData.an,
    age:UserData.userid,
    gender:UserData.sex,
  });

  const handleDataChange = (event, name) => {
    const Text = event.target.value;
    setFormData({ ...FormData, [name]: Text });
  };

  const handleDataChangeCheckbox = (dataarray, columnname) => {
    setFormData({ ...FormData, [columnname]: dataarray });
  };

  const handleDataSingleChange = (data, name) => {
    setFormData({ ...FormData, [name]: data });
  };

  const NextStage = () => {
    localStorage.setItem("FormData", JSON.stringify(FormData));
    setStage(Stage+1);
  };
  const PrevStage = () => {
    if(Stage>1){
      localStorage.setItem("FormData", JSON.stringify(FormData));
      setStage(Stage-1);
    }
  };
  const ToStage = (toval,MaxStage) => {
    if(toval<=MaxStage&&toval>0){
      localStorage.setItem("FormData", JSON.stringify(FormData));
      setStage(toval);
    }
  };

  const ClearData = () => {
    localStorage.removeItem("FormData");
    setFormData({
      userreport:UserData.userid,
      hn:UserData.hn,
      an:UserData.an,
      age:UserData.userid,
      gender:UserData.sex,
    });
  }

  return (
    <>
    <OccurrenceStyle>
      <Box className="FormHeader">
        <span>บันทึกใบรายงานเหตุการณ์ (Occurrence Report)</span>
        <span>
          <Tooltip title="ล้างข้อมูลทั้งหมด">
            <IconButton aria-label="clear" onClick={ClearData}>
              <CleaningServicesIcon />
            </IconButton>
          </Tooltip>
        </span>
      </Box>

      <Box className="MainContainer">
      {console.log("FormData", FormData)}
      
      {/* <button onClick={PrevStage}>Prev</button>
      occurrence index Location : {Stage}
      <button onClick={ClearData}>Clear</button>
      <button onClick={NextStage}>Next</button> */}

      {Stage===1 && <>
        <GeneralInfo data={FormData} setDataFunction={handleDataChange} />
        <ReportLog data={FormData} setDataFunction={handleDataChange} />
      </>}
      {Stage===2 && ""}
      {/* {Stage===3 && <ReportInfo data={FormData} setDataFunction={handleDataChange} />} */}
      {Stage===3 && <ReportType data={FormData} setDataFunction={handleDataChange} />}
      {Stage===4 && 
        <RadioList
        data={FormData}
        optionsdata={DataDict_Risk}
        datacolumn="ClinicalRisk"
        remark={false}
        handleDataChangeCheckbox={handleDataChangeCheckbox}
        handleDataChange={handleDataChange}
        />
      }
      {Stage===5 && 
      <RadioList
      data={FormData}
      optionsdata={DataDict_Risk}
      datacolumn="GeneralRisk"
      remark={false}
      handleDataChangeCheckbox={handleDataChangeCheckbox}
      handleDataChange={handleDataChange}
      />
    }
      {Stage===6 && 
      <SelectBoxList
      data={FormData}
      optionsdata={DataDict_OccurrenceForm}
      datacolumn="patientcare"
      remark={true}
      remarkno="199"
      remarkcolumn="patientcareremark"
      handleDataChangeCheckbox={handleDataChangeCheckbox}
      handleDataChange={handleDataChange}
      />
    }
      {Stage===7 && 
      <SelectBoxList
      data={FormData}
      optionsdata={DataDict_OccurrenceForm}
      datacolumn="patientsupport"
      remark={true}
      remarkno="299"
      remarkcolumn="patientsupportremark"
      handleDataChangeCheckbox={handleDataChangeCheckbox}
      handleDataChange={handleDataChange}
      />
    }
      {Stage===8 && 
      <SelectBoxList
      data={FormData}
      optionsdata={DataDict_OccurrenceForm}
      datacolumn="utility"
      remark={true}
      remarkno="399"
      remarkcolumn="utilityremark"
      handleDataChangeCheckbox={handleDataChangeCheckbox}
      handleDataChange={handleDataChange}
      />
    }
      {Stage===9 && 
      <SelectBoxList
      data={FormData}
      optionsdata={DataDict_OccurrenceForm}
      datacolumn="equipment"
      remark={true}
      remarkno="499"
      remarkcolumn="equipmentremark"
      handleDataChangeCheckbox={handleDataChangeCheckbox}
      handleDataChange={handleDataChange}
      />
    }
      {Stage===10 && 
      <SelectBoxList
      data={FormData}
      optionsdata={DataDict_OccurrenceForm}
      datacolumn="safety"
      remark={true}
      remarkno="599"
      remarkcolumn="safetyremark"
      handleDataChangeCheckbox={handleDataChangeCheckbox}
      handleDataChange={handleDataChange}
      />
    }
      {Stage===11 && 
      <SelectBoxList
      data={FormData}
      optionsdata={DataDict_OccurrenceForm}
      datacolumn="service"
      remark={true}
      remarkno="699"
      remarkcolumn="serviceremark"
      handleDataChangeCheckbox={handleDataChangeCheckbox}
      handleDataChange={handleDataChange}
      />
    }
      {Stage===12 && 
      <SelectBoxList
      data={FormData}
      optionsdata={DataDict_OccurrenceForm}
      datacolumn="management"
      remark={true}
      remarkno="799"
      remarkcolumn="managementremark"
      handleDataChangeCheckbox={handleDataChangeCheckbox}
      handleDataChange={handleDataChange}
      />
    }
      

      {Stage===13 && <ReportDescription data={FormData} setDataFunction={handleDataChange} />}
      {Stage===14 && <ReportStaff data={FormData} setDataFunction={handleDataChange} setData={handleDataSingleChange} />}
      {Stage===15 && <ReportSugestions data={FormData} setDataFunction={handleDataChange}/>}

      </Box>

      <NavForm Stage={Stage} MaxStage={15} PrevStage={PrevStage} NextStage={NextStage} ToStage={ToStage} ClearData={ClearData} />
      </OccurrenceStyle>
    </>

  );
};

export default Occurrence;

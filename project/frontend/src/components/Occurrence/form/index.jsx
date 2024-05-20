import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import IconButton from '@mui/material/IconButton';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import Tooltip from '@mui/material/Tooltip'
import dayjs from 'dayjs';

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
    reportdate:new Date(),
    type:"opd",
    reporttype:"0",
  });

  const handleDataChange = (event, name) => {
    const Text = event.target.value;
    if(name==="reporttype"){
      delete FormData.ClinicalRisk;
      delete FormData.GeneralRisk;
    }
    setFormData({ ...FormData, [name]: Text });
  };

  const handleDateChange = (event, name) => {
    // console.log(event.toISOString())
    setFormData({ ...FormData, [name]: event });
  }; 
    // const datetime = event.$d
    // console.log(event,datetime);
    // setFormData({ ...FormData, [name]: datetime });
  // };

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

  //submit
  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   try {
  //     // Convert the date to a string format (e.g., ISO format) if necessary
  //     const dataToSubmit = {
  //       ...formData,
  //       reportdate: formData.reportdate ? formData.reportdate.toISOString() : null,
  //     };
      
  //     // Send a POST request to the API
  //     const response = await axios.post('/your-api-endpoint', dataToSubmit);
  //     console.log('Response:', response.data);
  //     // Handle the response as needed
  //   } catch (error) {
  //     console.error('Error submitting form:', error);
  //     // Handle the error as needed
  //   }
  // };

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
        <GeneralInfo data={FormData} setDataFunction={handleDataChange} userdata={UserData}/>
        {/* <ReportLog data={FormData} setDataFunction={handleDataChange} /> */}
      </>}
      {Stage===2 && 
      <>
        <ReportType 
          data={FormData} 
          setDataFunction={handleDataChange}
          handleDateChange={handleDateChange}
          optionsdata={DataDict_Risk}
          datacolumn={["GeneralRisk","ClinicalRisk"]}
          handleDataChangeCheckbox={handleDataChangeCheckbox}
          handleDataChange={handleDataChange} 
        />
      </>
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

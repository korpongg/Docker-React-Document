import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import IconButton from '@mui/material/IconButton';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import Tooltip from '@mui/material/Tooltip'
import dayjs from 'dayjs';
import axios from "axios";

import GeneralInfo from "../../form/GeneralInfo";
import ReportLog from "../../form/ReportLog";
// import ReportInfo from "../../form/ReportInfo";
import ReportType from "../../form/ReportType";
import ReportRiskType from "../../form/ReportRiskType";
import SelectBoxList from "../../form/SelectBoxList";
import AutoCompleteText from "../../form/AutoCompleteText";
import RadioList from "../../form/RadioList";
import ReportDescription from "../../form/ReportDescription";
import ReportStaff from "../../form/ReportStaff";
import ReportSugestions from "../../form/ReportSugestions";
import NavForm from "../../form/NavForm";

import DataDict_OccurrenceForm from "../../../data/form/DataDict_OccurrenceForm";
import DataDict_Risk from "../../../data/form/DataDict_Risk";

import { OccurrenceStyle } from "../../../styles/OccurrenceStyle.style";

import departmentRaw from "../../../data/rawData.json";

import { getCurrentDate } from "../../Function";

const Occurrence = () => {
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
  const storedAuth = JSON.parse(localStorage.getItem("auth"));
  const config = { headers: { Authorization: `Bearer ${storedAuth.accessToken}` } };
  const UserData = JSON.parse(localStorage.getItem("userData"));
  const TempFormData = JSON.parse(localStorage.getItem("FormData")) || {};
  const [Stage,setStage] = useState(1);
  const [FormData,setFormData] = useState({
    ...TempFormData,
    userreport:UserData.userid,
    hn:UserData.hn,
    an:UserData.an,
    age:"",
    gender:UserData.sex,
    reportdate:new Date(),
    occurrencedate:new Date(),
    type:"opd",
    reporttype:"0",
    aff:UserData.affiliation,
    faction:UserData.faction,
    dep:UserData.dep,
    deptrelate:"",
    // formstatus:1,
    createby:UserData.userid,
    // affrelate:"",
    // factionrelate:"",
    // patientcare:["103","104","105"],
  });

  const handleDataChange = (event, name) => {
    const Text = event.target.value;
    // if(name==="reporttype"){
    //   delete FormData.ClinicalRisk;
    //   delete FormData.GeneralRisk;
    // }
    setFormData({ ...FormData, [name]: Text });
  };

  const handleDateChange = (event, name) => {
    const AddDate = new Date(event.target.value);
    setFormData({ ...FormData, [name]: AddDate });
  }; 
    // const datetime = event.$d
    // console.log(event,datetime);
    // setFormData({ ...FormData, [name]: datetime });
  // };

  const handleDataChangeCheckbox = (dataarray, columnname) => {
    console.log(dataarray);
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
      age:"",
      gender:UserData.sex,
      reportdate:new Date(),
      occurrencedate:new Date(),
      type:"opd",
      reporttype:"0",
      aff:UserData.affiliation,
      faction:UserData.faction,
      dep:UserData.dep,
      deptrelate:"",
      // formstatus:1,
      createby:UserData.userid,
    });
  }

  const handleSubmit = async() => {
    const submitFormData = {
      ...FormData,
      deptrelate: JSON.stringify(FormData.deptrelate),
      equipment: JSON.stringify(FormData.equipment),
      management: JSON.stringify(FormData.management),
      patientcare: JSON.stringify(FormData.patientcare),
      patientsupport: JSON.stringify(FormData.patientsupport),
      safety: JSON.stringify(FormData.safety),
      service: JSON.stringify(FormData.service),
      utility: JSON.stringify(FormData.utility)
    };
    console.log("submitFormData:", submitFormData);

    try {
      // const response = 
      await axios.post( `${apiUrl}/occurrences`, { submitFormData }, { ...config });
      // const responseStatus = response.status;

      // if (responseStatus === 200 || responseStatus === 201) {
      //   setPass("");
      //   setPassRe("");
      //   setSuccess(true);
      // }
    } catch (err) {
      // handleApiError(err);
      console.error(err)
    } 
    // finally {
    //   setLoading(false);
    // }

  };
  

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
    {console.log("FormData", FormData)}
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
        />
        <ReportLog 
          data={FormData} 
          setDataFunction={handleDataChange} 
          handleDateChange={handleDateChange}
          handleDataChangeCheckbox={handleDataChangeCheckbox}
          depoptiondata={departmentRaw}
          />
        
      </>
      }
{Stage===3 && 
<>
  <ReportRiskType 
    data={FormData} 
    setDataFunction={handleDataChange}
    optionsdata={DataDict_Risk}
    datacolumn={["GeneralRisk","ClinicalRisk"]}
    tocolumn="level"
    handleDataChangeCheckbox={handleDataChangeCheckbox}
    handleDataChange={handleDataChange} 
  />

  {/* {Object.values(DataDict_OccurrenceForm).map(category => (
    <div key={category.topic}>
      <h2>{category.topic}</h2>
    </div>
  ))} */}

  {/* <AutoCompleteText 
    data={FormData} 
    datacolumn="affrelate" 
    optionsdata={departmentRaw} 
    optioncolumn="affiliation"
    handleDataChangeCheckbox={handleDataChangeCheckbox}
    handleDataChange={handleDataChange}
    /> */}
</>
}
      {Stage===4 && 
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
      {Stage===5 && 
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
      {Stage===6 && 
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
      {Stage===7 && 
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
      {Stage===8 && 
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
      {Stage===9 && 
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
      {Stage===10 && 
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
      

      {Stage===11 && <ReportStaff data={FormData} setDataFunction={handleDataChange} setData={handleDataSingleChange} />}
      {Stage===12 && 
        <>
          <ReportDescription data={FormData} setDataFunction={handleDataChange} />
          <ReportSugestions data={FormData} setDataFunction={handleDataChange}/>
        </>
      }
      {/* {Stage===13 && 
      "Submit Here"
      } */}

      </Box>

      <NavForm submitfunction={handleSubmit} Stage={Stage} MaxStage={12} PrevStage={PrevStage} NextStage={NextStage} ToStage={ToStage} ClearData={ClearData} />
      </OccurrenceStyle>
    </>

  );
};

export default Occurrence;

import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import Tooltip from "@mui/material/Tooltip";
import dayjs from "dayjs";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

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

import AlertBar from "../../form/AlertBar";
import { getCurrentDate } from "../../Function";

const Occurrence = ({ Mode }) => {
  let { id } = useParams();
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
  const storedAuth = JSON.parse(localStorage.getItem("auth"));
  const config = {
    headers: { Authorization: `Bearer ${storedAuth.accessToken}` },
  };
  const navigate = useNavigate();
  const UserData = JSON.parse(localStorage.getItem("userData"));
  const TempFormData = JSON.parse(localStorage.getItem("FormData")) || {};
  const [Stage, setStage] = useState(1);
  const [FormData, setFormData] = useState({});
  const [EditFormData, setEditFormData] = useState({});
  const [Alert, setAlert] = useState(false);
  const [AlertType, setAlertType] = useState("error");
  const [AlertText, setAlertText] = useState("");
  const [AlertBorder,setAlertBorder] =useState([]);

  const handleDataChange = (event, name) => {
    const Text = event.target.value;
    setFormData({ ...FormData, [name]: Text });
    if(Mode==="Edit"){
      setEditFormData({ ...EditFormData, [name]: Text });
    }
  };

  const handleDateChange = (event, name) => {
    const AddDate = new Date(event.target.value);
    setFormData({ ...FormData, [name]: AddDate });
    if(Mode==="Edit"){
      setEditFormData({ ...EditFormData, [name]: AddDate });
    }
  };

  // Get Data For Mode Edit&Show 
  const FetchOccurranceById = async () => {
    console.log("FetchOccurranceById : "+id);
    try {
        const response = await axios.get(`${apiUrl}/occurrences/${id}`,config);
        console.log("Fetched Data : ",response.data);

        if (response.status === 200 || response.status === 201) 
        {
          // setFormData(response.data)   
          setFormData({
            ...response.data,
            userreport: response.data.createby,
            // hn: UserData.hn,
            // an: UserData.an,
            // age: "",
            // gender: UserData.sex,
            reportdate: new Date(response.data.createAt),
            occurrencedate: new Date(response.data.occurrencedate),
            aff: response.data.requestaff,
            faction: response.data.requestfac,
            dep: response.data.requestdep,
            // type: "opd",
            // reporttype: "0",
            // aff: UserData.affiliation,
            // faction: UserData.faction,
            // dep: UserData.dep,
            // // deptrelate: "",
            // createby: UserData.userid,
          })
        }
    } catch (error) {
        console.error(`Error fetching user data: ${error.message}`);
    }
};


  const handleDataChangeCheckbox = (dataarray, columnname) => {
    // console.log(dataarray);
    setFormData({ ...FormData, [columnname]: dataarray });
    if(Mode==="Edit"){
      setEditFormData({ ...EditFormData, [columnname]: dataarray });
    }
  };

  const handleDataSingleChange = (data, name) => {
    setFormData({ ...FormData, [name]: data });
    if(Mode==="Edit"){
      setEditFormData({ ...EditFormData, [name]: data });
    }
  };

  const NextStage = () => {
    localStorage.setItem("FormData", JSON.stringify(FormData));
    setStage(Stage + 1);
  };
  const PrevStage = () => {
    if (Stage > 1) {
      localStorage.setItem("FormData", JSON.stringify(FormData));
      setStage(Stage - 1);
    }
  };
  const FirstStage = () => {
    localStorage.setItem("FormData", JSON.stringify(FormData));
    setStage(1);
  };
  const LastStage = (MaxStage) => {
      localStorage.setItem("FormData", JSON.stringify(FormData));
      setStage(MaxStage);
  };
  const ToStage = (toval, MaxStage) => {
    if (toval <= MaxStage && toval > 0) {
      localStorage.setItem("FormData", JSON.stringify(FormData));
      setStage(toval);
    }
  };

  useEffect(() => {
    console.log("Mode",Mode);
    if(Mode==="Add"){
      setFormData({
        ...TempFormData,
        userreport: UserData.userid,
        hn: UserData.hn,
        // an: UserData.an,
        // age: "",
        gender: UserData.sex,
        reportdate: new Date(),
        occurrencedate: new Date(),
        type: "opd",
        reporttype: "0",
        aff: UserData.affiliation,
        faction: UserData.faction,
        dep: UserData.dep,
        // deptrelate: "",
        createby: UserData.userid,
      })
  }
  else {
    console.log("Edit/Show Mode : "+id);
    FetchOccurranceById();
    setEditFormData({id:parseInt(id,10)});
    // console.log("EditFormData",EditFormData);
  } 
  // else if(Mode==="Show"){
  //   console.log("Show Mode");
  // }
  }, []);

  const ClearData = () => {
    localStorage.removeItem("FormData");
    setFormData({
      userreport: UserData.userid,
      hn: UserData.hn,
      // an: UserData.an,
      // age: "",
      gender: UserData.sex,
      reportdate: new Date(),
      occurrencedate: new Date(),
      type: "opd",
      reporttype: "0",
      aff: UserData.affiliation,
      faction: UserData.faction,
      dep: UserData.dep,
      // deptrelate: "",
      createby: UserData.userid,
    });
  };

  const keydata = [
     {key:'reportlocation',name:"สถานที่เกิดเหตุ",location:2},
     {key:'occurrencedate',name:"วัน-เวลาที่เกิดเหตุการณ์",location:2},
     {key:'deptrelate',name:"หน่วยงานที่เกี่ยวข้อง",location:2},
     {key:'reporttype',name:"ประเภทอุบัติการณ์",location:3},
     {key:'type',name:"ประเภท",location:2},
     {key:'level',name:"ระดับความเสี่ยง",location:3},
     {key:'description',name:"บรรยายสรุปเหตุการณ์ที่เกิดขึ้น",location:12},
     {key:'effectremark',name:"ระบุความเสียหายที่เกิดขึ้น",location:12},
    //  {key:'formstatus',name:"formstatus",location:12},
    //  {key:'createby',name:"createby",location:12},
  ];

  // const checkSubmit = async (dataObject, keyData) => {
  //   const missingKeys = keyData.filter(({ key }) => !(key in dataObject));
  //   if (missingKeys.length === 0) {
  //     return true;
  //   } else {
  //     setAlert(true);
  //     console.log("Missing keys:", missingKeys.map(obj => obj.key));
  //     return false;
  //   }
  // };
  
  // const allKeysExist = checkSubmit(dataobject2, keydata);

  const handleSubmit = async () => {
    console.log("handleSubmit");
    
    
    // Assuming keydata is defined elsewhere
    const missingKeys = keydata.filter(({ key }) => {
      if (key === "deptrelate") {
        return !(FormData[key] && FormData[key].length);
      } else {
        return !(key in FormData);
      }
    });
    setAlertBorder(missingKeys);
    console.log("missingKeys", missingKeys);
  
    if (missingKeys.length === 0) {
      // All keys exist, proceed with form submission
      console.log("All keys exist. Submitting form data...");
      // Your form submission logic here

      // Assuming FormData is your form state
    const submitFormData = {
      ...FormData,
      deptrelate: JSON.stringify(FormData.deptrelate),
      equipment: JSON.stringify(FormData.equipment),
      management: JSON.stringify(FormData.management),
      patientcare: JSON.stringify(FormData.patientcare),
      patientsupport: JSON.stringify(FormData.patientsupport),
      safety: JSON.stringify(FormData.safety),
      service: JSON.stringify(FormData.service),
      utility: JSON.stringify(FormData.utility),
    };
    console.log("submitFormData",submitFormData)

    try {
        const response = await axios.post(
          `${apiUrl}/occurrences`,
          submitFormData,
          { ...config }
        );
        const responseStatus = response.status;
  
        if (responseStatus === 200 || responseStatus === 201) {
          navigate("/occurrence");
        }
      } catch (err) {
        console.error(err);
      }







    } else {
      // Some keys are missing, handle accordingly
      setStage(missingKeys[0].location)
      setAlertText("ไม่สามารถบันทึกข้อมูลได้ โปรดระบุ '"+missingKeys[0].name+"'");
      console.log("Some keys are missing.Cannot submit form data.", missingKeys[0].key);
      setAlert(true); // Trigger Snackbar alert
    }
  };
  

  const handleSubmitEdit = async () => {
    console.log("handleSubmitEdit");
    
    const submitEditFormData = {
      ...EditFormData,
      deptrelate: JSON.stringify(FormData.deptrelate),
      equipment: JSON.stringify(FormData.equipment),
      management: JSON.stringify(FormData.management),
      patientcare: JSON.stringify(FormData.patientcare),
      patientsupport: JSON.stringify(FormData.patientsupport),
      safety: JSON.stringify(FormData.safety),
      service: JSON.stringify(FormData.service),
      utility: JSON.stringify(FormData.utility),
    };
    console.log("submitEditFormData",submitEditFormData)

    try {
        const response = await axios.put(
          `${apiUrl}/occurrences`,
          submitEditFormData,
          { ...config }
        );
        const responseStatus = response.status;
  
        if (responseStatus === 200 || responseStatus === 201) {
          navigate("/occurrence");
        }
      } catch (err) {
        console.error(err);
      }

  };

  
  // const handleSubmit = async () => {
  //   console.log("handleSubmit");
  //   const submitFormData = {
  //     ...FormData,
  //     deptrelate: JSON.stringify(FormData.deptrelate),
  //     equipment: JSON.stringify(FormData.equipment),
  //     management: JSON.stringify(FormData.management),
  //     patientcare: JSON.stringify(FormData.patientcare),
  //     patientsupport: JSON.stringify(FormData.patientsupport),
  //     safety: JSON.stringify(FormData.safety),
  //     service: JSON.stringify(FormData.service),
  //     utility: JSON.stringify(FormData.utility),
  //   };

  //   const missingKeys = keydata.filter(({ key }) => !(key in submitFormData));
  //   console.log("missingKeys",missingKeys);

  // };
    // if(allKeysExist){
    //   console.log("submit");
    // } else {
      // setAlertText("โปรดตรวจสอบ")
      // setAlert(true);
    // }
    // try {
    //   const response = await axios.post(
    //     `${apiUrl}/occurrences`,
    //     submitFormData,
    //     { ...config }
    //   );
    //   const responseStatus = response.status;

    //   if (responseStatus === 200 || responseStatus === 201) {
    //     navigate("/occurrence");
    //   }
    // } catch (err) {
    //   console.error(err);
    // }
  // };

  return (
    <>
      {console.log("FormData", FormData)}
      {console.log("EditFormData", EditFormData)}
      {/* {console.log("allKeysExist", allKeysExist)} */}
      <AlertBar open={Alert} setOpen={setAlert} AlertType={AlertType} AlertText={AlertText}/>
      <OccurrenceStyle>
        <Box className="FormHeader">
        {Mode==="Add" && <span>บันทึกใบรายงานเหตุการณ์ (Occurrence Report)</span>}
        {Mode==="Edit" && <span>แก้ไขใบรายงานเหตุการณ์ (Occurrence Report)</span>}
        {Mode==="Show" && <span>ใบรายงานเหตุการณ์ (Occurrence Report)</span>}
          
          <span>
            <Tooltip title="ล้างข้อมูลทั้งหมด">
              <IconButton aria-label="clear" onClick={ClearData}>
                <CleaningServicesIcon />
              </IconButton>
            </Tooltip>
          </span>
        </Box>

        <Box className="MainContainer">
          {Stage === 1 && (
            <>
              <GeneralInfo
                data={FormData}
                setDataFunction={handleDataChange}
                userdata={UserData}
              />
            </>
          )}
          {Stage === 2 && (
            <>
              <ReportType data={FormData} setDataFunction={handleDataChange} />
              <ReportLog
                data={FormData}
                setDataFunction={handleDataChange}
                handleDateChange={handleDateChange}
                handleDataChangeCheckbox={handleDataChangeCheckbox}
                depoptiondata={departmentRaw}
                missingKeys={AlertBorder}
              />
            </>
          )}
          {Stage === 3 && (
            <>
              <ReportRiskType
                data={FormData}
                setDataFunction={handleDataChange}
                optionsdata={DataDict_Risk}
                datacolumn={["GeneralRisk", "ClinicalRisk"]}
                tocolumn="level"
                handleDataChangeCheckbox={handleDataChangeCheckbox}
                handleDataChange={handleDataChange}
                missingKeys={AlertBorder}
              />
            </>
          )}
          {Stage === 4 && (
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
          )}
          {Stage === 5 && (
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
          )}
          {Stage === 6 && (
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
          )}
          {Stage === 7 && (
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
          )}
          {Stage === 8 && (
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
          )}
          {Stage === 9 && (
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
          )}
          {Stage === 10 && (
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
          )}

          {Stage === 11 && (
            <ReportStaff
              data={FormData}
              setDataFunction={handleDataChange}
              setData={handleDataSingleChange}
            />
          )}
          {Stage === 12 && (
            <>
              <ReportDescription
                data={FormData}
                setDataFunction={handleDataChange}
              />
              <ReportSugestions
                data={FormData}
                setDataFunction={handleDataChange}
              />
            </>
          )}
        </Box>

        <NavForm
          Mode={Mode}
          submitfunction={handleSubmit}
          handleSubmitEdit={handleSubmitEdit}
          Stage={Stage}
          MaxStage={12}
          PrevStage={PrevStage}
          NextStage={NextStage}
          FirstStage={FirstStage}
          LastStage={LastStage}
          ToStage={ToStage}
          ClearData={ClearData}
        />
      </OccurrenceStyle>
    </>
  );
};

export default Occurrence;

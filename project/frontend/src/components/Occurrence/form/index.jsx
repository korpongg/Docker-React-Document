import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import Tooltip from "@mui/material/Tooltip";
import dayjs from "dayjs";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Divider from '@mui/material/Divider';

// import MainForm from "../../form/MainForm";
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
import ListSelectData from "../../form/ListSelectData";

import DataDict_OccurrenceForm from "../../../data/form/DataDict_OccurrenceForm";
import DataDict_Risk from "../../../data/form/DataDict_Risk";

import { OccurrenceStyle } from "../../../styles/OccurrenceStyle.style";

import departmentRaw from "../../../data/rawData.json";
import ReportView from "../../../styles/ReportView";

import AlertBar from "../../form/AlertBar";
import { getCurrentDate } from "../../Function";

import FiberNewIcon from '@mui/icons-material/FiberNew';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { chkAdmins, chkAdmin } from "../../Function";

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
  const [OccStage, setOccStage] = useState(0);
  const [FormData, setFormData] = useState({});
  const [EditFormData, setEditFormData] = useState({});
  const [Alert, setAlert] = useState(false);
  const [AlertType, setAlertType] = useState("error");
  const [AlertText, setAlertText] = useState("");
  const [AlertBorder,setAlertBorder] =useState([]);
  // const isAdmin = chkAdmins(UserData?.role);
  // const isEXEC = chkAdmin(UserData?.level);

  const handleDataChange = (event, name) => {
    const Text = event.target.value;
    setFormData({ ...FormData, [name]: Text });
    if(Mode==="Edit"){
      setEditFormData({ ...EditFormData, [name]: Text });
    }
  };
  const handleDataOccStageChange = (event) => {
    const Text = event.target.value;
    setOccStage(parseInt(Text,10));
    // console.log(Text);
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
            // gender: response.data.gender,
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
        navigate("/missing")
    }
};


  const handleDataChangeCheckbox = (dataarray, columnname) => {
    // console.log(dataarray);
    setFormData({ ...FormData, [columnname]: dataarray });
    if(Mode==="Edit"){
      setEditFormData({ ...EditFormData, [columnname]: dataarray });
    }
  };

  const removeDataFromCheckboxList = (key, value) => {
    const tempOccStage = OccStage;
    setFormData(prevData => {
        if (!prevData[key]) {
            console.log(`Key ${key} not found`);
            return prevData;
        }

        const index = prevData[key].indexOf(value);
        if (index === -1) {
            console.log(`${value} not found in ${key}`);
            return prevData;
        }

        return {
            ...prevData,
            [key]: prevData[key].filter(item => item !== value)
        };
    });
    // setOccStage(0);
    // setOccStage(tempOccStage);
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
    handleScrollToTop();
  };
  const PrevStage = () => {
    if (Stage > 1) {
      localStorage.setItem("FormData", JSON.stringify(FormData));
      setStage(Stage - 1);
      handleScrollToTop();
    }
  };
  const FirstStage = () => {
    localStorage.setItem("FormData", JSON.stringify(FormData));
    setStage(1);
    handleScrollToTop();
  };
  const LastStage = (MaxStage) => {
      localStorage.setItem("FormData", JSON.stringify(FormData));
      setStage(MaxStage);
      handleScrollToTop();
  };
  const ToStage = (toval, MaxStage) => {
    if (toval <= MaxStage && toval > 0) {
      localStorage.setItem("FormData", JSON.stringify(FormData));
      setStage(toval);
      handleScrollToTop();
    }
  };

  useEffect(() => {
    console.log("Mode",Mode);
    if(Mode==="Add"){
      setFormData({
        ...TempFormData,
        userreport: UserData.userid,
        requestby: UserData?.title+" "+UserData?.name+" "+UserData?.lastname,
        // hn: UserData.hn,
        // an: UserData.an,
        // age: "",
        // gender: UserData.sex,
        pct:"PCT ศัลยกรรม",
        gender: "M",
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
      // hn: UserData.hn,
      requestby: UserData?.title+" "+UserData?.name+" "+UserData?.lastname,
      // an: UserData.an,
      // age: "",
      // gender: UserData.sex,
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
    {key:'hn',name:"hn",location:1},
    {key:'an',name:"an",location:1},
    {key:'age',name:"อายุ",location:1},
    {key:'gender',name:"เพศ",location:1},
    {key:'dx',name:"Dx.",location:1},
    {key:'pct',name:"PCT ที่เกี่ยวข้าง",location:1},
     {key:'reportlocation',name:"สถานที่เกิดเหตุ",location:1},
     {key:'occurrencedate',name:"วัน-เวลาที่เกิดเหตุการณ์",location:1},
     {key:'deptrelate',name:"หน่วยงานที่เกี่ยวข้อง",location:1},
     {key:'level',name:"ระดับความเสี่ยง",location:1},
     {key:'description',name:"บรรยายสรุปเหตุการณ์ที่เกิดขึ้น",location:1},
     {key:'effectremark',name:"ระบุความเสียหายที่เกิดขึ้น",location:1},
     {key:'impromptusolution',name:"การแก้ปัญหาเฉพาะหน้า",location:1},
     {key:'activefailure',name:"ความคลาดเคลื่อนที่เกิดขึ้น",location:1},
     {key:'suggestion',name:"ข้อเสนอแนะ",location:1},
  ];

  const keysToCheck = ["equipment", "management", "patientcare", "patientsupport", "safety", "service", "utility"];


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
    const totalLength = keysToCheck.reduce((sum, key) => {
      if (Array.isArray(FormData[key])) {
        return sum + FormData[key].length;
      }
      return sum;
    }, 0);
    setAlertBorder(missingKeys);
    console.log("missingKeys", missingKeys);
    
  
    if (missingKeys.length === 0 ) {
      if(totalLength>0){
        console.log("TTL<=0")
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
      
    }else{
      setStage(1);
      setOccStage(0);
      setAlertText("ไม่สามารถบันทึกข้อมูลได้ กรุณาเลือกอย่างน้อย 1 หัวข้อ");
      console.log("ไม่สามารถบันทึกข้อมูลได้ กรุณาเลือกอย่างน้อย 1 หัวข้อ");
      setAlert(true); // Trigger Snackbar alert
      scrollToSection("ListSelect");
    }






    } else {
      // Some keys are missing, handle accordingly
      setStage(missingKeys[0].location)
      setAlertText("ไม่สามารถบันทึกข้อมูลได้ โปรดระบุ '"+missingKeys[0].name+"'");
      console.log("Some keys are missing.Cannot submit form data.", missingKeys[0].key);
      setAlert(true); // Trigger Snackbar alert
      scrollToSection(missingKeys[0].key);
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

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -140; // offset value in pixels
      const yPosition = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: yPosition, behavior: 'smooth' });
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
      {console.log("AlertBorder", AlertBorder)}
      {/* {console.log("allKeysExist", allKeysExist)} */}
      {/* <ReportView Mode={Mode} data={FormData}/> */}
      <AlertBar open={Alert} setOpen={setAlert} AlertType={AlertType} AlertText={AlertText}/>
      <OccurrenceStyle>
        <Box className="FormHeader">
        {Mode==="Add" && <span>รายงานเหตุการณ์(ใหม่)</span>}
        {Mode==="Edit" && <span>รายงานเหตุการณ์(แก้ไข)</span>}
        {Mode==="Show" && <span>รายงานเหตุการณ์</span>}
          
          <span>
            {Mode!=="Show" &&
            <Tooltip title="ล้างข้อมูลทั้งหมด">
              <IconButton aria-label="clear" onClick={ClearData}>
                <CleaningServicesIcon />
              </IconButton>
            </Tooltip>
            }
          </span>
        </Box>

        <Box className="MainContainer">

        
        {/* <MainForm
                data={FormData}
                setDataFunction={handleDataChange}
                userdata={UserData}
              /> */}

          {Stage === 1 && (
            <>
              <GeneralInfo
                Mode={Mode}
                data={FormData}
                setDataFunction={handleDataChange}
                userdata={UserData}
                missingKeys={AlertBorder}
              />
            {/* </>
          )}
          {Stage === 2 && (
            <> */}
            <Divider variant="middle" flexItem sx={{m:1}} />
              {/* <ReportType data={FormData} setDataFunction={handleDataChange} /> */}
              <ReportLog
              Mode={Mode}
                data={FormData}
                setDataFunction={handleDataChange}
                handleDateChange={handleDateChange}
                handleDataChangeCheckbox={handleDataChangeCheckbox}
                depoptiondata={departmentRaw}
                missingKeys={AlertBorder}
              />
            {/* </>
          )}
          {Stage === 3 && (
            <> */}
            <Divider variant="middle" flexItem sx={{m:1}} />
              <ReportRiskType
                Mode={Mode}
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
              {/* {console.log(typeof(OccStage),OccStage)} */}
          {Stage === 1 && (
<>
<Divider variant="middle" flexItem sx={{m:1}} />
<Box className="TopicHeader">
            {/* {optionsdata[datacolumn].topic &&
            optionsdata[datacolumn].topic} */}
            หัวข้อระบบงานที่เกี่ยวข้องกับเหตุการณ์ที่เกิดขึ้น
        </Box>
        <ListSelectData data={FormData} Mode={Mode} DeleteFunction={removeDataFromCheckboxList} setOccStage={setOccStage}/>

{Mode!=="Show" && 

(<>
              <select className="SelectInputDominant" id="OccStage" name="OccStage" form="OccStage" value={OccStage} onChange={handleDataOccStageChange}>
                <option value={1}>กระบวนการดูแลผู้ป่วย</option>
                <option value={2}>ระบบงานสนับสนุนการดูแลผู้ป่วย</option>
                <option value={3}>ระบบสาธารณูปโภค / ระบบสำรอง</option>
                <option value={4}>ระบบเครื่องมือ / อุปกรณ์</option>
                <option value={5}>ความปลอดภัย และสิ่งแวดล้อม</option>
                <option value={6}>ระบบงานบริการ</option>
                <option value={7}>ระบบบริหารงาน</option>
                <option value={0}>-กรุณาเลือกหัวข้อ-</option>
              </select>

              {OccStage === 0 && (
                <>
                  <div style={{color:"#b00e0e",margin:"50px"}}> โปรดเลือกหัวข้อเพื่อแสดงรายการตามหมวดหมู่ และทำเครื่องอย่างน้อย 1 รายการ</div>
                </>
              )}


            {OccStage === 1 && (
              <SelectBoxList
                data={FormData}
                optionsdata={DataDict_OccurrenceForm}
                datacolumn="patientcare"
                remark={true}
                remarkno="199"
                remarkcolumn="patientcareremark"
                handleDataChangeCheckbox={handleDataChangeCheckbox}
                handleDataChange={handleDataChange}
                OccStage={OccStage}
                setOccStage={setOccStage}
              />
            )}
            {OccStage === 2 && (
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
            {OccStage === 3 && (
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
            {OccStage === 4 && (
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
            {OccStage === 5 && (
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
            {OccStage === 6 && (
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
            {OccStage === 7 && (
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
           </>) 
}
            </>
          )}
          <Divider variant="middle" flexItem sx={{m:1}} />
          {Stage === 1 && (
            <>
            
            <ReportDescription
                Mode={Mode}
                data={FormData}
                setDataFunction={handleDataChange}
                missingKeys={AlertBorder}
              />
            
              </>
          )}
          <Divider variant="middle" flexItem sx={{m:1}} />
          {Stage === 1 && (
            <>
              <ReportStaff
              Mode={Mode}
              data={FormData}
              setDataFunction={handleDataChange}
              setData={handleDataSingleChange}
              missingKeys={AlertBorder}
            />
            
              <ReportSugestions
                Mode={Mode}
                data={FormData}
                setDataFunction={handleDataChange}
                missingKeys={AlertBorder}
              />
            </>
          )}
        </Box>

        <NavForm
          Mode={Mode}
          submitfunction={handleSubmit}
          handleSubmitEdit={handleSubmitEdit}
          Stage={Stage}
          MaxStage={1}
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

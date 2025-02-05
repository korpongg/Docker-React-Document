import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import ViewIcon from '@mui/icons-material/FindInPageRounded';
import Button from '@mui/material/Button';
import Tooltip from "@mui/material/Tooltip";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Divider from "@mui/material/Divider";

import GeneralInfo from "../../form/GeneralInfo";
import ReportLog from "../../form/ReportLog";
import ReportRiskType from "../../form/ReportRiskType";
import SelectBoxList from "../../form/SelectBoxList";
import ReportDescription from "../../form/ReportDescription";
import ReportStaff from "../../form/ReportStaff";
import ReportSugestions from "../../form/ReportSugestions";
import ReportFile from "../../form/ReportFile";
import NavForm from "../../form/NavForm";
import ListSelectData from "../../form/ListSelectData";

import DataDict_OccurrenceForm from "../../../data/form/DataDict_OccurrenceForm";
import DataDict_Risk from "../../../data/form/DataDict_Risk";
import { OccurrenceStyle } from "../../../styles/OccurrenceStyle.style";
import departmentRaw from "../../../data/rawData.json";
import AlertBar from "../../form/AlertBar";
import { chkAdmins, chkAdmin, TimeConverter, checkFileExists } from "../../Function";
import ReportComment from "../../form/ReportComment";
import showAlert from "../../../utils/alertService";

const Occurrence = ({ Mode }) => {
  let { id } = useParams();
  const OccType = "Occurrence";
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
  const hostUrl = import.meta.env.VITE_REACT_APP_HOST_URL;
  const storedAuth = JSON.parse(localStorage.getItem("auth"));
  const config = { headers: { Authorization: `Bearer ${storedAuth.accessToken}` } };
  const navigate = useNavigate();
  const UserData = JSON.parse(localStorage.getItem("userData")) || null;
  const TempFormData = JSON.parse(localStorage.getItem("FormData")) || {};
  const [Stage, setStage] = useState(1);
  const [OccStage, setOccStage] = useState(0);
  const [formData, setFormData] = useState({});
  const [attachData, setAttachData] = useState({
    filePDF: null,
    filePDFName: null,
    previewPDF: null,
    fileImage: null,
    fileImageName: null,
    previewImg: null,
  });
  const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
  const MAX_DOC_SIZE = 5 * 1024 * 1024; // 5MB
  const [EditFormData, setEditFormData] = useState({});
  const [Alert, setAlert] = useState(false);
  const [AlertType, setAlertType] = useState("error");
  const [AlertText, setAlertText] = useState("");
  const [AlertBorder, setAlertBorder] = useState([]);
  const [Access, setAccess] = useState(false);
  const isAdmin = chkAdmins(UserData?.role);
  const isEXEC = chkAdmin(UserData?.level);

  const handleDataChange = (event, name) => {
    const Text = event.target.value;
    setFormData({ ...formData, [name]: Text });
    if (Mode === "Edit") {
      setEditFormData({ ...EditFormData, [name]: Text });
    }
  };
  const handleDataChangeSingle = (datavalue, name) => {
    const Text = datavalue;
    setFormData({ ...formData, [name]: Text });
    if (Mode === "Edit") {
      setEditFormData({ ...EditFormData, [name]: Text });
    }
  };

  const handleReplaceData = (source, destination) => {
    const tempsource = formData[source];
    // console.log("tempsource",tempsource);
    setFormData({ ...formData, [destination]: tempsource });
    setEditFormData({ ...EditFormData, [destination]: tempsource });
  };

  const handleDataOccStageChange = (event) => {
    const Text = event.target.value;
    setOccStage(parseInt(Text, 10));
  };

  const handleDateChange = (event, name) => {
    const AddDate = new Date(event.target.value);
    const EditDate = TimeConverter(event.target.value, 7);
    setFormData({ ...formData, [name]: AddDate });
    if (Mode === "Edit") {
      setEditFormData({ ...EditFormData, [name]: EditDate });
    }
  };
      
  const fetchAttach = async () => {
    try {
      const imgExtensions = ["jpg", "jpeg", "png"]; // List of image formats to check
      let imgPathLocl = "";
      let imgExt = "";
      let imgExists = false;

      // Check for image files dynamically
      for (const ext of imgExtensions) {
        const imgPath = `${apiUrl}/filemanage/OCC${formData.reportid}.${ext}`;
        const localPath = `../../../storage/attachfiles/OCC${formData.reportid}.${ext}`;
        
        if (await checkFileExists(imgPath)) {
          imgPathLocl = localPath;
          imgExt = ext;
          imgExists = true;
          break;
        }
      }
      if (imgExists) {
        setAttachData((prevAttachData) => ({ ...prevAttachData, fileImageName: `OCC${formData.reportid}.${imgExt}`, previewImg: imgPathLocl }));
      }
      
      const docExtensions = ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx"]; 
      let docPathLocal = "";
      let docExt = "";
      let docExists = false;

      // Check for Doc files dynamically
      for (const ext of docExtensions) {
        const docPath = `${apiUrl}/filemanage/OCC${formData.reportid}.${ext}`;
        const localPath = `../../../storage/attachfiles/OCC${formData.reportid}.${ext}`;
        const hostPath = `${hostUrl}/storage/attachfiles/OCC${formData.reportid}.${ext}`;
        
        if (await checkFileExists(docPath)) {
          docPathLocal = ext === "pdf" ? localPath : hostPath;
          docExt = ext;
          docExists = true;
          break;
        }
      }
      
      if (docExists) {
        setAttachData((prevAttachData) => ({
          ...prevAttachData,
          filePDFName: `OCC${formData.reportid}.${docExt}`,
          previewPDF: docPathLocal,
        }));
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Get Data For Mode Edit&Show
  const FetchOccurranceById = async () => {
    try {
      const response = await axios.get(`${apiUrl}/occurrences/${id}`, config);

      if (response.status === 200 || response.status === 201) {
        if (Mode === "Edit") {
          if (isAdmin || UserData.userid === response.data.createby) {
            setFormData({
              ...response.data,
              userreport: response.data.createby,
              reportdate: TimeConverter(response.data.createAt, -7),
              occurrencedate: TimeConverter(response.data.occurrencedate, -7),
              aff: response.data.requestaff,
              faction: response.data.requestfac,
              dep: response.data.requestdep,
              // renew: response.data.description || null,
            }),
              setAccess(true);
          } else {
            setAccess(false);
          }
        } else {
          if (isAdmin || UserData.userid === response.data.createby) {
            setFormData({
              ...response.data,
              userreport: response.data.createby,
              reportdate: TimeConverter(response.data.createAt, -7),
              occurrencedate: TimeConverter(response.data.occurrencedate, -7),
              aff: response.data.requestaff,
              faction: response.data.requestfac,
              dep: response.data.requestdep,
              // renew: response.data.description || null,
            }),
              setAccess(true);
          } else if (isEXEC) {
            if (UserData.affiliation === "งานคุณภาพ") {
              setFormData({
                ...response.data,
                userreport: response.data.createby,
                reportdate: TimeConverter(response.data.createAt, -7),
                occurrencedate: TimeConverter(response.data.occurrencedate, -7),
                aff: response.data.requestaff,
                faction: response.data.requestfac,
                dep: response.data.requestdep,
                // renew: response.data.description || null,
              }),
                setAccess(true);
            } else if (UserData.affiliation === response.data.requestaff) {
              setFormData({
                ...response.data,
                userreport: response.data.createby,
                reportdate: TimeConverter(response.data.createAt, -7),
                occurrencedate: TimeConverter(response.data.occurrencedate, -7),
                aff: response.data.requestaff,
                faction: response.data.requestfac,
                dep: response.data.requestdep,
                description: "...",
              }),
                setAccess(true);
            }
          } else {
            if (UserData.affiliation === response.data.requestaff) {
              setFormData({
                ...response.data,
                userreport: response.data.createby,
                reportdate: TimeConverter(response.data.createAt, -7),
                occurrencedate: TimeConverter(response.data.occurrencedate, -7),
                aff: response.data.requestaff,
                faction: response.data.requestfac,
                dep: response.data.requestdep,
                description: "...",
              }),
                setAccess(true);
            } else {
              setAccess(false);
            }
          }
        }
      }
    } catch (error) {
      console.error(`Error fetching user data: ${error.message}`);
      navigate("/missing");
    }
  };

  const handleDataChangeCheckbox = (dataarray, columnname) => {
    setFormData({ ...formData, [columnname]: dataarray });
    if (Mode === "Edit") {
      setEditFormData({ ...EditFormData, [columnname]: dataarray });
    }
  };

  const removeDataFromCheckboxList = (key, value) => {
    setFormData((prevData) => {
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
        [key]: prevData[key].filter((item) => item !== value),
      };
    });
  };

  const handleDataSingleChange = (data, name) => {
    setFormData({ ...formData, [name]: data });
    if (Mode === "Edit") {
      setEditFormData({ ...EditFormData, [name]: data });
    }
  };

  const NextStage = () => {
    localStorage.setItem("FormData", JSON.stringify(formData));
    setStage(Stage + 1);
    handleScrollToTop();
  };
  const PrevStage = () => {
    if (Stage > 1) {
      localStorage.setItem("FormData", JSON.stringify(formData));
      setStage(Stage - 1);
      handleScrollToTop();
    }
  };
  const FirstStage = () => {
    localStorage.setItem("FormData", JSON.stringify(formData));
    setStage(1);
    handleScrollToTop();
  };
  const LastStage = (MaxStage) => {
    localStorage.setItem("FormData", JSON.stringify(formData));
    setStage(MaxStage);
    handleScrollToTop();
  };
  const ToStage = (toval, MaxStage) => {
    if (toval <= MaxStage && toval > 0) {
      localStorage.setItem("FormData", JSON.stringify(formData));
      setStage(toval);
      handleScrollToTop();
    }
  };

  useEffect(() => {
    if (Mode === "Add") {
      setAccess(true),
        setFormData({
          ...TempFormData,
          userreport: UserData.userid,
          requestby: UserData?.title + " " + UserData?.name + " " + UserData?.lastname,
          pct: "ไม่ระบุ",
          gender: "M",
          reportdate: new Date(),
          occurrencedate: new Date(),
          type: "opd",
          reporttype: "0",
          aff: UserData.affiliation,
          faction: UserData.faction,
          dep: UserData.dep,
          createby: UserData.userid,
        });
    } else {
      FetchOccurranceById();
      setEditFormData({ id: parseInt(id, 10) });
    }
  }, []);

  useEffect(() => {
    if(formData.reportid) {
      fetchAttach();
    }
  }, [formData.reportid]);

  const handleImgChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      if (!["image/jpeg", "image/png"].includes(selectedFile.type)) {
        alert("กรุณาเลือกไฟล์ .jpg หรือ .png เท่านั้น");
        e.target.value = "";
        return;
      }
  
      if (selectedFile.size > MAX_IMAGE_SIZE) {
        alert("ไฟล์รูปภาพต้องไม่เกิน 2MB");
        e.target.value = "";
        return;
      }
  
      setAttachData((prevAttachData) => ({
        ...prevAttachData,
        fileImage: selectedFile,
        fileImageName: selectedFile.name,
      }));

      const reader = new FileReader();
      reader.onload = () => {
        setAttachData((prevAttachData) => ({ ...prevAttachData, previewImg: reader.result }));
      };

      reader.readAsDataURL(selectedFile);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
  
    if (selectedFile) {
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      ];

      if (!allowedTypes.includes(selectedFile.type)) {
        alert("กรุณาเลือกไฟล์เอกสารที่รองรับ (PDF, Word, Excel, PowerPoint)");
        e.target.value = "";
        return;
      }

      if (selectedFile.size > MAX_DOC_SIZE) {
        alert("ไฟล์ต้องไม่เกิน 5MB");
        e.target.value = "";
        return;
      }

      setAttachData((prevAttachData) => ({
        ...prevAttachData,
        filePDF: selectedFile,
        filePDFName: selectedFile.name,
        previewPDF: selectedFile.type === "application/pdf" ? URL.createObjectURL(selectedFile) : null,
      }));
    }
  };

  const ClearData = () => {
    localStorage.removeItem("FormData");
    setFormData({
      userreport: UserData.userid,
      requestby: UserData?.title + " " + UserData?.name + " " + UserData?.lastname,
      reportdate: new Date(),
      occurrencedate: new Date(),
      type: "opd",
      reporttype: "0",
      aff: UserData.affiliation,
      faction: UserData.faction,
      dep: UserData.dep,
      createby: UserData.userid,
    });
    setAttachData({
      filePDF: null,
      filePDFName: null,
      previewPDF: null,
      fileImage: null,
      fileImageName: null,
      previewImg: null,
    });
  };

  const keydata = [
    // { key: "hn", name: "hn", location: 1 },
    // { key: "an", name: "an", location: 1 },
    // { key: "age", name: "อายุ", location: 1 },
    { key: "gender", name: "เพศ", location: 1 },
    // { key: "dx", name: "Dx.", location: 1 },
    { key: "pct", name: "PCT ที่เกี่ยวข้าง", location: 1 },
    // { key: "reportlocation", name: "สถานที่เกิดเหตุ", location: 1 },
    { key: "occurrencedate", name: "วัน-เวลาที่เกิดเหตุการณ์", location: 1 },
    { key: "deptrelate", name: "หน่วยงานที่เกี่ยวข้อง", location: 1 },
    { key: "level", name: "ระดับความเสี่ยง", location: 1 },
    { key: "description", name: "บรรยายสรุปเหตุการณ์ที่เกิดขึ้น", location: 1 },
    // { key: "effectremark", name: "ระบุความเสียหายที่เกิดขึ้น", location: 1 },
    { key: "impromptusolution", name: "การแก้ปัญหาเฉพาะหน้า", location: 1 },
    { key: "activefailure", name: "ความคลาดเคลื่อนที่เกิดขึ้น", location: 1 },
    { key: "suggestion", name: "ข้อเสนอแนะ", location: 1 },
  ];

  const keysToCheck = [
    "equipment",
    "management",
    "patientcare",
    "patientsupport",
    "safety",
    "service",
    "utility",
  ];

  const handleSubmit = async (Mode) => {
    const missingKeys = keydata.filter(({ key }) => {
      if (key === "deptrelate") {
        return !(formData[key] && formData[key].length);
      } else {
        return !formData[key] || formData[key] === ""; // Ensure it's not empty
      }
    });
    const totalLength = keysToCheck.reduce((sum, key) => {
      if (Array.isArray(formData[key])) {
        return sum + formData[key].length;
      }
      return sum;
    }, 0);
    if (Mode !== "Draft") {
      setAlertBorder(missingKeys);
    }
    if (missingKeys.length === 0 || Mode === "Draft") {
      // let submitFormData;
      if (totalLength > 0 || Mode === "Draft") {
        // submitFormData = {
        //   ...formData,
        //   deptrelate: JSON.stringify(formData.deptrelate),
        //   equipment: JSON.stringify(formData.equipment),
        //   management: JSON.stringify(formData.management),
        //   patientcare: JSON.stringify(formData.patientcare),
        //   patientsupport: JSON.stringify(formData.patientsupport),
        //   safety: JSON.stringify(formData.safety),
        //   service: JSON.stringify(formData.service),
        //   utility: JSON.stringify(formData.utility),
        //   occurrencedate: TimeConverter(formData.occurrencedate, 7),
        //   reportdate: TimeConverter(formData.reportdate, 7),
        //   formstatus: "0",
        // };
        
        const submitFormData = new FormData();
        Object.keys(formData).forEach((key) => {
          if (formData[key] !== undefined && formData[key] !== null) {
            // Exclude occurrencedate and reportdate
            if (key !== "occurrencedate" && key !== "reportdate") {
              // Convert arrays/objects to JSON string before appending
              if (typeof formData[key] === "object") {
                submitFormData.append(key, JSON.stringify(formData[key]));
              } else {
                submitFormData.append(key, formData[key]);
              }
            }
          }
        });
        submitFormData.append("occurrencedate", TimeConverter(formData.occurrencedate, 7));
        submitFormData.append("reportdate", TimeConverter(formData.reportdate, 7));
        if (attachData.fileImage) {
          submitFormData.append("files", attachData.fileImage);
        }
        if (attachData.filePDF) {
          submitFormData.append("files", attachData.filePDF);
        }
        submitFormData.append("formstatus", "0");

        try {
          const response = await axios.post(`${apiUrl}/occurrences`, submitFormData, { ...config });
          const responseStatus = response.status;

          if (responseStatus === 200 || responseStatus === 201) {
            navigate("/occurrence");
          }
        } catch (err) {
          console.error(err);
        }
      } else {
        setStage(1);
        setOccStage(0);
        // setAlertText("ไม่สามารถบันทึกข้อมูลได้ กรุณาเลือกอย่างน้อย 1 หัวข้อ");
        showAlert("กรุณาเลือกหัวข้อระบบงานที่เกี่ยวข้องกับเหตุการณ์ที่เกิดขึ้น อย่างน้อย 1 หัวข้อ", "ไม่สามารถบันทึกข้อมูลได้", "error");
        console.log("ไม่สามารถบันทึกข้อมูลได้ กรุณาเลือกอย่างน้อย 1 หัวข้อ");
        // setAlert(true);
        scrollToSection("ListSelect");
      }
    } else {
      setStage(missingKeys[0].location);
      // setAlertText("ไม่สามารถบันทึกข้อมูลได้ โปรดระบุ '" + missingKeys[0].name + "'");
      showAlert("โปรดระบุ '" + missingKeys[0].name + "'", "ไม่สามารถบันทึกข้อมูลได้", "error");
      console.log("Some keys are missing.Cannot submit form data.", missingKeys[0].key);
      setAlert(true);
      scrollToSection(missingKeys[0].key);
    }
  };

  const handleSubmitEdit = async (Mode) => {
    const missingKeys = keydata.filter(({ key }) => {
      if (key === "deptrelate") {
        return !(formData[key] && formData[key].length);
      } else {
        return !formData[key] || formData[key] === ""; // Ensure it's not empty
      }
    });
    const totalLength = keysToCheck.reduce((sum, key) => {
      if (Array.isArray(formData[key])) {
        return sum + formData[key].length;
      }
      return sum;
    }, 0);
    if (Mode !== "Draft") {
      setAlertBorder(missingKeys);
    }
    if (missingKeys.length === 0 || Mode === "Draft") {
      // let submitEditFormData;
      if (totalLength > 0 || Mode === "Draft") {
        // submitEditFormData = {
        //   ...EditFormData,
        //   deptrelate: JSON.stringify(formData.deptrelate),
        //   equipment: JSON.stringify(formData.equipment),
        //   management: JSON.stringify(formData.management),
        //   patientcare: JSON.stringify(formData.patientcare),
        //   patientsupport: JSON.stringify(formData.patientsupport),
        //   safety: JSON.stringify(formData.safety),
        //   service: JSON.stringify(formData.service),
        //   utility: JSON.stringify(formData.utility),
        //   updateby: UserData.userid,
        // };
        // if (Mode === "Draft") {
        //   submitEditFormData = {
        //     ...submitEditFormData,
        //     formstatus: "0",
        //   };
        // }
        // if (Mode === "Submit") {
        //   if (formData.formstatus === "0") {
        //     submitEditFormData = {
        //       ...submitEditFormData,
        //       formstatus: "1",
        //     };
        //   }
        // }
        // console.log("submitEditFormData", submitEditFormData);
        
        const submitEditFormData = new FormData();
        Object.keys(formData).forEach((key) => {
          if (formData[key] !== undefined && formData[key] !== null) {
            // Exclude occurrencedate and reportdate
            if (key !== "updateby" && key !== "occurrencedate" && key !== "reportdate" && key != "formstatus") {
              // Convert arrays/objects to JSON string before appending
              if (typeof formData[key] === "object") {
                submitEditFormData.append(key, JSON.stringify(formData[key]));
              } else {
                submitEditFormData.append(key, formData[key]);
              }
            }
          }
        });
        submitEditFormData.append("updateby", UserData.userid);
        submitEditFormData.append("occurrencedate", TimeConverter(formData.occurrencedate, 7));
        submitEditFormData.append("reportdate", TimeConverter(formData.reportdate, 7));
        if (attachData.fileImage) {
          submitEditFormData.append("files", attachData.fileImage);
        }
        if (attachData.filePDF) {
          submitEditFormData.append("files", attachData.filePDF);
        }
        if (Mode === "Draft") {
          submitEditFormData.append("formstatus", "0");
        }
        if (Mode === "Submit") {
          if (formData.formstatus === "0") {
            submitEditFormData.append("formstatus", "1");
          }
        }

        try {
          const response = await axios.put(`${apiUrl}/occurrences`, submitEditFormData, { ...config });
          const responseStatus = response.status;

          if (responseStatus === 200 || responseStatus === 201) {
            navigate("/occurrence");
          }
        } catch (err) {
          console.error(err);
        }
      } else {
        setStage(1);
        setOccStage(0);
        // setAlertText("ไม่สามารถบันทึกข้อมูลได้ กรุณาเลือกอย่างน้อย 1 หัวข้อ");
        showAlert("กรุณาเลือกหัวข้อระบบงานที่เกี่ยวข้องกับเหตุการณ์ที่เกิดขึ้น อย่างน้อย 1 หัวข้อ", "ไม่สามารถบันทึกข้อมูลได้", "error");
        console.log("ไม่สามารถบันทึกข้อมูลได้ กรุณาเลือกอย่างน้อย 1 หัวข้อ");
        // setAlert(true);
        scrollToSection("ListSelect");
      }
    } else {
      setStage(missingKeys[0].location);
      // setAlertText("ไม่สามารถบันทึกข้อมูลได้ โปรดระบุ '" + missingKeys[0].name + "'");
      showAlert("โปรดระบุ '" + missingKeys[0].name + "'", "ไม่สามารถบันทึกข้อมูลได้", "error");
      console.log("Some keys are missing.Cannot submit form data.", missingKeys[0].key);
      // setAlert(true);
      scrollToSection(missingKeys[0].key);
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -140; // offset value in pixels
      const yPosition =
        element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: yPosition, behavior: "smooth" });
    }
  };

  return (
    <>
      <AlertBar
        open={Alert}
        setOpen={setAlert}
        AlertType={AlertType}
        AlertText={AlertText}
      />
      <OccurrenceStyle>
        {/* {console.log(FormData)} */}
        <Box className="FormHeader">
          {Mode === "Add" && <span>รายงานเหตุการณ์(ใหม่)</span>}
          {Mode === "Edit" && <span>รายงานเหตุการณ์(แก้ไข)</span>}
          {Mode === "Show" && <span>รายงานเหตุการณ์</span>}

          <span>
            {Mode === "Add" && (
              <Tooltip title="ล้างข้อมูลทั้งหมด">
                <IconButton aria-label="clear" onClick={ClearData}>
                  <CleaningServicesIcon />
                </IconButton>
              </Tooltip>
            )}
            {formData && Mode !== "Add" && (<span style={{ fontSize: "20px" }}>หมายเลขเอกสาร : {formData.reportid}&nbsp;&nbsp;</span>)}
          </span>
        </Box>

        {Access ? (
          <Box className="MainContainer">
            {Stage === 1 && (
              <>
                <GeneralInfo
                  Mode={Mode}
                  data={formData}
                  setDataFunction={handleDataChange}
                  setSingleDataFunction={handleDataChangeSingle}
                  missingKeys={AlertBorder}
                />

                <Divider variant="middle" flexItem sx={{ m: 1 }} />
                <ReportLog
                  FormType="Occ"
                  Mode={Mode}
                  data={formData}
                  setDataFunction={handleDataChange}
                  handleDateChange={handleDateChange}
                  handleDataChangeCheckbox={handleDataChangeCheckbox}
                  depoptiondata={departmentRaw}
                  missingKeys={AlertBorder}
                />

                <Divider variant="middle" flexItem sx={{ m: 1 }} />
                <ReportRiskType
                  Mode={Mode}
                  data={formData}
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
            {Stage === 1 && (
              <>
                <Divider variant="middle" flexItem sx={{ m: 1 }} />
                <Box className="TopicHeader">
                  หัวข้อระบบงานที่เกี่ยวข้องกับเหตุการณ์ที่เกิดขึ้น
                  <Button variant="outlined" sx={{ fontFamily: 'inherit', marginLeft: 1 }} startIcon={<ViewIcon />} onClick={() => window.open("https://drive.google.com/file/d/1LfK2DArKhfbYODkGmhXsGIm-BAWdEIui/view?usp=drive_link", "_blank")}>ดูตัวอย่าง</Button>
                </Box>
                <ListSelectData
                  OccType={OccType}
                  data={formData}
                  Mode={Mode}
                  DeleteFunction={removeDataFromCheckboxList}
                  setOccStage={setOccStage}
                />
                {Mode !== "Show" && (
                  <>
                    <select
                      className="SelectInputDominant"
                      id="OccStage"
                      name="OccStage"
                      form="OccStage"
                      value={OccStage}
                      onChange={handleDataOccStageChange}
                    >
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
                        <div style={{ color: "#b00e0e", margin: "50px" }}>
                          {" "}
                          โปรดเลือกหัวข้อเพื่อแสดงรายการตามหมวดหมู่
                          และทำเครื่องอย่างน้อย 1 รายการ
                        </div>
                      </>
                    )}

                    {OccStage === 1 && (
                      <SelectBoxList
                        data={formData}
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
                        data={formData}
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
                        data={formData}
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
                        data={formData}
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
                        data={formData}
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
                        data={formData}
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
                        data={formData}
                        optionsdata={DataDict_OccurrenceForm}
                        datacolumn="management"
                        remark={true}
                        remarkno="799"
                        remarkcolumn="managementremark"
                        handleDataChangeCheckbox={handleDataChangeCheckbox}
                        handleDataChange={handleDataChange}
                      />
                    )}
                  </>
                )}
              </>
            )}
            <Divider variant="middle" flexItem sx={{ m: 1 }} />
            {Stage === 1 && (
              <>
                <ReportDescription
                  OccType={OccType}
                  Mode={Mode}
                  data={formData}
                  setDataFunction={handleDataChange}
                  missingKeys={AlertBorder}
                  UserData={UserData}
                  isAdmin={isAdmin}
                  handleReplaceData={handleReplaceData}
                />
              </>
            )}
            <Divider variant="middle" flexItem sx={{ m: 1 }} />
            {Stage === 1 && (
              <>
                <ReportStaff
                  Mode={Mode}
                  data={formData}
                  setDataFunction={handleDataChange}
                  setData={handleDataSingleChange}
                  missingKeys={AlertBorder}
                />

                <ReportSugestions
                  Mode={Mode}
                  data={formData}
                  setDataFunction={handleDataChange}
                  missingKeys={AlertBorder}
                />
              </>
            )}
            
            <ReportFile Mode={Mode} attachData={attachData} handleImgChange={handleImgChange} handleFileChange={handleFileChange} />

            {Mode === "Show" && (isAdmin || isEXEC) && Stage === 1 && ["2", "5"].includes(formData.formstatus) && (
              <>
                <Divider variant="middle" flexItem sx={{ m: 1 }} />
                <ReportComment data={formData} />
              </>
            )}
          </Box>
        ) : (
          <Box className="MainContainer">
            <div className="AccessBox">
              {Mode === "Edit" ? "คุณไม่มีสิทธิในการแก้ไขนี้ ขออภัยในความไม่สะดวก" : "คุณไม่มีสิทธิในการเข้าถึงข้อมูลนี้ ขออภัยในความไม่สะดวก"}
            </div>
          </Box>
        )}
        <NavForm
          Mode={Mode}
          Data={formData}
          Access={formData.createby === UserData.userid || isAdmin}
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

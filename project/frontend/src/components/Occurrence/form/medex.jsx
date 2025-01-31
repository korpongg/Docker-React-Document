import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import Tooltip from "@mui/material/Tooltip";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Divider from "@mui/material/Divider";

import GeneralInfo from "../../form/GeneralInfo";
import ReportLog from "../../form/ReportLog";
import ReportRiskType from "../../form/ReportRiskType";
import SelectBoxList from "../../form/SelectBoxList";
import SelectBoxListRCA from "../../form/SelectBoxListRCA";
import ReportDescription from "../../form/ReportDescription";
import ReportStaff from "../../form/ReportStaff";
import ReportSugestionsMed from "../../form/ReportSugestionsMed";
import ReportComment from "../../form/ReportComment";
import ReportFile from "../../form/ReportFile";
import NavForm from "../../form/NavForm";
import ListSelectData from "../../form/ListSelectData";

// import DataDict_OccurrenceForm from "../../../data/form/DataDict_OccurrenceForm";
import DataDict_MedicationForm from "../../../data/form/DataDict_MedicationForm";
import DataDict_Risk from "../../../data/form/DataDict_Risk";
import DataDict_Med from "../../../data/form/DataDict_Med";
import { MedicationStyle } from "../../../styles/MedicationStyle.style";
import departmentRaw from "../../../data/rawData.json";
import AlertBar from "../../form/AlertBar";
import { chkMedic, chkHead, chkAdmins, chkAdmin, TimeConverter, checkFileExists } from "../../Function";
import showAlert from "../../../utils/alertService";

const Medication = ({ Mode }) => {
  let { id } = useParams();
  const OccType = "Medication";
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
  const storedAuth = JSON.parse(localStorage.getItem("auth"));
  const config = {
    headers: { Authorization: `Bearer ${storedAuth.accessToken}` },
  };
  const navigate = useNavigate();
  const UserData = JSON.parse(localStorage.getItem("userData")) || null;
  const TempFormData = JSON.parse(localStorage.getItem("FormData")) || {};
  const [Stage, setStage] = useState(1);
  const [OccStage, setOccStage] = useState(0);
  const [formData, setFormData] = useState({});
    const [pdfData, setPDFData] = useState({
      filePDF: null,
      filePDFName: null,
      previewPDF: null,
    });
  const [EditFormData, setEditFormData] = useState({});
  const [Alert, setAlert] = useState(false);
  const [AlertType, setAlertType] = useState("error");
  const [AlertText, setAlertText] = useState("");
  const [AlertBorder, setAlertBorder] = useState([]);
  const [Access, setAccess] = useState(false);
  const isHead = chkHead(UserData?.level);
  const isAdmin = chkAdmins(UserData?.role);
  const isEXEC = chkAdmin(UserData?.level);

  const showMedicationMenu = isAdmin || chkMedic(UserData?.AffID, UserData?.faction) || (isEXEC && UserData?.affiliation === "งานคุณภาพ");

  useEffect(() => {
    if (!showMedicationMenu) {
      window.location.href = "/unauthorized";
    }
  }, [showMedicationMenu]);

  // const handleDataChange = (event, name) => {
  //   const Text = event.target.value;
  //   setFormData({ ...FormData, [name]: Text });
  //   if (Mode === "Edit") {
  //     setEditFormData({ ...EditFormData, [name]: Text });
  //   }
  // };
  const handleDataChange = (event, name) => {
    let value;

    if (event && event.target) {
      value = event.target.value;
    } else if (event && event.id !== undefined) {
      value = event.id;
    } else {
      value = "";
    }

    setFormData({ ...formData, [name]: value });

    if (Mode === "Edit") {
      setEditFormData({ ...EditFormData, [name]: value });
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
  
  const fetchDataPDF = async () => {
    try {
      const pdfPath = `${apiUrl}/filemanage/MED${formData.reportid}.pdf`;
      const pdfPathLocal = `../../../storage/attachfiles/MED${formData.reportid}.pdf`;
      const pdfExists = await checkFileExists(pdfPath);
      if (pdfExists) {
        setPDFData((prevPDFData) => ({ ...prevPDFData, filePDFName: `MED${formData.reportid}.pdf`, previewPDF: pdfPathLocal }));
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Get Data For Mode Edit&Show
  const FetchOccurranceById = async () => {
    try {
      const response = await axios.get(`${apiUrl}/medication/${id}`, config);

      if (response.status === 200 || response.status === 201) {
        if (Mode === "Edit") {
          if (isAdmin || UserData.userid === response.data.createby) {
            // console.log(TimeConverter(response.data.occurrencedate,0))
            // console.log(TimeConverter(response.data.occurrencedate,-7))
            // console.log(response.data.occurrencedate)
            setFormData({
              ...response.data,
              userreport: response.data.createby,
              reportdate: TimeConverter(response.data.createAt, -7),
              occurrencedate: TimeConverter(response.data.occurrencedate, -7),
              // occurrencedate: TimeConverter(response.data.occurrencedate,-7),
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
            }
          } else if (
            isHead &&
            UserData.DepID === response.data.deptrelate &&
            ["4", "5"].includes(response.data.formstatus)
          ) {
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
    // Sort dataarray with custom logic for version-like strings
    const sortedData = [...dataarray].sort((a, b) => {
      const aParts = a.split(".").map(Number); // Convert to array of numbers
      const bParts = b.split(".").map(Number);

      // Compare each part of the version numbers
      for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
        const aPart = aParts[i] || 0; // Default to 0 if no part exists
        const bPart = bParts[i] || 0;
        if (aPart < bPart) return -1;
        if (aPart > bPart) return 1;
      }
      return 0;
    });

    // Update the state with the sorted data
    setFormData({ ...formData, [columnname]: sortedData });

    if (Mode === "Edit") {
      setEditFormData({ ...EditFormData, [columnname]: sortedData });
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
          requestby:
            UserData?.title + " " + UserData?.name + " " + UserData?.lastname,
          pct: "ไม่ระบุ",
          gender: "M",
          reportdate: new Date(),
          occurrencedate: new Date(),
          type: "opd",
          reporttype: "1",
          aff: UserData.affiliation,
          faction: UserData.faction,
          dep: UserData.dep,
          createby: UserData.userid,
          // deptrelate:62,
        });
    } else {
      FetchOccurranceById();
      setEditFormData({ id: parseInt(id, 10) });
    }
  }, []);
  
  useEffect(() => {
    if(formData.reportid) {
      fetchDataPDF();
    }
  }, [formData.reportid]);

  const handleFilePChange = (e) => {
    const selectedFile = e.target.files[0];
  
    if (selectedFile) {
      setPDFData((prevPDFData) => ({
        ...prevPDFData,
        filePDF: selectedFile,
        filePDFName: selectedFile.name,
      }));
  
      // Check if the selected file is a PDF
      if (selectedFile.type.startsWith("application/pdf")) {
        setPDFData((prevPDFData) => ({ ...prevPDFData, previewPDF: URL.createObjectURL(selectedFile) }));
      } else {
        setPDFData((prevPDFData) => ({
          ...prevPDFData,
          filePDF: null,
          filePDFName: null,
          previewPDF: null,
        }));
        // Handle the case where the selected file is not a PDF
        // You may want to show an error message to the user
      }
  
      const reader = new FileReader();
      reader.onload = () => {
        setPDFData((prevPDFData) => ({ ...prevPDFData, previewPDF: reader.result }));
      };
  
      reader.readAsDataURL(selectedFile);
    }
  };

  const ClearData = () => {
    localStorage.removeItem("FormData");
    setFormData({
      userreport: UserData.userid,
      requestby:
        UserData?.title + " " + UserData?.name + " " + UserData?.lastname,
      reportdate: new Date(),
      occurrencedate: new Date(),
      type: "opd",
      reporttype: "1",
      aff: UserData.affiliation,
      faction: UserData.faction,
      dep: UserData.dep,
      createby: UserData.userid,
    });
    setPDFData({
      filePDF: null,
      filePDFName: null,
      previewPDF: null,
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
    // { key: "impromptusolution", name: "การแก้ปัญหาเฉพาะหน้า", location: 1 },
    // { key: "activefailure", name: "ความคลาดเคลื่อนที่เกิดขึ้น", location: 1 },
    // { key: "suggestion", name: "ข้อเสนอแนะ", location: 1 },
    // { key: "description", name: "บรรยายสรุปเหตุการณ์ที่เกิดขึ้น", location: 1 },
    // { key: "description", name: "บรรยายสรุปเหตุการณ์ที่เกิดขึ้น", location: 1 },
    // { key: "description", name: "บรรยายสรุปเหตุการณ์ที่เกิดขึ้น", location: 1 },
  ];

  const keysToCheck = [
    "prescribing",
    "dispensing",
    "administration",
    "transcribing",
  ];
  // const keysToCheck = [];

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
        //   prescribing: JSON.stringify(formData.prescribing),
        //   dispensing: JSON.stringify(formData.dispensing),
        //   administration: JSON.stringify(formData.administration),
        //   transcribing: JSON.stringify(formData.transcribing),
        //   rca: JSON.stringify(formData.rca),
        //   effect: JSON.stringify(formData.effect),
        //   drugrelate: JSON.stringify(formData.drugrelate),
        //   occurrencedate: TimeConverter(formData.occurrencedate, 7),
        //   reportdate: TimeConverter(formData.reportdate, 7),
        //   formstatus: "0",
        //   // deptrelate: JSON.stringify(formData.deptrelate),
        // };

        // console.log("submitFormData", submitFormData);
        
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
        if (pdfData.filePDF) {
          submitFormData.append("files", pdfData.filePDF);
        }
        submitFormData.append("formstatus", "0");

        try {
          const response = await axios.post(`${apiUrl}/medication`, submitFormData, { ...config });
          const responseStatus = response.status;

          if (responseStatus === 200 || responseStatus === 201) {
            navigate("/medication");
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

  const handleSubmitEdit = async (Mode) => {
    console.log("handleSubmitEdit", formData);
    const missingKeys = keydata.filter(({ key }) => {
      if (key === "deptrelate" || key === "level") {
        // return !(formData[key] && formData[key].length);
        return !formData[key];
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
        //   prescribing: JSON.stringify(formData.prescribing),
        //   dispensing: JSON.stringify(formData.dispensing),
        //   administration: JSON.stringify(formData.administration),
        //   transcribing: JSON.stringify(formData.transcribing),
        //   rca: JSON.stringify(formData.rca),
        //   effect: JSON.stringify(formData.effect),
        //   drugrelate: JSON.stringify(formData.drugrelate),
        //   updateby: UserData.userid,
        //   formstatus: formData.formstatus,
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
            if (key !== "occurrencedate" && key !== "reportdate" && key != "formstatus") {
              // Convert arrays/objects to JSON string before appending
              if (typeof formData[key] === "object") {
                submitEditFormData.append(key, JSON.stringify(formData[key]));
              } else {
                submitEditFormData.append(key, formData[key]);
              }
            }
          }
        });
        submitEditFormData.append("occurrencedate", TimeConverter(formData.occurrencedate, 7));
        submitEditFormData.append("reportdate", TimeConverter(formData.reportdate, 7));
        if (pdfData.filePDF) {
          submitEditFormData.append("files", pdfData.filePDF);
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
          const response = await axios.put(`${apiUrl}/medication`, submitEditFormData, { ...config });
          const responseStatus = response.status;

          if (responseStatus === 200 || responseStatus === 201) {
            navigate("/medication");
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
      {/* {console.log("FormData",FormData)} */}
      <AlertBar
        open={Alert}
        setOpen={setAlert}
        AlertType={AlertType}
        AlertText={AlertText}
      />
      <MedicationStyle>
        <Box className="FormHeader">
          {Mode === "Add" && <span>รายการความคลาดเคลื่อนทางยา(ใหม่)</span>}
          {Mode === "Edit" && <span>รายการความคลาดเคลื่อนทางยา(แก้ไข)</span>}
          {Mode === "Show" && <span>รายการความคลาดเคลื่อนทางยา</span>}
          {Mode === "Approve" && (<span>วิเคราะห์รายการความคลาดเคลื่อนทางยา</span>)}

          <span>
            {Mode === "Add" && (
              <Tooltip title="ล้างข้อมูลทั้งหมด">
                <IconButton aria-label="clear" onClick={ClearData}>
                  <CleaningServicesIcon />
                </IconButton>
              </Tooltip>
            )}
            {formData && Mode !== "Add" && (<span style={{ fontSize: "20px" }}>&nbsp;&nbsp;&nbsp;หมายเลขเอกสาร : {formData.reportid}&nbsp;&nbsp;</span>)}
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
                  FormType="Med"
                  Mode={Mode}
                  data={formData}
                  setSingleDataFunction={handleDataChangeSingle}
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
                  datacolumn={["", "ClinicalRisk"]}
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
                <Box className="TopicHeader">หัวข้อระบบงานที่เกี่ยวข้องกับเหตุการณ์ที่เกิดขึ้น</Box>
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
                      <option value={1}>ความคลาดเคลื่อนในการสั่งใช้ยา</option>
                      <option value={2}>ความคลาดเคลื่อนในการจัด – จ่ายยา</option>
                      <option value={3}>ความคลาดเคลื่อนในการบริหารยา</option>
                      <option value={4}>ความคลาดเคลื่อนในการคัดลอกยา</option>
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
                        Mode={Mode}
                        data={formData}
                        optionsdata={DataDict_MedicationForm}
                        datacolumn="prescribing"
                        remark={true}
                        remarkno="4.1.99"
                        remarkcolumn="prescribingremark"
                        handleDataChangeCheckbox={handleDataChangeCheckbox}
                        handleDataChange={handleDataChange}
                        OccStage={OccStage}
                        setOccStage={setOccStage}
                      />
                    )}
                    {OccStage === 2 && (
                      <SelectBoxList
                        Mode={Mode}
                        data={formData}
                        optionsdata={DataDict_MedicationForm}
                        datacolumn="dispensing"
                        remark={true}
                        remarkno="4.2.99"
                        remarkcolumn="dispensingremark"
                        handleDataChangeCheckbox={handleDataChangeCheckbox}
                        handleDataChange={handleDataChange}
                      />
                    )}
                    {OccStage === 3 && (
                      <SelectBoxList
                        Mode={Mode}
                        data={formData}
                        optionsdata={DataDict_MedicationForm}
                        datacolumn="administration"
                        remark={true}
                        remarkno="4.3.99"
                        remarkcolumn="administrationremark"
                        handleDataChangeCheckbox={handleDataChangeCheckbox}
                        handleDataChange={handleDataChange}
                      />
                    )}
                    {OccStage === 4 && (
                      <SelectBoxList
                        Mode={Mode}
                        data={formData}
                        optionsdata={DataDict_MedicationForm}
                        datacolumn="transcribing"
                        remark={true}
                        remarkno="4.4.99"
                        remarkcolumn="transcribingremark"
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
                <Box className="TopicHeader">ผลลัพธ์ที่เกิดขึ้น</Box>
                <SelectBoxList
                  Mode={Mode}
                  data={formData}
                  optionsdata={DataDict_Med}
                  datacolumn="effect"
                  remark={true}
                  remarkno="99"
                  remarkcolumn="effectremark"
                  handleDataChangeCheckbox={handleDataChangeCheckbox}
                  handleDataChange={handleDataChange}
                />
              </>
            )}

            <Divider variant="middle" flexItem sx={{ m: 1 }} />
            {Stage === 1 && (
              <>
                <Box className="TopicHeader">กลุ่มยาที่เกิดปัญหา</Box>
                <SelectBoxList
                  Mode={Mode}
                  data={formData}
                  optionsdata={DataDict_Med}
                  datacolumn="drugrelate"
                  remark={true}
                  remarkno="99"
                  remarkcolumn="drugremark"
                  handleDataChangeCheckbox={handleDataChangeCheckbox}
                  handleDataChange={handleDataChange}
                />
              </>
            )}

            <Divider variant="middle" flexItem sx={{ m: 1 }} />

            {Stage === 1 && (
              <ReportStaff
                Mode={Mode}
                data={formData}
                setDataFunction={handleDataChange}
                setData={handleDataSingleChange}
                missingKeys={AlertBorder}
              />
            )}

            {Mode === "Show" && (isAdmin || isHead || isEXEC) && Stage === 1 && (
              <ReportSugestionsMed
                OccType={OccType}
                Mode={Mode}
                data={formData}
                setDataFunction={handleDataChange}
                missingKeys={AlertBorder}
              />
            )}

            {Mode === "Show" && (isAdmin || isHead || isEXEC) && Stage === 1 && (
              <>
                <Divider variant="middle" flexItem sx={{ m: 1 }} />
                <Box className="TopicHeader">
                  สรุปผลการวิเคราะห์สาเหตุที่แท้จริง (RCA) ของความคลาดเคลื่อน
                </Box>
                <SelectBoxListRCA
                  Mode={Mode}
                  data={formData}
                  optionsdata={DataDict_Med}
                  datacolumn="rca"
                  remark={true}
                  remarkno="999"
                  remarkcolumn="rcaremark"
                  handleDataChangeCheckbox={handleDataChangeCheckbox}
                  handleDataChange={handleDataChange}
                />
              </>
            )}
            
            <ReportFile Mode={Mode} pdfData={pdfData} handleFilePChange={handleFilePChange} />

            {Mode === "Show" && (isAdmin || isHead || isEXEC) && Stage === 1 && ["2", "3", "6"].includes(formData.formstatus) && (
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
      </MedicationStyle>
    </>
  );
};

export default Medication;
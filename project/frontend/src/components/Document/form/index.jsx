import React, { useRef, useState, useEffect } from "react";
import Box from "@mui/material/Box";

import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Divider from "@mui/material/Divider";
import GeneralInfo from "../../form/GeneralInfo2";
import Swal from "sweetalert2";
import { OccurrenceStyle } from "../../../styles/OccurrenceStyle.style";
import departmentRaw from "../../../data/rawData.json";
import AlertBar from "../../form/AlertBar";
import {
  chkAdmins,
  chkAdmin,
  TimeConverter,
  checkFileExists,
} from "../../Function";
import showAlert from "../../../utils/alertService";
import { useLocation } from "react-router-dom";

const Occurrence = ({ Mode }) => {
  let { id } = useParams();
  const location = useLocation();
  const [reportid, setReportid] = useState(false);
  const [errors, setErrors] = useState({});
  const inputRefs = useRef({});
  const OccType = "Occurrence";
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
  const hostUrl = import.meta.env.VITE_REACT_APP_HOST_URL;
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

  const [disable, setDisable] = useState(false);
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
  const [board, setBoard] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(null);
  const [phone, setPhone] = useState("");
  const [patienthn, setPatientHn] = useState("");
  const [patientname, setPatientName] = useState("");
  const [patientage, setPatientAge] = useState("");
  const [patientan, setPatientAn] = useState("");
  const [patientdiagnosis, setPatientDiagnosis] = useState("");
      const [recive, setChangeRecive] = useState(0);
         const [datereceived, setDateReceived] = useState("");
 const [checked, setChecked] = useState(false);
 console.log('checked='+checked)
  const [name, setName] = useState("");
  const [showUrgent, setShowUrgent] = useState(1);
  const [showAppeal, setShowAppeal] = useState(0);

  const [array, setArray] = useState([]);

  const [Alert, setAlert] = useState(false);
  const [AlertType, setAlertType] = useState("error");
  const [AlertText, setAlertText] = useState("");
  const [AlertBorder, setAlertBorder] = useState([]);
  const [Access, setAccess] = useState(false);
  const isAdmin = chkAdmins(UserData?.role);
  const isEXEC = chkAdmin(UserData?.level);
  const handleDataChange = (event, name) => {
    const Text = event.target.value;

    /*if (name == "urgent") {
      if (Text == 0) {
        setDisable(false);
      } else {
        setDisable(true);
      }
    }

    if (name == "involved") {
      if (Text == 0) {
        setShowUrgent(1);
      } else {
        setShowUrgent(0);
      }
    }

    if (name == "appeal") {
      if (Text == 0) {
        setShowAppeal(0);
      } else {
        setShowAppeal(1);
      }
    }
      */
    setFormData({ ...formData, [name]: Text });
    if (Mode === "Edit") {
      setEditFormData({ ...EditFormData, [name]: Text });
    }
  };

  
const handleDateReceived = (e) => {
  const value = e.target.value;
setErrors((prev) => ({ ...prev, date: false }));
  setDateReceived(value);
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

  const handleSetBoard = (event) => {
    setBoard(event);
  };
  const handleSetName = (event) => {
    setName(event);
  };
  const handleSetPhone = (event) => {
    setPhone(event);
  };
  const handleSetDate = (event) => {
    setDate(event);
  };

  const handleSetTime = (value) => {
    if (!value || !value.isValid()) {
      setTime(null);
      return;
    }
    setTime(value.format("HH:mm:ss"));
  };

  const handlePatientHn = (event) => {
    setPatientHn(event);
  };

  const handlePatientName = (event) => {
    setPatientName(event);
  };

  const handlePatientAge = (event) => {
    setPatientAge(event);
  };

  const handlePatientAn = (event) => {
    setPatientAn(event);
  };
const handleDataChangeValue = (value, name) => {
  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));

  if (Mode === "Edit") {
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
};
  const handleSetPerson = (event) => {
    const maxId = array.length ? Math.max(...array.map((item) => item.id)) : 0;

    setArray([
      ...array,
      {
        id: maxId + 1,
        id_document: "",
        date_document: "",
        program_document: "",
        department: "",
        faction: -1,
        urgent: -1,
      },
    ]);
  };

  const setDataPerson = (e, index) => {
    const { name, value } = e.target;

    const newUsers = array.map((user, i) => {
      if (index - 1 === i) {
        return { ...user, [name]: value };
      }
      return user;
    });
    setArray(newUsers);
  };

  const removePerson = (id) => {
    Swal.fire({
      title: "ยืนยันการลบข้อมูล",
      text: "คุณต้องการลบรายการนี้ใช่หรือไม่? เมื่อลบแล้วจะไม่สามารถกู้คืนได้",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "ลบข้อมูล",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        const newUsers = array.filter((u) => u.id !== id);
        setArray(newUsers);
      }
    });
  };

  const setChangePerson = (event, newValue, index) => {
    const newUsers = array.map((user, i) => {
      if (index - 1 === i) {
        return {
          ...user,
          department: newValue?.id ?? null, // 🔥 เก็บแค่ id
        };
      }
      return user;
    });

    setArray(newUsers);
  };
  const handlePatientDiagnosis = (event) => {
    setPatientDiagnosis(event);
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
        setAttachData((prevAttachData) => ({
          ...prevAttachData,
          fileImageName: `OCC${formData.reportid}.${imgExt}`,
          previewImg: imgPathLocl,
        }));
      }

      const docExtensions = [
        "pdf",
        "doc",
        "docx",
        "xls",
        "xlsx",
        "ppt",
        "pptx",
      ];
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
  const FetchPerson = async () => {
    try {
      const response2 = await axios.get(
        `${apiUrl}/documentform/getComplainant/${reportid}`,
        config,
      );
      if (response2.status === 200 || response2.status === 201) {
        const list = Array.isArray(response2.data)
          ? response2.data
          : Object.values(response2.data);
 
        setArray(
          list.map((item) => ({
            id: item.id,
            id_document: item.id_document,
            urgent: item.urgent,
            date_document: item.date_document,
            program_document: item.program_document,
            name: item.name,
            department: item.department,
            faction: item.faction,
          })),
        );
        if (list.length > 0) {
          setShowAppeal(1);
        }
      }
    } catch {}
  };

  const FetchOccurranceById = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/documentform/getComplainant/${id}`,
        config,
      );

      if (response.status === 200 || response.status === 201) {
        
        if (Mode === "Edit") {
          const item = response.data[0];
   setDateReceived(item.date_received || "");
      setChangeRecive(item.department_received );
      setChecked(!!item.reply);
          setFormData({
            ...item,
            userreport: item.createby,
            reportdate: TimeConverter(item.createAt, -7),
            occurrencedate: TimeConverter(item.occurrencedate, -7),
            aff: item.requestaff,
            dep: item.requestdep,
          });

          setAccess(true);
        } else {
          if (isAdmin || UserData.userid === response.data.createby) {
            (setFormData({
              ...response.data,
              userreport: response.data.createby,
              reportdate: TimeConverter(response.data.createAt, -7),
              occurrencedate: TimeConverter(response.data.occurrencedate, -7),
              aff: response.data.requestaff,
              faction: response.data.requestfac,
              dep: response.data.requestdep,
              // renew: response.data.description || null,
            }),
              setAccess(true));
          } else if (isEXEC) {
            if (UserData.affiliation === "งานคุณภาพ") {
              (setFormData({
                ...response.data,
                userreport: response.data.createby,
                reportdate: TimeConverter(response.data.createAt, -7),
                occurrencedate: TimeConverter(response.data.occurrencedate, -7),
                aff: response.data.requestaff,
                faction: response.data.requestfac,
                dep: response.data.requestdep,
                // renew: response.data.description || null,
              }),
                setAccess(true));
            } else if (UserData.affiliation === response.data.requestaff) {
              (setFormData({
                ...response.data,
                userreport: response.data.createby,
                reportdate: TimeConverter(response.data.createAt, -7),
                occurrencedate: TimeConverter(response.data.occurrencedate, -7),
                aff: response.data.requestaff,
                faction: response.data.requestfac,
                dep: response.data.requestdep,
                description: "...",
              }),
                setAccess(true));
            }
          } else {
            if (UserData.affiliation === response.data.requestaff) {
              (setFormData({
                ...response.data,
                userreport: response.data.createby,
                reportdate: TimeConverter(response.data.createAt, -7),
                occurrencedate: TimeConverter(response.data.occurrencedate, -7),
                aff: response.data.requestaff,
                faction: response.data.requestfac,
                dep: response.data.requestdep,
                description: "...",
              }),
                setAccess(true));
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

  const handleDataChangeCheckbox = (
    dataarray,
    dataarray2,
    columnname,
    columnname2,
  ) => {
    setFormData({
      ...formData,
      [columnname]: dataarray,
      [columnname2]: dataarray2,
      ["count"]: dataarray.length,
    });

    if (Mode === "Edit") {
      setEditFormData({ ...EditFormData, [columnname]: dataarray });
      setEditFormData({ ...EditFormData, [columnname2]: dataarray2 });
    }
  };

  const handleDataChangeCheckbox2 = (
    dataarray,
    dataarray2,
    columnname,
    columnname2,
  ) => {
    setFormData({
      ...formData,
      [columnname]: dataarray,
      [columnname2]: dataarray2,
      ["count2"]: dataarray.length,
    });

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
  // โหลดข้อมูลหลัก
  useEffect(() => {
    if (Mode === "Edit") {
      FetchOccurranceById();
    }
  }, []);

  // โหลด person (ใช้ reportid จาก state จริง)
  useEffect(() => {
    if (reportid) {
      FetchPerson();
    }
  }, [reportid]);

  // โหลดไฟล์
  useEffect(() => {
    if (formData.reportid && Mode === "Edit") {
      fetchAttach();
    }
  }, [formData.reportid]);
  useEffect(() => {
    if (Mode === "Add") {
      (setAccess(true),
        setFormData({
          ...TempFormData,
          userreport: UserData.userid,
          requestby:
            UserData?.title + " " + UserData?.name + " " + UserData?.lastname,
          pct: "ไม่ระบุ",
          gender: "M",
          reportdate: new Date(),
          occurrencedate: new Date(),
          type: 0,
          record: 0,
          complaints: 0,
          involved: 0,
          appeal: 0,
          suggestion: "A",
          faction:-1,
          urgent:-1,
          achievement: 0,
          complaint: 0,
          reporttype: "0",
          aff: UserData.affiliation,
          dep: UserData.dep,
          createby: UserData.userid,
        }));
    } else {
      if (!location.state && Mode === "Edit") {
        navigate("../../home");
        return;
      }
      const { reportid } = location.state;
      setReportid(reportid);
      FetchOccurranceById();
      setEditFormData({ id: parseInt(id, 10) });
    }
  }, []);

  useEffect(() => {
    if (!location.state && Mode === "Edit") {
      navigate("../../home");
      return;
    }
    FetchPerson();
    if (formData.reportid && Mode === "Edit") {
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
        setAttachData((prevAttachData) => ({
          ...prevAttachData,
          previewImg: reader.result,
        }));
      };

      reader.readAsDataURL(selectedFile);
    }
  };

  const [checkbox, setCheckbox] = useState({
    manager: [],
    quality: [],
    nurse: [],
    administer: [],
    operation: [],
    director: [],
    doctor: [],
    compensation: [],
  });
  const handleCheckChange = (e, name) => {
    const value = e.target.name;
    const checked = e.target.checked;
    setCheckbox((prev) => ({
      ...prev,
      [name]: checked
        ? [...(prev[name] || []), value] // เพิ่ม
        : prev[name].filter((v) => v !== value), // ลบ
    }));
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
        previewPDF:
          selectedFile.type === "application/pdf"
            ? URL.createObjectURL(selectedFile)
            : null,
      }));
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
      record: 0,
      complaints: 0,
      involved: 0,
      urgent: 0,
      reply: 0,
      risk: 0,
      appeal: 0,
      suggestion: "A",
      achievement: 0,
      complaint: 0,
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

  const keydata = [];

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
    if (array.length == 0) {
      setErrors((prev) => ({ ...prev, document: true }));
      const el = inputRefs.current.document;
      if (el) {
        el.focus();
        el.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      return;
    }
    
    for (var i = 0; i < array.length; i++) {
      
      if (
        array[i].date_document.length == 0 ||
        array[i].program_document.length == 0 ||
        array[i].id_document.length == 0 ||
        array[i].department.length == 0
      ) {
        setErrors((prev) => ({ ...prev, document: true }));
        const el = inputRefs.current.document;
        if (el) {
          el.focus();
          el.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
        return;
      }
     
    }
  
 if (formData.faction == -1) {
        setErrors((prev) => ({ ...prev, faction: true }));
        const el = inputRefs.current.faction;
        if (el) {
          el.focus();
          el.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
        return;
      }
      if (formData.urgent == -1) {
        setErrors((prev) => ({ ...prev, urgent: true }));
        const el = inputRefs.current.urgent;
        if (el) {
          el.focus();
          el.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
        return;
      }
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

    submitFormData.append("array", JSON.stringify(array));
  var r=0;
        if(checked==true){
            r=1;
        }
        submitFormData.set("reply", r)
        submitFormData.set("date_received", datereceived)
        submitFormData.set("department", recive)
        console.log('บันทึกกกกกก')
    try {
      const response = await axios.post(
        `${apiUrl}/documentform`,
        submitFormData,
        { ...config },
      );
      const responseStatus = response.status;

      if (responseStatus === 200 || responseStatus === 201) {
Swal.fire({
  title: "ยืนยันการส่งเอกสาร?",
  text: "กรุณาตรวจสอบข้อมูลก่อนยืนยัน",
  icon: "question",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "ยืนยัน",
  cancelButtonText: "ยกเลิก"
}).then((result) => {
  if (result.isConfirmed) {
    Swal.fire({
      title: "ส่งเอกสารสำเร็จ!",
      text: "ระบบได้บันทึกและส่งเอกสารเรียบร้อยแล้ว",
      icon: "success",
      confirmButtonText: "ตกลง"
    }).then(() => {
      navigate("/document");
    });
  }
});
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitEdit = async (Mode) => {
  
        const submitEditFormData = new FormData();
        Object.keys(formData).forEach((key) => {
          if (formData[key] !== undefined && formData[key] !== null) {
            // Exclude occurrencedate and reportdate
            if (
              key !== "updateby" &&
              key !== "occurrencedate" &&
              key !== "reportdate" &&
              key != "formstatus"
            ) {
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

        if (Mode === "Submit") {
          if (formData.formstatus === "0") {
            submitEditFormData.append("formstatus", "1");
          }
        }
        submitEditFormData.append("array", JSON.stringify(array));
var r=0;
        if(checked==true){
            r=1;
        }
        submitEditFormData.set("reply", r)
        submitEditFormData.set("date_received", datereceived)
        submitEditFormData.set("department", recive)
        try {
          const response = await axios.put(
            `${apiUrl}/documentform`,
            submitEditFormData,
            { ...config },
          );
          const responseStatus = response.status;

          if (responseStatus === 200 || responseStatus === 201) {
            Swal.fire({
  title: "ยืนยันการส่งเอกสาร?",
  text: "กรุณาตรวจสอบข้อมูลก่อนยืนยัน",
  icon: "question",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "ยืนยัน",
  cancelButtonText: "ยกเลิก"
}).then((result) => {
  if (result.isConfirmed) {
    Swal.fire({
      title: "ส่งเอกสารสำเร็จ!",
      text: "ระบบได้บันทึกและส่งเอกสารเรียบร้อยแล้ว",
      icon: "success",
      confirmButtonText: "ตกลง"
    }).then(() => {
      navigate("/document");
    });
  }
});
          }
        } catch (err) {
          console.error(err);
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
        <Box className="px-5">
          {Stage === 1 && (
            <>
              <GeneralInfo
                Mode={Mode}
                array={array}
                data={formData}
                disable={disable}
                setSingleDataFunction={handleDataChangeSingle}
                missingKeys={AlertBorder}
                time={time}
                setCheckBoxFunction={handleCheckChange}
                FormType="Occ"
                setDataFunction={handleDataChange}
                handleSetTime={handleSetTime}
                handleSetName={handleSetName}
                setDataPerson={setDataPerson}
                setChangePerson={setChangePerson}
                handleSetPhone={handleSetPhone}
                handleSetBoard={handleSetBoard}
                handlePatientHn={handlePatientHn}
                handlePatientName={handlePatientName}
                handlePatientAge={handlePatientAge}
                handlePatientAn={handlePatientAn}
                handlePatientDiagnosis={handlePatientDiagnosis}
                handleSetPerson={handleSetPerson}
                handleSetDate={handleSetDate}
                showUrgent={showUrgent}
                showAppeal={showAppeal}
                removePerson={removePerson}
                handleDateChange={handleDateChange}
                handleDataChangeCheckbox={handleDataChangeCheckbox}
                handleDataChangeCheckbox2={handleDataChangeCheckbox2}
                depoptiondata={departmentRaw}
                setErrors={setErrors}
                errors={errors}
                inputRefs={inputRefs}
                ClearData={ClearData}
                submitfunction={handleSubmit}
                handleSubmitEdit={handleSubmitEdit}
                          setChecked={setChecked}
                          checked={checked}
                            setChangeRecive={setChangeRecive}
                handleDateReceived={handleDateReceived}
                 datereceived={datereceived}
                 recive={recive}
   handleDataChangeValue={handleDataChangeValue}
              />

              <Divider variant="middle" flexItem sx={{ m: 1 }} />
            </>
          )}

          {Mode === "Show" &&
            (isAdmin || isEXEC) &&
            Stage === 1 &&
            ["2", "5"].includes(formData.formstatus) && (
              <>
                <Divider variant="middle" flexItem sx={{ m: 1 }} />
           
              </>
            )}
        </Box>
      </OccurrenceStyle>
    </>
  );
};

export default Occurrence;

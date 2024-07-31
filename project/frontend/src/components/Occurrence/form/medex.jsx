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
import NavForm from "../../form/NavForm";
import ListSelectData from "../../form/ListSelectData";

// import DataDict_OccurrenceForm from "../../../data/form/DataDict_OccurrenceForm";
import DataDict_MedicationForm from "../../../data/form/DataDict_MedicationForm";
import DataDict_Risk from "../../../data/form/DataDict_Risk";
import DataDict_Med from "../../../data/form/DataDict_Med";
import { MedicationStyle } from "../../../styles/MedicationStyle.style";
import departmentRaw from "../../../data/rawData.json";
import AlertBar from "../../form/AlertBar";
import { chkAdmins, chkAdmin, TimeConverter } from "../../Function";

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
  const [FormData, setFormData] = useState({});
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
    setFormData({ ...FormData, [name]: Text });
    if (Mode === "Edit") {
      setEditFormData({ ...EditFormData, [name]: Text });
    }
  };

  const handleDataChangeSingle = (datavalue, name) => {
    const Text = datavalue;
    setFormData({ ...FormData, [name]: Text });
    if (Mode === "Edit") {
      setEditFormData({ ...EditFormData, [name]: Text });
    }
  };

  const handleReplaceData = (source, destination) => {
    const tempsource = FormData[source];
    // console.log("tempsource",tempsource);
    setFormData({ ...FormData, [destination]: tempsource });
    setEditFormData({ ...EditFormData, [destination]: tempsource });
  };

  const handleDataOccStageChange = (event) => {
    const Text = event.target.value;
    setOccStage(parseInt(Text, 10));
  };

  const handleDateChange = (event, name) => {
    const AddDate = new Date(event.target.value);
    const EditDate = TimeConverter(event.target.value,7);
    setFormData({ ...FormData, [name]: AddDate });
    if (Mode === "Edit") {
      setEditFormData({ ...EditFormData, [name]: EditDate });
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
              reportdate: TimeConverter(response.data.createAt,-7),
              occurrencedate: TimeConverter(response.data.occurrencedate,-7),
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
              reportdate: TimeConverter(response.data.createAt,-7),
              occurrencedate: TimeConverter(response.data.occurrencedate,-7),
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
                reportdate: TimeConverter(response.data.createAt,-7),
                occurrencedate: TimeConverter(response.data.occurrencedate,-7),
                aff: response.data.requestaff,
                faction: response.data.requestfac,
                dep: response.data.requestdep,
                // renew: response.data.description || null,
              }),
                setAccess(true);
            }
          } else {
            if (UserData.affiliation === response.data.requestaff) {
              setFormData({
                ...response.data,
                userreport: response.data.createby,
                reportdate: TimeConverter(response.data.createAt,-7),
                occurrencedate: TimeConverter(response.data.occurrencedate,-7),
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
    setFormData({ ...FormData, [columnname]: dataarray });
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
    setFormData({ ...FormData, [name]: data });
    if (Mode === "Edit") {
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
          reporttype: "0",
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

  const ClearData = () => {
    localStorage.removeItem("FormData");
    setFormData({
      userreport: UserData.userid,
      requestby:
        UserData?.title + " " + UserData?.name + " " + UserData?.lastname,
      reportdate: new Date(),
      occurrencedate: new Date(),
      type: "opd",
      reporttype: "0",
      aff: UserData.affiliation,
      faction: UserData.faction,
      dep: UserData.dep,
      createby: UserData.userid,
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

  const keysToCheck = ["prescribing", "dispensing", "administration"];
  // const keysToCheck = [];

  const handleSubmit = async (Mode) => {
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
    if(Mode!=="Draft"){
      setAlertBorder(missingKeys);
    };

    if (missingKeys.length === 0 || Mode==="Draft") {
      let submitFormData;
      if (totalLength > 0 || Mode==="Draft") {
        submitFormData = {
          ...FormData,
          prescribing: JSON.stringify(FormData.prescribing),
          dispensing: JSON.stringify(FormData.dispensing),
          administration: JSON.stringify(FormData.administration),
          rca: JSON.stringify(FormData.rca),
          effect: JSON.stringify(FormData.effect),
          drugrelate: JSON.stringify(FormData.drugrelate),
          occurrencedate:TimeConverter(FormData.occurrencedate,7),
          reportdate:TimeConverter(FormData.reportdate,7),
          formstatus:"0"
          // deptrelate: JSON.stringify(FormData.deptrelate),
        };

        // console.log("submitFormData", submitFormData);
        try {
          const response = await axios.post(
            `${apiUrl}/medication`,
            submitFormData,
            { ...config }
          );
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
        setAlertText("ไม่สามารถบันทึกข้อมูลได้ กรุณาเลือกอย่างน้อย 1 หัวข้อ");
        console.log("ไม่สามารถบันทึกข้อมูลได้ กรุณาเลือกอย่างน้อย 1 หัวข้อ");
        setAlert(true);
        scrollToSection("ListSelect");
      }
    } else {
      setStage(missingKeys[0].location);
      setAlertText(
        "ไม่สามารถบันทึกข้อมูลได้ โปรดระบุ '" + missingKeys[0].name + "'"
      );
      console.log(
        "Some keys are missing.Cannot submit form data.",
        missingKeys[0].key
      );
      setAlert(true);
      scrollToSection(missingKeys[0].key);
    }
  };

  const handleSubmitEdit = async (Mode) => {
    console.log("handleSubmitEdit",FormData);
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
    if(Mode!=="Draft"){
      setAlertBorder(missingKeys);
    };
    if (missingKeys.length === 0 || Mode==="Draft") {
      let submitEditFormData;
      if (totalLength > 0 || Mode==="Draft") {
    submitEditFormData = {
      ...EditFormData,
      prescribing: JSON.stringify(FormData.prescribing),
      dispensing: JSON.stringify(FormData.dispensing),
      administration: JSON.stringify(FormData.administration),
      rca: JSON.stringify(FormData.rca),
      effect: JSON.stringify(FormData.effect),
      drugrelate: JSON.stringify(FormData.drugrelate),
      updateby: UserData.userid,
      formstatus: FormData.formstatus,
    };
    if(Mode==="Draft"){
      submitEditFormData = {
        ...submitEditFormData,
        formstatus:"0"
      };
    }
    if(Mode==="Submit"){
      if(FormData.formstatus==="0"){
        submitEditFormData = {
          ...submitEditFormData,
          formstatus:"1"
        };
      }
    }
    // console.log("submitEditFormData", submitEditFormData);

    try {
      const response = await axios.put(
        `${apiUrl}/medication`,
        submitEditFormData,
        { ...config }
      );
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
    setAlertText("ไม่สามารถบันทึกข้อมูลได้ กรุณาเลือกอย่างน้อย 1 หัวข้อ");
    console.log("ไม่สามารถบันทึกข้อมูลได้ กรุณาเลือกอย่างน้อย 1 หัวข้อ");
    setAlert(true);
    scrollToSection("ListSelect");
  }
}else {
  setStage(missingKeys[0].location);
  setAlertText(
    "ไม่สามารถบันทึกข้อมูลได้ โปรดระบุ '" + missingKeys[0].name + "'"
  );
  console.log(
    "Some keys are missing.Cannot submit form data.",
    missingKeys[0].key
  );
  setAlert(true);
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
          {Mode === "Approve" && <span>วิเคราะห์รายการความคลาดเคลื่อนทางยา</span>}
          
          <span>
            {Mode === "Add" && (
              <Tooltip title="ล้างข้อมูลทั้งหมด">
                <IconButton aria-label="clear" onClick={ClearData}>
                  <CleaningServicesIcon />
                </IconButton>
              </Tooltip>
            )}
            {FormData && (Mode !== "Add") && <span style={{fontSize:"20px"}}>&nbsp;&nbsp;&nbsp;หมายเลขเอกสาร : {FormData.reportid}&nbsp;&nbsp;</span>}
          </span>
        </Box>

        {Access ? (
          <Box className="MainContainer">
            {Stage === 1 && (
              <>
                <GeneralInfo
                  Mode={Mode}
                  data={FormData}
                  setDataFunction={handleDataChange}
                  setSingleDataFunction={handleDataChangeSingle}
                  missingKeys={AlertBorder}
                />

                <Divider variant="middle" flexItem sx={{ m: 1 }} />
                <ReportLog
                  FormType="Med"
                  Mode={Mode}
                  data={FormData}
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
                  data={FormData}
                  setDataFunction={handleDataChange}
                  optionsdata={DataDict_Risk}
                  datacolumn={["ClinicalRisk", "ClinicalRisk"]}
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
                </Box>
                <ListSelectData
                  OccType={OccType}
                  data={FormData}
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
                      <option value={1}>
                        ความคลาดเคลื่อนในการสั่งใช้ยา – คัดลอกยา
                      </option>
                      <option value={2}>
                        ความคลาดเคลื่อนในการจัด – จ่ายยา
                      </option>
                      <option value={3}>ความคลาดเคลื่อนในการบริหารยา</option>
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
                        data={FormData}
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
                        data={FormData}
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
                        data={FormData}
                        optionsdata={DataDict_MedicationForm}
                        datacolumn="administration"
                        remark={true}
                        remarkno="4.3.99"
                        remarkcolumn="administrationremark"
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
                  data={FormData}
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
                  data={FormData}
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
                  data={FormData}
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
                data={FormData}
                setDataFunction={handleDataChange}
                setData={handleDataSingleChange}
                missingKeys={AlertBorder}
              />
            )}

            {Mode!=="Add" && isAdmin && Stage === 1 && (
              <ReportSugestionsMed
                OccType={OccType}
                Mode={Mode}
                data={FormData}
                setDataFunction={handleDataChange}
                missingKeys={AlertBorder}
              />
            )}

            {Mode!=="Add" && isAdmin && Stage === 1 && (
              <>
                <Divider variant="middle" flexItem sx={{ m: 1 }} />
                <Box className="TopicHeader">
                  สรุปผลการวิเคราะห์สาเหตุที่แท้จริง (RCA) ของความคลาดเคลื่อน
                </Box>
                <SelectBoxListRCA
                  Mode={Mode}
                  data={FormData}
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
          </Box>
        ) : (
          <Box className="MainContainer">
            <div className="AccessBox">
              {Mode === "Edit"
                ? "คุณไม่มีสิทธิในการแก้ไขนี้ ขออภัยในความไม่สะดวก"
                : "คุณไม่มีสิทธิในการเข้าถึงข้อมูลนี้ ขออภัยในความไม่สะดวก"}
            </div>
          </Box>
        )}
        <NavForm
          Mode={Mode}
          Data={FormData}
          Access={FormData.createby === UserData.userid || isAdmin}
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

import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { getCurrentDate } from "../Function";
import { TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import dayjs from "dayjs";
import GreenCircle from "./GreenCircle";
import IconButton from "@mui/material/IconButton";
import ReportLog from "./ReportLog";
import ReportLog2 from "./ReportLog2";
import AutoCompleteText from "./AutoCompleteDep";
import AutoCompleteText2 from "./AutoCompleteDepRecive";
import VerifiedIcon from '@mui/icons-material/Verified';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { Table, InputGroup } from "react-bootstrap";
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import { useNavigate } from "react-router-dom";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import Chip from "@mui/material/Chip";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import Tooltip from "@mui/material/Tooltip";
import Swal from "sweetalert2";
dayjs.extend(customParseFormat);
import { color } from "@mui/system";

const options = [
  "ไม่ระบุ",
  "PCT ศัลยกรรม",
  "PCT สูตินรีเวช-ปริกำเนิด",
  "PCT หัวใจและหลอดเลือด",
  "PCT อายุรกรรม 1",
  "PCT อายุรกรรม 2",
  "PCT หู คอ จมูก",
  "PCT อายุรกรรมทางเดินอาหาร",
  "PCT ตา",
  "PCT กุมารเวชกรรม",
  "PCT ฉุกเฉิน",
  "PCT Palliative Care Team",
];

const GeneralInfo = ({
  Mode,
  data,
  formData,
  array,
  manager,
  disable,
  time,
  setDataFunction,
  handleSetBoard,
  handleSetDate,
  setSingleDataFunction,
  missingKeys,
  handleSetPhone,
  handleSetTime,
  FormType,
  showUrgent,
  showAppeal,
  removePerson,
  handleSetName,
  setDataPerson,
  setChangeRecive,
  handleDateReceived,
  datereceived,
  handleDateChange,
  handleDataChangeCheckbox,
  handleDataChangeCheckbox2,
  handleDataChangeValue,
  depoptiondata,
  setCheckBoxFunction,
  handleSetPerson,
  handlePatientHn,
  handlePatientName,
  handlePatientAge,
  handlePatientAn,
  show,
    setErrors,
  errors,
  checked,
  setChecked,
  handleShow,
  setChangePerson,
  handlePatientDiagnosis,
  submitfunction,
  handleSubmitEdit,
  inputRefs,
}) => {
  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [tosentvalue, settosentvalue] = useState("select"); // select or textinput
  const [timePicker, setTimePicker] = useState(null); // dayjs
const navigate = useNavigate(); 
  useEffect(() => {
    if (data.pct) {
      if (options.includes(data.pct)) {
        settosentvalue("select");
        setValue(data.pct);
      } else {
        settosentvalue("textinput");
        setInputValue(data.pct);
      }
    }
  }, []);
  useEffect(() => {
    if (data?.time) {
      // ดึง "05:55" จาก ISO ตรง ๆ
      const hhmm = data.time.substring(11, 16);
      setTimePicker(dayjs(hhmm, "HH:mm"));
    } else {
      setTimePicker(null);
    }
  }, [data?.time]);
  return (
  <>
    <div className="section-main">
      {/* =========================
      PAGE HEADER
      ========================= */}
      <div className="page-header">
        <div className="page-header-left">
           <Tooltip title="ย้อนกลับ" arrow>
  <IconButton
    onClick={() => {
      Swal.fire({
        title: "ยืนยันการย้อนกลับ?",
        text: "ข้อมูลที่ยังไม่ได้บันทึกอาจสูญหาย",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#162865",
        cancelButtonColor: "#6B7280",
        confirmButtonText: "ย้อนกลับ",
        cancelButtonText: "ยกเลิก",
      }).then((result) => {
        if (result.isConfirmed) {
          if (window.history.length > 1) {
            navigate(-1);
          } else {
            navigate("/document");
          }
        }
      });
    }}
    className="back-btn-modern"
    aria-label="ย้อนกลับ"
  >
    <ArrowBackIcon fontSize="medium" />
  </IconButton>
</Tooltip>
          <div className="page-icon">
            <VerifiedIcon />
          </div>

          <div className="text-left">
            <h2>รับเอกสาร</h2>
            <p>ตรวจสอบข้อมูลเอกสารและยืนยันการรับเอกสาร</p>
          </div>
        </div>

      
      </div>

<div className="section-card read-only-preview-card">
  {/* HEADER */}
  <div className="section-header modern" style={{ marginBottom: "14px" }}>
    <span className="step-circle">1</span>

    <div className="text-left w-100">
      <h4 style={{ marginBottom: "4px" }}>ข้อมูลการส่งเอกสาร</h4>
      <p style={{ margin: 0, color: "#64748b" }}>
        ตรวจสอบข้อมูลจากต้นทาง (อ่านอย่างเดียว)
      </p>
    </div>

 
  </div>
   <Button
          className="draft-btn mb-2"
          onClick={handleShow}
        >
          {show ? "ซ่อนรายละเอียด" : "แสดงรายละเอียด"}
        </Button>
  {show && (
    <div
      style={{
        background: "linear-gradient(180deg, #f8fbff 0%, #f1f5f9 100%)",
        border: "1px solid #dbe7f3",
        borderRadius: "24px",
        padding: "24px",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.7)",
      }}
    >
      {/* TOP BADGE */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 14px",
          borderRadius: "999px",
          background: "#e0f2fe",
          color: "#0369a1",
          fontWeight: 700,
          fontSize: "14px",
          marginBottom: "18px",
        }}
      >
        👁 ข้อมูลสำหรับตรวจสอบ
      </div>

      {/* DOCUMENT GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: "16px",
          marginBottom: "22px",
        }}
      >
        <div className="read-info-box">
          <label>เลขที่เอกสาร</label>
          <div>{data.id_document || "-"}</div>
        </div>

        <div className="read-info-box">
          <label>วันที่ส่งเอกสาร</label>
          <div>{data.date_document || "-"}</div>
        </div>

        <div className="read-info-box" style={{ gridColumn: "span 2" }}>
          <label>รายการ (ชื่อเอกสาร)</label>
          <div>{data.program_document || "-"}</div>
        </div>

        <div className="read-info-box">
          <label>ผู้ส่งเอกสาร (แผนก)</label>
          <div>{data.dep_name_send || "-"}</div>
        </div>
      </div>

      {/* RECEIVER + PRIORITY */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
          gap: "16px",
        }}
      >
        {/* ผู้รับ */}
        <div className="read-summary-card">
          <div className="read-summary-label">ผู้รับเอกสาร</div>
          <div className="read-summary-value">
            👤 {data.faction || "-"}
          </div>
        </div>

        {/* ด่วน */}
        <div
          className={`read-summary-card ${
            data.urgent === "0" ? "urgent-card" : "normal-card"
          }`}
        >
          <div className="read-summary-label">ระดับความด่วน</div>
          <div className="read-summary-value">
            {data.urgent === "0" ? "⚡ ด่วน" : "◔ ปกติ"}
          </div>
        </div>
      </div>
    </div>
  )}
</div>

{/* =========================
SECTION 2 : รับเอกสาร (MODERN INPUT FLOW)
========================= */}
<div className="section-card receive-document-card">
  <div className="section-header modern">
    <span className="step-circle">2</span>

    <div
      style={{
        textAlign: "left",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
      }}
    >
      <h4 style={{ margin: 0, textAlign: "left", width: "100%" }}>
        ข้อมูลการรับเอกสาร
      </h4>

      <p
        style={{
          margin: "4px 0 0",
          textAlign: "left",
          width: "100%",
          color: "#6b7280",
        }}
      >
        กรุณากรอกข้อมูลให้ครบ 3 ขั้นตอน เพื่อยืนยันการรับเอกสาร
      </p>
    </div>
  </div>

  {/* FLOW GUIDE */}
 <div
  className="receive-progress-guide"
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center", // จัดทั้ง block ให้อยู่กลาง
    width: "100%",
    margin: "0 auto 28px auto",
    padding: "8px 0 18px",
  }}
>
  {/* STEP 1 */}
  <div
    className="receive-step active"
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minWidth: "90px",
      textAlign: "center",
    }}
  >
    <span
      style={{
        width: "42px",
        height: "42px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
        color: "#fff",
        fontWeight: 700,
        fontSize: "18px",
        boxShadow: "0 8px 18px rgba(37,99,235,0.22)",
      }}
    >
      1
    </span>

    <p
      style={{
        marginTop: "10px",
        fontSize: "14px",
        fontWeight: 600,
        color: "#1f2937",
        marginBottom: 0,
      }}
    >
      เลือกแผนกผู้รับเอกสาร
    </p>
  </div>

  {/* LINE */}
  <div
    className="receive-line"
    style={{
      width: "70px",
      height: "4px",
      borderRadius: "999px",
      background: "linear-gradient(90deg, #60a5fa, #2563eb)",
      margin: "0 10px",
    }}
  />

  {/* STEP 2 */}
  <div
    className="receive-step active"
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minWidth: "90px",
      textAlign: "center",
    }}
  >
    <span
      style={{
        width: "42px",
        height: "42px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
        color: "#fff",
        fontWeight: 700,
        fontSize: "18px",
        boxShadow: "0 8px 18px rgba(245,158,11,0.22)",
      }}
    >
      2
    </span>

    <p
      style={{
        marginTop: "10px",
        fontSize: "14px",
        fontWeight: 600,
        color: "#1f2937",
        marginBottom: 0,
      }}
    >
      วันที่รับเอกสาร

    </p>
  </div>

  {/* LINE */}
  <div
    className="receive-line"
    style={{
      width: "70px",
      height: "4px",
      borderRadius: "999px",
      background: "linear-gradient(90deg, #fbbf24, #f59e0b)",
      margin: "0 10px",
    }}
  />

  {/* STEP 3 */}
  <div
    className="receive-step active"
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minWidth: "90px",
      textAlign: "center",
    }}
  >
    <span
      style={{
        width: "42px",
        height: "42px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
        color: "#fff",
        fontWeight: 700,
        fontSize: "18px",
        boxShadow: "0 8px 18px rgba(34,197,94,0.22)",
      }}
    >
      3
    </span>

    <p
      style={{
        marginTop: "10px",
        fontSize: "14px",
        fontWeight: 600,
        color: "#1f2937",
        marginBottom: 0,
      }}
    >
      ยืนยันสถานะการรับ
    </p>
  </div>
</div>

  {/* =========================
  FIELD 1
  ========================= */}
  <div className="receive-input-block">
    <label className="receive-input-label">
      <span className="receive-number">1</span>
      ผู้รับเอกสาร (แผนก)
    </label>

    <div className="receive-input-body">
      <AutoCompleteText2
        required
        Mode={Mode}
        data={data}
        item={null}
        name="department"
        datacolumn="deptrelate"
        datacolumn2="deptemail"
        setChangePerson={setChangeRecive}
       
      />
      
    </div>
    <div name="department"  ref={(el) => (inputRefs.current.department = el)}></div>
          {errors.department && (
            <Form.Control.Feedback
              type="invalid"
              style={{ display: "flex", alignItems: "center", gap: 4 }}
            >
              <ErrorOutlineIcon fontSize="small" />
              กรุณาเลือกการดำเนินการเร่งด่วน
            </Form.Control.Feedback>
          )}
  </div>

  {/* =========================
  FIELD 2
  ========================= */}
  <div className="receive-input-block">
    <label className="receive-input-label">
      <span className="receive-number">2</span>
      วันที่รับเอกสาร
    </label>

    <div className="receive-input-body">
      <Form.Control
        type="date"
        value={datereceived || ""}
        onChange={handleDateReceived}
        className="modern-input"
        style={{
          maxWidth: "380px",
          width: "100%",
          textAlign: "left",
        }}
        ref={(el) => (inputRefs.current.date = el)}
      />
    </div>
      {errors.date && (
            <Form.Control.Feedback
              type="invalid"
              style={{ display: "flex", alignItems: "center", gap: 4 }}
            >
              <ErrorOutlineIcon fontSize="small" />
              กรุณาเลือกการดำเนินการเร่งด่วน
            </Form.Control.Feedback>
          )}
  </div>

  {/* =========================
  FIELD 3
  ========================= */}
  <div className="receive-input-block">
    <label className="receive-input-label">
      <span className="receive-number">3</span>
      สถานะการรับ
    </label>

    <div className="receive-input-body">
      <button
        name="check"
        type="button"
        onClick={() => {
          const newValue = !checked;
          setChecked(newValue);
          handleDataChangeValue(newValue, "dateChecked");
        }}
           ref={(el) => (inputRefs.current.checked = el)}
        className={`receive-confirm-card ${checked ? "checked" : ""}`}
      >
        {/* Icon */}
        <div className="receive-confirm-icon">✔</div>

        {/* Text */}
        <div className="receive-confirm-text">
          <div className="receive-confirm-title">
            {checked ? "รับเอกสารเรียบร้อยแล้ว" : "กดเพื่อยืนยันการรับเอกสาร"}
          </div>

          <div className="receive-confirm-subtitle">
            ระบบจะบันทึกสถานะเมื่อกดยืนยัน
          </div>
        </div>
      </button>
     
    </div>
    {errors.checked && (
            <Form.Control.Feedback
              type="invalid"
              style={{ display: "flex", alignItems: "center", gap: 4 }}
            >
              <ErrorOutlineIcon fontSize="small" />
              กรุณาเลือกการดำเนินการเร่งด่วน
            </Form.Control.Feedback>
          )}
  </div>

      </div>
      <div className="bottom-action-bar">
 
      {Mode=='Edit' ? <>
        <Button
    className="edit-doc-btn"
    onClick={handleSubmitEdit}
  >
    <VerifiedIcon />
    แก้ไขข้อมูล
  </Button>

      </>
      
    : <>  <Button
    className="submit-doc-btn"
    onClick={submitfunction}
  >
    <VerifiedIcon />
    บันทึกข้อมูล
  </Button>
</>} </div>
    </div>
  </>
);
};

export default GeneralInfo;

import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { getCurrentDate } from "../Function";
import { TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import dayjs from "dayjs";
import GreenCircle from "./GreenCircle";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";
import ReportLog from "./ReportLog";
import ReportLog2 from "./ReportLog2";
import AutoCompleteText from "./AutoCompleteDep";
import AutoCompleteText2 from "./AutoCompleteDepRecive";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { Table, InputGroup } from "react-bootstrap";
import Swal from "sweetalert2";
import Tooltip from "@mui/material/Tooltip";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import IconButton from "@mui/material/IconButton";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
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
  checked,
  recive,
  setChecked,
  handleDateChange,
  handleDataChangeCheckbox,
  handleDataChangeCheckbox2,
  depoptiondata,
  setCheckBoxFunction,
  handleDataChangeValue,
  handleSetPerson,
  handlePatientHn,
  handlePatientName,
  handlePatientAge,
  handlePatientAn,
  setChangePerson,
  handleSubmitEdit,
  submitfunction,
  handlePatientDiagnosis,
  setErrors,
  errors,
  inputRefs,
  ClearData,
}) => {
  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [tosentvalue, settosentvalue] = useState("select"); // select or textinput
const navigate = useNavigate(); 
  const [timePicker, setTimePicker] = useState(null); // dayjs
  useEffect(() => {
    // เพิ่มเงื่อนไขเช็ค array.length === 0
    if (Mode !== "Edit" && Mode !== "Show" && array && array.length === 0) {
      handleSetPerson();
    }
  }, [array, Mode]);
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
      {/* =========================
   APPLE + HOSPITAL ENTERPRISE UI STRUCTURE
   เปลี่ยนเฉพาะส่วน GeneralInfo JSX
========================= */}
      <div className="section-main">
        <div className="page-header ">
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
              {/* เปลี่ยนจาก class เป็น className */}
              <ForwardToInboxIcon />
            </div>
            <div className="text-left">
              <h2>ส่งเอกสาร</h2>
              <p>กรอกข้อมูลสำหรับการส่งเอกสาร</p>
            </div>
          </div>

          {Mode === "Add" && (
            <Tooltip title="ล้างข้อมูลทั้งหมด">
              <IconButton
                size="small"
                onClick={ClearData}
                sx={{
                  color: "#6B7280",
                  "&:hover": {
                    color: "#EF4444",
                    backgroundColor: "#FEE2E2",
                  },
                }}
              >
                <CleaningServicesIcon />
              </IconButton>
            </Tooltip>
          )}
        </div>

        {/* =========================
   SECTION 1
========================= */}
        <div className="section-card">
          <div className="section-header modern">
            <span className="step-circle">1</span>
            <div className="text-left">
              <h4>รายการเอกสาร</h4>
            </div>
          </div>

          <div className="section-action">
            <Button
              onClick={handleSetPerson}
              hidden={Mode === "Edit"}
              className="add-doc-btn"
            >
              <ControlPointIcon />
              &nbsp; เพิ่มเอกสาร
            </Button>
          </div>

          <Table
            responsive
            className="modern-table"
            ref={(el) => (inputRefs.current.document = el)}
          >
            <thead>
              <tr>
                <th>#</th>
                <th width="15%">เลขที่เอกสาร</th>
                <th width="15%">วันที่ส่งเอกสาร</th>
                <th width="40%">รายการ(ชื่อเอกสาร)</th>
                <th width="25%">แผนก</th>
                <th width="5%" hidden={Mode === "Edit"}>
                  ลบ
                </th>
              </tr>
            </thead>

            <tbody>
              {array.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>

                  <td>
                    <Form.Control
                      type="text"
                      name="id_document"
                      value={item.id_document || ""}
               
                      
                          onChange={(e) => {
              setErrors((prev) => ({ ...prev, document: false }));
              setDataPerson(e, index + 1);
            }}
                      className="modern-input"
                    />
                  </td>

                  <td>
                    <Form.Control
                      type="date"
                      name="date_document"
                      value={item.date_document || ""}
                 
                      
                          onChange={(e) => {
              setErrors((prev) => ({ ...prev, document: false }));
              setDataPerson(e, index + 1);
            }}
                      className="modern-input"
                    />
                  </td>

                  <td>
                    <Form.Control
                      type="text"
                      name="program_document"
                      value={item.program_document || ""}
                    
                          onChange={(e) => {
              setErrors((prev) => ({ ...prev, document: false }));
              setDataPerson(e, index + 1);
            }}
                      className="modern-input"
                    />
                  </td>

                  <td>
                    <AutoCompleteText
                      required
                      Mode={Mode}
                      data={data}
                      item={item}
                      name="department"
                      datacolumn="deptrelate"
                      datacolumn2="deptemail"
                      setChangePerson={setChangePerson}
                      index={index + 1}
                    />
                  </td>

                  <td hidden={Mode === "Edit"}>
                    <Button
                      className="delete-btn"
                      onClick={() => removePerson(item.id)}
                    >
                      <DeleteForeverIcon />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {errors.document && (
            <Form.Control.Feedback
              type="invalid"
              style={{ display: "flex", alignItems: "center", gap: 4 }}
            >
              <ErrorOutlineIcon fontSize="small" />
              กรุณาเขียนรายการเอกสาร ให้ครบทุกช่อง
            </Form.Control.Feedback>
          )}
        </div>

        {/* =========================
   SECTION 2
========================= */}
        <div className="section-card">
          <div className="section-header modern">
            <span className="step-circle">2</span>
            <div className="text-left">
              <h4>ผู้รับเอกสาร</h4>
              <p>เลือกผู้รับปลายทาง</p>
            </div>
          </div>

          <RadioGroup
            row
            name="faction"
            value={data.faction || ""}
                     onChange={(e) => {
              setErrors((prev) => ({ ...prev, faction: false }));
              setDataFunction(e, "faction");
            }}
            className="card-radio-group"
            ref={(el) => (inputRefs.current.faction = el)}
          >
            {["อ.ประภัทร", "อ.พิชัย", "คุณนุช", "คุณมาลี", "Landmark"].map(
              (person) => (
                <FormControlLabel
                  key={person}
                  value={person}
                  disabled={Mode === "Show"}
                  control={<Radio />}
                  label={person}
                  className="radio-card"
                />
              ),
            )}
          </RadioGroup>
          {errors.faction && (
            <Form.Control.Feedback
              type="invalid"
              style={{ display: "flex", alignItems: "center", gap: 4 }}
            >
              <ErrorOutlineIcon fontSize="small" />
              กรุณาเลือกผู้รับเอกสาร
            </Form.Control.Feedback>
          )}
        </div>

        {/* =========================
   SECTION 3
========================= */}
        <div className="section-card">
          <div className="section-header modern">
            <span className="step-circle">3</span>
            <div className="text-left">
              <h4>ระดับความด่วน</h4>
              <p>เลือกความเร่งด่วนในการดำเนินการ</p>
            </div>
          </div>

          {/* =========================================
PRIORITY CARD RADIO UI
Apple / Hospital / Enterprise Style
========================================= */}

          <RadioGroup
            row
            name="urgent"
            value={data.urgent || ""}
            onChange={(e) => {
              setErrors((prev) => ({ ...prev, urgent: false }));
              setDataFunction(e, "urgent");
            }}
            className="priority-modern-group"
            ref={(el) => (inputRefs.current.urgent = el)}
          >
            {/* ด่วน */}
            <label
              className={`priority-modern-card urgent ${data.urgent === "0" ? "active" : ""}`}
            >
              <input
                type="radio"
                value="0"
                checked={data.urgent === "0"}
               onChange={(e) => {
              setErrors((prev) => ({ ...prev, urgent: false }));
              setDataFunction(e, "urgent");
            }}
              />

              <div className="priority-left">
                <div className="priority-icon urgent-icon">⚡</div>

                <div className="priority-text">
                  <h4>ด่วน</h4>
                  <p>ต้องการดำเนินการเร่งด่วน</p>
                </div>
              </div>

              <div className="custom-radio" />
            </label>

            {/* ปกติ */}
            <label
              className={`priority-modern-card normal ${data.urgent === "1" ? "active" : ""}`}
            >
              <input
                type="radio"
                value="1"
                checked={data.urgent === "1"}
               onChange={(e) => {
              setErrors((prev) => ({ ...prev, urgent: false }));
              setDataFunction(e, "urgent");
            }}
              />

              <div className="priority-left">
                <div className="priority-icon normal-icon">◔</div>

                <div className="priority-text">
                  <h4>ปกติ</h4>
                  <p>ดำเนินการตามลำดับปกติ</p>
                </div>
              </div>

              <div className="custom-radio" />
            </label>
          </RadioGroup>
          {errors.urgent && (
            <Form.Control.Feedback
              type="invalid"
              style={{ display: "flex", alignItems: "center", gap: 4 }}
            >
              <ErrorOutlineIcon fontSize="small" />
              กรุณาเลือกการดำเนินการเร่งด่วน
            </Form.Control.Feedback>
          )}
        </div>
<div className="section-card receive-document-card">
  <div className="section-header modern">
    <span className="step-circle">4</span>

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
        {/* =========================================
BOTTOM ACTION BUTTONS
========================================= */}
        <div className="bottom-action-bar">
          {Mode == "Edit" ? (
            <>
              <Button className="edit-doc-btn" onClick={handleSubmitEdit}>
                <ForwardToInboxIcon />
                แก้ไขเอกสาร
              </Button>
            </>
          ) : (
            <>
              {" "}
              <Button className="submit-doc-btn" onClick={submitfunction}>
                <ForwardToInboxIcon />
                ส่งเอกสาร
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default GeneralInfo;

import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { getCurrentDate } from "../Function";
import { TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import GreenCircle from "./GreenCircle";

import ReportLog from "./ReportLog";
import ReportLog2 from "./ReportLog2";
import AutoCompleteText from "./AutoCompleteDep";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { Table } from "react-bootstrap";

import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import { TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
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
  disable,
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
  handleDateChange,
  handleDataChangeCheckbox,
  handleDataChangeCheckbox2,
  depoptiondata,
  setCheckBoxFunction,
  handleSetPerson,
  handlePatientHn,
  handlePatientName,
  handlePatientAge,
  handlePatientAn,
  setChangePerson,
  handlePatientDiagnosis,
    setErrors,
                errors,
                inputRefs,
}) => {
  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [tosentvalue, settosentvalue] = useState("select"); // select or textinput

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

  return (
    <>
    <div className="section-card">
    <div className="section-header">
    <GreenCircle />ตอบกลับผู้ร้องเรียน</div>
  <div className="section-body">
    <Container>
      <Row className="align-items-center">
        <RadioGroup
          row
          id="respond_radio"
          name="respond_radio"
          value={data?.respond_radio || "0"}
          onChange={(e) => setDataFunction(e, "respond_radio")}
        >
          <FormControlLabel
            disabled={Mode === "Show"}
            value="0"
            control={<Radio />}
            label="ตอบกลับผู้ร้องเรียนแล้ว"
          />

          <FormControlLabel
            disabled={Mode === "Show"}
            value="1"
            control={<Radio />}
            label="ยังไม่ได้ตอบกลับผู้ร้องเรียน (ระบุสาเหตุ) : "
          />

          <Form.Control
            disabled={disable || data?.respond_radio !== "1"}
            value={data?.respond_text || ""}
            onChange={(e) => setDataFunction(e, "respond_text")}
            style={{ height: "40px", marginLeft: "12px", width: "260px" }}
             className="custom-input"
          />
          
        </RadioGroup>
      </Row>
    </Container>
  </div>
</div>
    
    <div className="section-card">
    <div className="section-header">
    <GreenCircle />
              <span>สรุปประเด็นร้องเรียน</span>
  <span className="required-badge">จำเป็น</span>
    </div>
  <div className="section-body">
    <Container>
      <Row>
        <div
          className={
            missingKeys.some((item) => item.key === "summarize")
              ? "AreaBOX SETERRORBOX"
              : "AreaBOX"
          }
        >
          <TextField
            id="summary_reply"
            disabled={Mode === "Show"}
            label="เขียนรายละเอียด"
            value={data?.summary_reply || ""}
                 ref={(el) => (inputRefs.current.summary_reply= el)}
                onChange={(e) => {
      setErrors((prev) => ({ ...prev, summary_reply: false }));

      setDataFunction(e, "summary_reply");
    }}
            multiline
            rows={4}
            variant="standard"

            fullWidth
                 style={{
      borderColor: errors.summary_reply ? "#dc3545" : "",
      boxShadow: errors.summary_reply ? "0 0 0 0.2rem rgba(220,53,69,.25)" : "",
      boxShadow: errors.summary_reply ? "0 0 0 0.2rem rgba(220,53,69,.25)" : "",
    }}
          />
        </div>
          {(errors.summary_reply ) && (
            <Form.Control.Feedback
              type="invalid"
              style={{ display: "flex", alignItems: "center", gap: 4 }}
            >
        <ErrorOutlineIcon fontSize="small" />
              กรุณาเขียนรายละเอียด
            </Form.Control.Feedback>
          )}
      </Row>
    </Container>
  </div>
</div>

<div className="section-card">
    <div className="section-header">
    <GreenCircle />
      <span>ผลการวิเคราะห์สาเหตุ</span>
  <span className="required-badge">จำเป็น</span>
    </div>
  <div className="section-body">
    <Container>
      <Row>
        <div
          className={
            missingKeys.some((item) => item.key === "expectation")
              ? "AreaBOX SETERRORBOX"
              : "AreaBOX"
          }
        >
          <TextField
            id="summary_analysis"
            disabled={Mode === "Show"}
            label="เขียนรายละเอียด"
                ref={(el) => (inputRefs.current.summary_analysis= el)}
            value={data?.summary_analysis || ""}
              onChange={(e) => {
      setErrors((prev) => ({ ...prev, summary_analysis: false }));

      setDataFunction(e, "summary_analysis");
    }}
              variant="standard"
            multiline
            rows={4}
            fullWidth
             style={{
      borderColor: errors.summary_analysis ? "#dc3545" : "",
      boxShadow: errors.summary_analysis ? "0 0 0 0.2rem rgba(220,53,69,.25)" : "",
      boxShadow: errors.summary_analysis ? "0 0 0 0.2rem rgba(220,53,69,.25)" : "",
    }}
          />
        </div>
         {(errors.summary_analysis ) && (
            <Form.Control.Feedback
              type="invalid"
              style={{ display: "flex", alignItems: "center", gap: 4 }}
            >
        <ErrorOutlineIcon fontSize="small" />
              กรุณาเขียนรายละเอียด
            </Form.Control.Feedback>
          )}
      </Row>
    </Container>
  </div>
</div>
     <div className="section-card">
    <div className="section-header">
    <GreenCircle />
          <span>แนวทางการแก้ไข/ป้องกันปัญหาในเชิงระบบ</span>
  <span className="required-badge">จำเป็น</span>
    </div>
    
  <div className="section-body">
    <Container>
      <Row>
        <div
          className={
            missingKeys.some((item) => item.key === "decision")
              ? "AreaBOX SETERRORBOX"
              : "AreaBOX"
          }
        >
          <TextField
            id="summary_solving"
            disabled={Mode === "Show"}
            label="เขียนรายละเอียด"
                         ref={(el) => (inputRefs.current.summary_solving= el)}
            value={data?.summary_solving || ""}
              onChange={(e) => {
      setErrors((prev) => ({ ...prev, summary_solving: false }));

      setDataFunction(e, "summary_solving");
    }}
             variant="standard"
            multiline
            rows={4}
            fullWidth
                style={{
      borderColor: errors.summary_solving ? "#dc3545" : "",
      boxShadow: errors.summary_solving ? "0 0 0 0.2rem rgba(220,53,69,.25)" : "",
      boxShadow: errors.summary_solving ? "0 0 0 0.2rem rgba(220,53,69,.25)" : "",
    }}
          />
        </div>
          {(errors.summary_solving ) && (
            <Form.Control.Feedback
              type="invalid"
              style={{ display: "flex", alignItems: "center", gap: 4 }}
            >
        <ErrorOutlineIcon fontSize="small" />
              กรุณาเขียนรายละเอียด
            </Form.Control.Feedback>
          )}
      </Row>
    </Container>
  </div>
</div>

    </>
  );
};

export default GeneralInfo;

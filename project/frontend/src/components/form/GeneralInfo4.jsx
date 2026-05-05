import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { getCurrentDate } from "../Function";
import { TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import GreenCircle from "./GreenCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ReportLog from "./ReportLog";
import ReportLog2 from "./ReportLog2";
import AutoCompleteText from "./AutoCompleteDep";

import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { Table,InputGroup } from "react-bootstrap";

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
  isVisible,
  isVisible2,
  checkbox,
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
    const respond_Cause = checkbox.respond_Cause;

  const causeList = [
    { value: "1", label: "การสื่อสาร/ให้ข้อมูลไม่ชัดเจน ไม่เพียงพอ" },
    { value: "2", label: "ไม่สื่อสาร/ไม่ให้ข้อมูล" },
    { value: "3", label: "ขาดการตรวจสอบ/ทวนซ้ำ" },
    { value: "4", label: "ขาดการประสานงาน/ติดตาม" },
    { value: "5", label: "ขาดความรู้ ความชำนาญด้านวิชาชีพ" },
    { value: "6", label: "ขาดความชำนาญด้านภาษา" },
    { value: "7", label: "ขาดความเอาใจใส่ ดูแล" },
    { value: "8", label: "ละเมิดสิทธิ์ผู้ป่วย/ผิดจริยธรรม" },
    { value: "9", label: "ขาดการตรวจสอบข้อมูลก่อนให้บริการ" },
    { value: "10", label: "ไม่ปฏิบัติตามนโยบาย /SP/WI ที่กำหนดใว้" },
    { value: "11", label: "ไม่ปฏิบัตืตามมาตรฐานวิชาชีพ" },
    { value: "12", label: "ข้อมูลเพื่อการสื่อสาร ไม่ละเอียด ชัดเจน" },
    { value: "13", label: "ระบบงานไม่ชัดเจน" },
    { value: "14", label: "อัตรากำลังไม่สอดคล้องกับภาระงาน" },
    { value: "15", label: "เป็นระบบงานของ รพ./หน่วยงาน" },
    { value: "16", label: "เครื่องมือไม่พร้อมใช้งาน ขาดการตรวจสอบซ่อมบำรุง" },
    { value: "17", label: "ปัญหาจากโครงสร้างอาคาร/สถานที่ให้บริการ/สิ่งแวดล้อม" },
    { value: "18", label: "เป็นเหตุสุดวิสัย" },
    { value: "19", label: "การให้บริการล่าช้า" },
  ];

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
        <div className="section-header" style={{ textAlign: "left", width: "100%" }}>
           <GreenCircle />1. ประเด็นร้องเรียน&nbsp;
          <u>
            <b>ไม่เป็นจริง</b>
          </u>
          &nbsp;ตามที่ผู้ใช้บริการร้องเรียน / เป็นเรื่องที่ผ่านมาแล้วในอดีต
        </div>

        <div className="section-body">
          <Container>
            <RadioGroup
              id="respond_Untrue"
              name="respond_Untrue"
              value={data?.respond_Untrue || "0"}
              onChange={(e) => setDataFunction(e, "respond_Untrue")}
            >
              <FormControlLabel
                sx={{ my: 1 }}
                disabled={Mode === "Show"}
                value="0"
                control={<Radio />}
                label="ประเด็นร้องเรียนไม่มีมูลความจริงตามที่ร้องเรียน"
              />

              <FormControlLabel
                sx={{ my: 1 }}
                disabled={Mode === "Show"}
                value="1"
                control={<Radio />}
                label="ความเข้าใจของผู้ใช้บริการผิดพลาด / คลาดเคลื่อน"
              />

              <FormControlLabel
                sx={{ my: 1 }}
                disabled={Mode === "Show"}
                value="2"
                control={<Radio />}
                label="ประเด็นร้องเรียนเป็นข้อร้องเรียนที่ผ่านมาแล้วในอดีต (เกิน 1 เดือนขึ้นไป นับจากการร้องเรียนในครั้งนี้)"
              />
            </RadioGroup>
          </Container>
        </div>
      </div>

      <div className="section-card">
        <div className="section-header" style={{ textAlign: "left", width: "100%" }}>
          <GreenCircle />2. ประเด็นร้องเรียน&nbsp;
          <u>
            <b>เป็นจริง</b>
          </u>
          &nbsp;ตามที่ผู้ใช้บริการร้องเรียน&nbsp;
          <u>
            <b>แต่สามารถป้องกันได้/แก้ไข</b>
          </u>
        </div>

        <div className="section-body">
          <Container>
            <RadioGroup
              name="respond_True"
              value={data?.respond_True || "0"}
              onChange={(e) => setDataFunction(e, "respond_True")}
            >
              <Row className="align-items-center mb-3">
                <Col xs="auto">
                  <FormControlLabel
                    value="0"
                    control={<Radio />}
                    label="ประเด็นร้องเรียนเป็นนโยบายของโรงพยาบาล ให้ศูนย์พัฒนาคุณภาพ
                    ประสานงานทีมนำพัฒนาคุณภาพตัดสินใจดำเนินการ"
                  />
                </Col>
              </Row>

              <Row className="align-items-center mb-3">
                {/* Radio */}
                <Col xs="auto">
                  <FormControlLabel
                    value="1"
                    control={<Radio />}
                    label="ประเด็นร้องเรียนที่คณะกรรมการ"
                    
                  />
                </Col>

                {/* Input */}
                <Col md={3}>
                  <Form.Control
                    size="sm"
                     disabled={data?.respond_True !== "1"}
                    placeholder="ชื่อคณะกรรมการ"
                      value={data?.respond_Committee || ""}
                        style={{ height: 40}}
                    onChange={(e) => setDataFunction(e, "respond_Committee")}
                      className="custom-input"
                  />
                </Col>

                {/* Text */}
                <Col >
                  <span className="">
                    ต้องดำเนินการ ให้ศูนย์พัฒนาคุณภาพประสานงานคณะกรรมการที่เกี่ยวข้อง เพื่อดำเนินการแก้ไข
                  </span>
                </Col>
              </Row>
              <Row className="align-items-center">
                <Col xs="auto">
                  <FormControlLabel
                    value="2"
                    control={<Radio />}
                    label="ประเด็นร้องเรียนเป็นจริงตามที่ผู้ใช้บริการร้องเรียน เนื่องจากสาเหตุ"
                  />
                </Col>
              </Row>
              <div className="p-1">
                  <RadioGroup
                    name="respond_Cause"
                    value={data?.respond_Cause || ""}
                    onChange={(e) => setCheckBoxFunction(e, "respond_Cause")}
                    sx={{
                      alignItems: "flex-start", // 🔥 ชิดซ้าย
                    }}
                  >
                    <div className="border rounded p-3">
                      <Row className="">
                        <FormControlLabel
                          value="0"
                          control={<Checkbox 
                            name="0"
                                   checked={
                                respond_Cause.includes('0')}
                      onChange={(e) => setCheckBoxFunction(e, "respond_Cause")}/>}
                          label={<>พฤติกรรมการให้บริการไม่เหมาะสม</>}
                        />

                        {/* รายละเอียด */}
                          <div className="mt-2  ">
                            <div className="border p-3">
                              <Row className=" g-2 align-items-center ">
                                <Col md={3} className="text-end">
                                  ระบุชื่อ - สกุลเจ้าหน้าที่่
                                </Col>
                                <Col md={4}>
                                   <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-person-circle"></i>
                    </InputGroup.Text>
                   <Form.Control
                   style={{ height: 40}}
                                    placeholder=""
                                    value={data?.respond_NameSurname || ""}
                                    onChange={(e) =>
                                      setDataFunction(e, "respond_NameSurname")
                                    }
                                     className="custom-input"
                                  />
                  </InputGroup>
                                 
                                </Col>

                                <Col md={2} className="text-end">
                                  รหัสพนักงาน
                                </Col>

                                <Col md={3}>
                                  <Form.Control
                                  style={{ height: 40}}
                                  value={data?.respond_Id || ""}
                                    onChange={(e) =>
                                      setDataFunction(e, "respond_Id")
                                    }
                                     className="custom-input"
                                  />
                                </Col>
                              </Row>

                              {/* คำอธิบาย */}
                              <div className="mt-3 p-3 bg-light rounded">
                                เพื่อความสะดวกในการตรวจสอบข้อมูลย้อนหลัง
                                ขอให้ระบุชื่อ-นามสกุล และรหัสประจำตัวของเจ้าหน้าที่่ที่ถูกร้องเรียนให้ชัดเจน
                              </div>

                              {/* การดำเนินการ */}
                              <Row className="mt-4">
                                <Col md={3}>
                                  <strong>การดำเนินการ : </strong>
                                </Col>
                                <Col md={9}>
                                  <RadioGroup
                                    row
                                    value={data?.respond_Operation || ""}
                                    onChange={(e) =>
                                      setDataFunction(e, "respond_Operation")
                                    }
                                    sx={{
                                      alignItems: "flex-start", // 🔥 ชิดซ้าย
                                    }}
                                  >
                                    <FormControlLabel
                                      value="0"
                                      control={<Radio />}
                                      label="ตักเตือนด้วยวาจา ครั้งที่ 1"
                                    />
                                    <FormControlLabel
                                      value="1"
                                      control={<Radio />}
                                      label="ตักเตือนด้วยวาจา ครั้งที่ 2"
                                    />
                                    <FormControlLabel
                                      value="2"
                                      control={<Radio />}
                                      label="ตักเตือนด้วยวาจา ครั้งที่ 3"
                                    />
                                    <FormControlLabel
                                      value="3"
                                      control={<Radio />}
                                      label="ตักเตือนเป็นลายลักษณ์อักษร ครั้งที่ 1"
                                    />
                                    <FormControlLabel
                                      value="4"
                                      control={<Radio />}
                                      label="ตักเตือนเป็นลายลักษณ์อักษร ครั้งที่ 2"
                                    />
                                  </RadioGroup>
                                </Col>
                              </Row>

                              {/* สถานะ */}
                              <Row className="mt-3">
                                <Col md={3}>
                                  <strong>บันทึกการรับทราบการตักเตือน : </strong>
                                </Col>
                                <Col md={9}>
                                  <RadioGroup
                                    row
                                    value={data?.respond_Warn || ""}
                                    onChange={(e) =>
                                      setDataFunction(e, "respond_Warn")
                                    }
                                  >
                                    <div>
                                      <FormControlLabel
                                        value="0"
                                        control={<Radio />}
                                        label="ไม่ยอมรับการตักเตือน"
                                      />
                                    </div>

                                    <div>
                                      <FormControlLabel
                                        value="1"
                                        control={<Radio />}
                                        label="ยอมรับการตักเตือน (ลงนามผู้ถูกตักเตือน)"
                                      />
 <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-person-circle"></i>
                    </InputGroup.Text>
                 <Form.Control
                 
                                        className="custom-input"
                                        placeholder="ลงนามผู้ถูกตักเตือน"
                                        value={data?.cautioned || ""}
                                        onChange={(e) =>
                                          setDataFunction(
                                            e,
                                            "cautioned",
                                          )
                                        }
                                        style={{ height: 40,maxWidth: "300px" }}
                                     
                                      />
                  </InputGroup>
                                     
                                    </div>
                                  </RadioGroup>
                                </Col>
                              </Row>
                            </div>
                          </div>
                        {causeList.map((item) => (
                          <Col
                            md={6}
                            key={item.value}
                            className="d-flex my-2 justify-content-start"
                          >
                            <FormControlLabel
                              value={item.value}
                              control={<Checkbox  name={item.value}
                              checked={
                                respond_Cause.includes(item.value)}
                      onChange={(e) => setCheckBoxFunction(e, "respond_Cause")}/>}
                              label={item.label}
                              sx={{
                                width: "100%", // 🔥 บังคับกินเต็ม col
                                justifyContent: "flex-start",
                              }}
                            />
                          </Col>
                        ))}
                        <Col md={6} className="d-flex align-items-center">
                          <FormControlLabel
                            value="20"
                            
                            control={<Checkbox  name="20"
                              checked={
                                respond_Cause.includes("20")}
                      onChange={(e) => setCheckBoxFunction(e, "respond_Cause")}/>}
                            label="อื่นๆ (ระบุ)"
                      
                      />

                          <Form.Control
                          disabled={!respond_Cause.includes("20")}
                            className=" custom-input"
                             value={data?.respond_CauseOther || ""}
                            onChange={(e) => setDataFunction(e, "respond_CauseOther")}
                            style={{ height: 40,maxWidth: "200px" }}
                          />
                        </Col>
                      </Row>
                    </div>
                  </RadioGroup>
              </div>
            </RadioGroup>
          </Container>
        </div>
      </div>
      <div className="section-card">
        <div className="section-header " style={{ textAlign: "left", width: "100%" }}>
           <GreenCircle />3. ประเด็นร้องเรียน&nbsp;
          <u>
            <b>เป็นจริง</b>
          </u>
          &nbsp;ตามที่ผู้ใช้บริการร้องเรียน&nbsp;
          <u>
            <b>แต่ไม่สามารถป้องกัน/แก้ไขได้ในระยะสั้น</b>
          </u>
        </div>

        <div className="section-body">
          <Container>
            <RadioGroup
              id="respond_Complaint"
              name="respond_Complaint"
              value={data?.respond_Complaint || "0"}
              onChange={(e) => setDataFunction(e, "respond_Complaint")}
            >
              <FormControlLabel
                sx={{ my: 1 }}
                disabled={Mode === "Show"}
                value="0"
                control={<Radio />}
                label="ประเด็นข้อร้องเรียนเกินความสามารถของโรงพยาบาล ที่จะดําเนินการให้ได้"
              />

              <FormControlLabel
                sx={{ my: 1 }}
                disabled={Mode === "Show"}
                value="1"
                control={<Radio />}
                label="เหตุสุดวิสัย เช่น เกิดการระบาดของโรค มีจํานวนผู้ใช้บริการมากกว่าปกติ แพทย์ลาฉุกเฉิน (ไม่สามารถหาแพทย์ทดแทนได้ทัน) เป็นต้น"
              />

              <FormControlLabel
                sx={{ my: 1 }}
                disabled={Mode === "Show"}
                value="2"
                control={<Radio />}
                label="เป็นไปตามขั้นตอนการให้บริการ (On process)"
              />
             <FormControlLabel
  disabled={Mode === "Show"}
  value="4"
  control={<Radio />}
     style={{ height: 40}}
  sx={{
    alignItems: "center", // 👈 แก้ตรงนี้
    my: 1,
    "& .MuiFormControlLabel-label": {
      display: "flex",
      alignItems: "center",
      gap: 2,
    },
  }}
  
  label={
    <>
      <span>อื่นๆ (ระบุ)</span>
      <Form.Control

        disabled={data?.respond_Complaint !== "4"}
        value={data?.respond_ComplaintOther || ""}
        style={{ height: 40,width: 300 }}
   
        onChange={(e) => setDataFunction(e, "respond_ComplaintOther")}
        className="custom-input"
      />
    </>
  }
/>
            </RadioGroup>
          </Container>
        </div>
      </div>
      <div className="section-card">
          <div className="section-header">
    <GreenCircle />
          
              <span>บันทึกข้อความ / ข้อเสนอแนะของหัวหน้าแผนก/ผู้จัดการฝ่าย เพิ่มเติม</span>
  <span className="required-badge">จำเป็น</span>
        </div>

        <div className="section-body">
          <Container>
            <div
              className={
                missingKeys.some((item) => item.key === "decision")
                  ? "AreaBOX SETERRORBOX"
                  : "AreaBOX"
              }
            >
              <TextField
                fullWidth
                id="summary_Suggestions"
                        ref={(el) => (inputRefs.current.summary_Suggestions= el)}
                disabled={Mode === "Show"}
                label="เขียนรายละเอียด"
                value={data?.summary_Suggestions || ""}
                        onChange={(e) => {
      setErrors((prev) => ({ ...prev, summary_Suggestions: false }));

      setDataFunction(e, "summary_Suggestions");
    }}
                 variant="standard"
                multiline
                rows={4}
                 style={{
      borderColor: errors.summary_Suggestions ? "#dc3545" : "",
      boxShadow: errors.summary_Suggestions ? "0 0 0 0.2rem rgba(220,53,69,.25)" : "",
      boxShadow: errors.summary_Suggestions ? "0 0 0 0.2rem rgba(220,53,69,.25)" : "",
    }}
              />
            </div>
             {(errors.summary_Suggestions ) && (
                <Form.Control.Feedback
                  type="invalid"
                  style={{ display: "flex", alignItems: "center", gap: 4 }}
                >
            <ErrorOutlineIcon fontSize="small" />
                  กรุณาเขียนรายละเอียด
                </Form.Control.Feedback>
              )}
          </Container>
        </div>
      </div>
    </>
  );
};

export default GeneralInfo;

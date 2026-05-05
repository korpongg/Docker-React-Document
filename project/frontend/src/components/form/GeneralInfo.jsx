import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { getCurrentDate } from "../Function";
import { Autocomplete, TextField } from "@mui/material";
import ReportLog from "./ReportLog";
import ReportLog2 from "./ReportLog2";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import GreenCircle from "./GreenCircle";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
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
  disable,
  setDataFunction,
  handleSetBoard,
  handleSetDate,
  setSingleDataFunction,
  missingKeys,
  FormType,
  handleDateChange,
  handleDataChangeCheckbox,
  handleDataChangeCheckbox2,
  depoptiondata,
  setCheckBoxFunction,

  checkbox,
    setErrors,
                errors,
                inputRefs,
}) => {
  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [tosentvalue, settosentvalue] = useState("select"); // select or textinput
  const manager = checkbox.manager;
  const doctor = checkbox.doctor;
  const compensation = checkbox.compensation;
  const operation = checkbox.operation;
  const administer = checkbox.administer;
  const nurse = checkbox.nurse;
  const director = checkbox.director;
  const quality = checkbox.quality;

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
      <div className="section-card" >
          <div className="section-header">
    <GreenCircle />หน่วยงาน</div>

        <div className="section-body">
          <Container>
            {/* ส่งหน่วยงาน */}
            <Row className="align-items-center mb-3">
                 <Col md={4} >
                     <span>ข้อเรียกร้องส่งหน่วยงาน</span>
  <span className="required-badge">จำเป็น</span>
              </Col>
              <Col md={8}>
                <ReportLog
                
                  FormType="Occ"
                  Mode={Mode}
                  data={data}
                  setDataFunction={setDataFunction}
                  handleDateChange={handleDateChange}
                  handleDataChangeCheckbox={handleDataChangeCheckbox}
                  depoptiondata={depoptiondata}
                  missingKeys={missingKeys}
                    setErrors={setErrors}
                errors={errors}
                inputRefs={inputRefs}
                />
              </Col>
            </Row>

            <Row className="align-items-center mb-3">
              <Col md={4}>คณะกรรมการ</Col>
              <Col md={8}>
                <Form.Control
                  type="text"
                  value={data?.board || null}
                   onChange={(e) => setDataFunction(e, "board")}
                  className="form-input"
                />
              </Col>
            </Row>

            <Row className="align-items-center mb-3">
              <Col md={6}>
                เพื่อตอบกลับแนวทางการแก้ปัญหาและส่งคืนศูนย์พัฒนาคุณภาพ
              </Col>

              <Col md={6}>
                <RadioGroup
                  row
                  sx={{
                    flexWrap: "nowrap",
                  }}
                  name="problem"
                  value={data?.problem || "0"}
                  onChange={(e) => setDataFunction(e, "problem")}
                >
                  <FormControlLabel
                    disabled={Mode === "Show"}
                    value="0"
                    control={<Radio />}
                    label="ด่วนที่สุด"
                  />
                  <FormControlLabel
                    disabled={Mode === "Show"}
                    value="1"
                    control={<Radio />}
                    label="ภายในวันที่"
                  />
                  {data?.problem === "1" && (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <TextField
                        type="date"
                        size="small"
                        disabled={disable}
                          variant="standard"
                        value={data?.date || null}
                        onChange={(e) => setDataFunction(e, "date")}
                        sx={{ width: 180 }}
                      />
                    </div>
                  )}
                </RadioGroup>
              </Col>
            </Row>
            <Row className="align-items-center mb-3">
              <Col md={4}>
                แจ้งหน่วยงาน
              </Col>
              <Col md={8}>
                <ReportLog2
                  FormType="Occ"
                  Mode={Mode}
                  data={data}
                  setDataFunction={setDataFunction}
                  handleDateChange={handleDateChange}
                  handleDataChangeCheckbox={handleDataChangeCheckbox2}
                  depoptiondata={depoptiondata}
                  missingKeys={missingKeys}
                />
                <div className="">
                  เพื่อทราบ (ข้อเสนอแนะ) เพื่อเป็นโอกาสพัฒนา
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>

      <div className="section-card">
          <div className="section-header">
    <GreenCircle />สําเนาเรียนผู้บริหาร</div>
        <div className="section-body">
          <Container>
            <Row>
              <FormGroup
                row
                id="manager"
                name="manager"
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      name="a"
                      checked={manager.includes("a")}
                      onChange={(e) => setCheckBoxFunction(e, "manager")}
                    />
                  }
                  label="เพื่อรับทราบ"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="b"
                      checked={manager.includes("b")}
                      onChange={(e) => setCheckBoxFunction(e, "manager")}
                    />
                  }
                  label="เพื่อตอบกลับแนวทางการแก้ปัญหา และส่งคืนศูนย์พัฒนาคุณภาพ"
                />
              </FormGroup>
            </Row>
          </Container>
        </div>
      </div>
      <div className="section-card">
          <div className="section-header">
    <GreenCircle />ฝ่ายแพทย์/งานคุณภาพ</div>
        <div className="section-body">
          <Container>
            <Row>
              <FormGroup
                row
                id="quality"
                name="quality"
              >
                <FormControlLabel
                  control={
                 <Checkbox
                      name="a"
                      checked={quality.includes("a")}
                      onChange={(e) => setCheckBoxFunction(e, "quality")}
                    />}
                  label="แพทย์"
                />
                <FormControlLabel
                  control={
                  <Checkbox
                      name="b"
                      checked={quality.includes("b")}
                      onChange={(e) => setCheckBoxFunction(e, "quality")}
                    />}
                  label="ผอ.งานคุณภาพ และส่งคืนศูนย์พัฒนาคุณภาพ"
                />

                
              </FormGroup>
            </Row>
          </Container>
        </div>
      </div>
      <div className="section-card">
          <div className="section-header">
    <GreenCircle />งานพยาบาล</div>
        <div className="section-body">
          <Container>
            <Row>
              <FormGroup
                row
                id="nurse"
                aria-labelledby="nurse"
                defaultValue="0"
                name="nurse"
              >
                <FormControlLabel
                                    control={
                  <Checkbox
                      name="a"
                      checked={nurse.includes("a")}
                      onChange={(e) => setCheckBoxFunction(e, "nurse")}
                    />}
                  label="รองผอ.แพทย"
                />
                <FormControlLabel
                                    control={
                  <Checkbox
                      name="b"
                      checked={nurse.includes("b")}
                      onChange={(e) => setCheckBoxFunction(e, "nurse")}
                    />}
                  label="งานพยาบาล"
                />
                <FormControlLabel
                                    control={
                  <Checkbox
                      name="c"
                      checked={nurse.includes("c")}
                      onChange={(e) => setCheckBoxFunction(e, "nurse")}
                    />}
                  label="ผช.ผอ.แพทย์ งานพยาบาล"
                />
              </FormGroup>
            </Row>
          </Container>
        </div>
      </div>

      <div className="section-card">
          <div className="section-header">
    <GreenCircle />ฝ่ายบริหาร</div>
        <div className="section-body">
          <Container>
            <Row>
              <FormGroup
                row
                id="administer"
                aria-labelledby="administer"
                defaultValue="0"
                name="administer"
              >
                <FormControlLabel
                      control={
                  <Checkbox
                      name="a"
                      checked={administer.includes("a")}
                      onChange={(e) => setCheckBoxFunction(e, "administer")}
                    />}
                  label="ผอ.บริหาร"
                />
                <FormControlLabel
                      control={
                  <Checkbox
                      name="b"
                      checked={administer.includes("b")}
                      onChange={(e) => setCheckBoxFunction(e, "administer")}
                    />}
                  label="ผช.ผอ.บริหาร สายงานสนับสนุน"
                />
                <FormControlLabel
                      control={
                  <Checkbox
                      name="c"
                      checked={administer.includes("c")}
                      onChange={(e) => setCheckBoxFunction(e, "administer")}
                    />}
                  label="ผช.ผอ. บริหาร สายงานบัญชีและการเงิน"
                />
                <FormControlLabel
                      control={
                  <Checkbox
                      name="d"
                      checked={administer.includes("d")}
                      onChange={(e) => setCheckBoxFunction(e, "administer")}
                    />}
                  label="ผช.ผอ. บริหาร สายงานพัฒนาธุรกิจ"
                />
                <FormControlLabel
                      control={
                  <Checkbox
                      name="e"
                      checked={administer.includes("e")}
                      onChange={(e) => setCheckBoxFunction(e, "administer")}
                    />}
                  label="ผช.ผอ.บริหารสายงานวิศวกรรมและบริหารโครงการ"
                />
              </FormGroup>
            </Row>
          </Container>
        </div>
      </div>

      <div className="section-card">
          <div className="section-header">
    <GreenCircle />ฝ่ายปฏิบัติการ</div>
        <div className="section-body">
          <Container>
            <Row>
              <FormGroup
                row
                id="operation"
                aria-labelledby="operation"
                defaultValue="0"
                name="operation"
              >
                <FormControlLabel
                     control={
                  <Checkbox
                      name="a"
                      checked={operation.includes("a")}
                      onChange={(e) => setCheckBoxFunction(e, "operation")}
                    />}
                  label="ผอ.ปฏิบัติการ"
                />
                <FormControlLabel
                     control={
                  <Checkbox
                      name="b"
                      checked={operation.includes("b")}
                      onChange={(e) => setCheckBoxFunction(e, "operation")}
                    />}
                  label="ผช.ผอ.ปฏิบัติการ สายงานสนับสนุนการบริการลูกค้า"
                />
                <FormControlLabel
                     control={
                  <Checkbox
                      name="c"
                      checked={operation.includes("c")}
                      onChange={(e) => setCheckBoxFunction(e, "operation")}
                    />}
                  label="ผช.ผอ.ปฏิบัติการ สายงานราชการ"
                />
                <FormControlLabel
                     control={
                  <Checkbox
                      name="d"
                      checked={operation.includes("d")}
                      onChange={(e) => setCheckBoxFunction(e, "operation")}
                    />}
                  label="ผช.ผอ.ปฏิบัติการ สายงานธุรกิจเทคนิคการแพทย"
                />
              </FormGroup>
            </Row>
          </Container>
        </div>
      </div>

      <div className="section-card">
          <div className="section-header">
    <GreenCircle />สํานักอํานวยการ</div>
        <div className="section-body">
          <Container>
            <Row>
              <FormGroup
                row
                id="director"
                aria-labelledby="director"
                defaultValue="0"
                name="director"
              >
                <FormControlLabel
                  name="a"
                    control={
                  <Checkbox
                      name="a"
                      checked={director.includes("a")}
                      onChange={(e) => setCheckBoxFunction(e, "director")}
                    />}
                  label="ผอ.สํานักอํานวยการ"
                />
              </FormGroup>
            </Row>
          </Container>
        </div>
      </div>

      <div className="section-card">
          <div className="section-header">
    <GreenCircle />องค์กรแพทย์</div>
        <div className="section-body">
          <Container>
            <Row>
              <FormGroup
                row
                id="doctor"
                aria-labelledby="doctor"
                defaultValue="0"
                name="doctor"
              >
                <FormControlLabel
                  name="a"
                  
                  control={
                  <Checkbox
                      name="a"
                      checked={doctor.includes("a")}
                      onChange={(e) => setCheckBoxFunction(e, "doctor")}
                    />}
                  
                  label="ประธานองค์กรแพทย์"
                />
                <FormControlLabel
                  name="b"
                  control={
                  <Checkbox
                      name="b"
                      checked={doctor.includes("b")}
                      onChange={(e) => setCheckBoxFunction(e, "doctor")}
                    />}
                  label="ประธานอนุกรรมการจริยธรรมวิชาชีพแพทย์"
                />
              </FormGroup>
            </Row>
          </Container>
        </div>
      </div>

      <div className="section-card">
          <div className="section-header">
    <GreenCircle />อื่นๆ</div>
        <div className="section-body">
          <Container>
            <Row>
              <FormGroup
                row
                id="compensation"
                aria-labelledby="compensation"
                defaultValue="0"
                name="compensation"
              >
                <FormControlLabel
                  name="a"
                    control={
                  <Checkbox
                      name="a"
                      checked={compensation.includes("a")}
                      onChange={(e) => setCheckBoxFunction(e, "compensation")}
                    />}
                  label="จัดทําแฟ้มประวัติข้อร้องเรียนที่เสี่ยงต่อการถูกฟ้องร้อง / เรียกค่าชดเชย"
                />
              </FormGroup>
            </Row>
          </Container>
        </div>
      </div>

      <div className="section-card">
          <div className="section-header">
    <GreenCircle />
          สิ่งที่ต้องการให้ผู้ถูกร้องเรียนดำเนินการ
        </div>
        <div className="section-body">
          <Container>
            <Row>
              <RadioGroup
                id="complainant"
                aria-labelledby="complainant"
                defaultValue="0"
                name="complainant"
                onChange={(e) => setDataFunction(e, "complainant")}
                value={data?.complainant || "0"}
              >
                <FormControlLabel
                  value="0"
                  control={<Radio />}
                  label="ขอให้ตอบกลับผู้ร้องเรียน"
                />
                <FormControlLabel
                  value="1"
                  control={<Radio />}
                  label="ผู้ร้องเรียนไม่ต้องการการตอบกลับ"
                />
                <FormControlLabel
                  value="2"
                  control={<Radio />}
                  label="ผู้ร้องเรียนไม่ประสงค์ให้ชื่อ สกุล"
                />
                <FormControlLabel
                  value="3"
                  control={<Radio />}
                  label="ขอให้ติดต่อกลับเพื่อชี้แจงข้อมูลเพิ่มเติม"
                />
                <FormControlLabel
                  value="4"
                  control={<Radio />}
                  label="ขอให้หน่วยงานตรวจสอบรายละเอียดที่เกิดขึ้น"
                />
              </RadioGroup>
            </Row>
          </Container>
        </div>
      </div>
    </>
  );
};

export default GeneralInfo;

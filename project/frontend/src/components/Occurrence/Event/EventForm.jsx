import React from "react";
import { DialogTitle, DialogContent, TextField, Radio, RadioGroup, FormControlLabel, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

const EventForm = ({ mode, isHA, reportData, eventData, departments, formData, summarydetailRef, riskRef, factorsRef, commentRef, suggestionRef, forwardtxtRef, handleSelectChange, handleUrgentChange, handleISNewChange, handleInputChange }) => {
  const renderEventInfo = () => (
    <>
      <div className="EventRow">
        <div className="EventCol">
          <div className="EventCell Topic">ใบที่</div>
          <div className="EventCell Content">{eventData?.code}</div>
        </div>
        <div className="EventCol">
          <div className="EventCell Topic">HN</div>
          <div className="EventCell Content">{eventData?.hn}</div>
        </div>
      </div>
      <div className="EventRow">
        <div className="EventCol">
          <div className="EventCell Topic">วันที่เกิดเหตุ</div>
          <div className="EventCell Content">{new Date(eventData?.occurrencedate).toLocaleString()}</div>
        </div>
      </div>
      <div className="EventRow">
        <div className="EventCol">
          <div className="EventCell Topic">ประเภท</div>
          <div className="EventCell Content">{eventData?.reporttypename}</div>
        </div>
        <div className="EventCol">
          <div className="EventCell Topic">ความรุนแรง</div>
          <div className="EventCell Content">{eventData?.level}</div>
        </div>
      </div>
    </>
  );

  const renderTextField = (id, label, value, inputRef = null, disabled = true, readOnly = true, multiline = true, rows = 3) => (
    <TextField
      id={id}
      defaultValue={value}
      label={label}
      fullWidth
      inputRef={inputRef}
      InputProps={{ readOnly }}
      disabled={disabled}
      multiline={multiline}
      rows={rows}
      sx={{ marginTop: 2 }}
    />
  );

  const renderFormControlRadioGroup = (id, name, value, onChange, label0, label1) => (
    <FormControl component="fieldset">
      <RadioGroup id={id} name={name} value={value} onChange={onChange} row>
        <FormControlLabel value="0" control={<Radio />} label={label0} disabled={!isHA || mode === "Accept"} />
        <FormControlLabel value="1" control={<Radio />} label={label1} disabled={!isHA || mode === "Accept"} />
      </RadioGroup>
    </FormControl>
  );

  return (
    <>
      <DialogTitle id="tranfer-dialog-title">
        {mode === "Add" ? "ส่งรายงานให้หน่วยงาน" : mode === "Edit" ? "แก้ไขรายงาน" : "แบบบันทึกผลการทบทวนอุบัติการณ์"}
      </DialogTitle>
      <DialogContent>
        {mode !== "Add" && <div className="EventBox" style={{ marginBottom: '16px' }}>{renderEventInfo()}</div>}
        
        <Grid2 container spacing={2}>
          <Grid2 xs={12} md={6}>
            <FormControl fullWidth sx={{ marginTop: 1 }}>
              <InputLabel id="deptrelate-label">หน่วยงานที่เกี่ยวข้อง</InputLabel>
              <Select
                labelId="deptrelate-label"
                id="deptrelate"
                name="deptrelate"
                value={formData.deptrelate || eventData?.deptrelate || "0"}
                label="หน่วยงานที่เกี่ยวข้อง"
                onChange={handleSelectChange}
                disabled={!isHA || mode === "Accept"}
              >
                <MenuItem value="0" sx={{ fontFamily: "Prompt, sans-serif !important" }}>เลือกหน่วยงานที่เกี่ยวข้อง</MenuItem>
                {(reportData?.deptAffInfo?.length > 0 ? reportData.deptAffInfo : departments.filter(dept => dept.id === eventData?.deptrelate || dept.id === formData.deptrelate)).map(dept => (
                  <MenuItem key={dept.id} value={dept.id} sx={{ fontFamily: "Prompt, sans-serif !important" }}>
                    {dept.DepName}
                  </MenuItem>
                ))}
              </Select>
              {mode !== "Accept" && <span className="validate">*เลือกหน่วยงานที่ต้องการมอบหมาย</span>}
            </FormControl>
          </Grid2>

          <Grid2 xs={12} md={6}>
            {renderFormControlRadioGroup("urgenttype", "urgenttype", formData.urgenttype || eventData?.urgenttype || "0", handleUrgentChange, "เร่งด่วน", "ไม่เร่งด่วน")}
            {renderFormControlRadioGroup("isnew", "isnew", formData.isnew || eventData?.isnew || "0", handleISNewChange, "อุบัติการณ์ใหม่", "อุบัติการณ์ซ้ำ")}
          </Grid2>
        </Grid2>

        {isHA && mode !== "Accept" && (
          <>
            {renderTextField("description", "รายละเอียดเหตุการณ์", reportData?.description || eventData?.description || "-")}
            {renderTextField("effectremark", "ความเสียหายที่เกิดขึ้น", reportData?.effectremark || eventData?.effectremark || "-")}
            {renderTextField("impromptusolution", "การแก้ไขปัญหาเฉพาะหน้า", reportData?.impromptusolution || eventData?.impromptusolution || "-")}
            {renderTextField("activefailure", "ความคลาดเคลื่อนที่เกิดขึ้น (Active Failure)", reportData?.activefailure || eventData?.activefailure || "-")}
            {renderTextField("suggestion", "ข้อเสนอแนะเพื่อการแก้ไขปัญหา", reportData?.suggestion || eventData?.suggestion || "-")}
          </>
        )}

        {mode === "Accept" ? (
          <>
            {renderTextField("renew", "สรุปรายละเอียดเหตุการณ์", reportData?.renew || eventData?.renew || "-")}
            
            {renderTextField("summarydetail", "สรุปเหตุการณ์ไม่พึงประสงค์", reportData?.summarydetail || eventData?.summarydetail || "-")}
            
            {renderTextField("activefailure", "ความคลาดเคลื่อน", reportData?.activefailure || eventData?.activefailure || "-")}

            {renderTextField("risk", "สรุปเหตุการณ์ความเสี่ยง / เหตุการณ์ไม่พึงประสงค์ที่เกิดขึ้น", eventData?.risk, riskRef, false, false)}
            <span className="validate">*กรอกข้อมูล สรุปเหตุการณ์ความเสี่ยง / เหตุการณ์ไม่พึงประสงค์ที่เกิดขึ้น</span>

            {renderTextField("factors", "ปัจจัยกระตุ้นที่ส่งผลต่อความผิดพลาด / การละเมิดต่อมาตรการป้องกันที่เกิดขึ้น", eventData?.factors, factorsRef, false, false)}
            <span className="validate">*กรอกข้อมูล ปัจจัยกระตุ้นที่ส่งผลต่อความผิดพลาด / การละเมิดต่อมาตรการป้องกันที่เกิดขึ้น</span>

            {renderTextField("comment", "สาเหตุที่แท้จริงของความเสี่ยง / เหตุการณ์ไม่พึงประสงค์ที่เกิดขึ้น", eventData?.comment, commentRef, false, false)}
            <span className="validate">*กรอกข้อมูล สาเหตุที่แท้จริงของความเสี่ยง / เหตุการณ์ไม่พึงประสงค์ที่เกิดขึ้น</span>

            {renderTextField("suggestion", "แนวทางการแก้ไขปัญหา / มาตรการป้องกันความเสี่ยงที่กำหนดขึ้น", eventData?.suggestion, suggestionRef, false, false)}
            <span className="validate">*กรอกข้อมูล แนวทางการแก้ไขปัญหา / มาตรการป้องกันความเสี่ยงที่กำหนดขึ้น</span>

            {renderTextField("forwardtxt", "สิ่งที่หน่วยงานต้องการประสานงานกับหน่วยงานอื่น / คณะกรรมการที่เกี่ยวข้อง", eventData?.forwardtxt, forwardtxtRef, false, false)}
            <span className="validate">*กรอกข้อมูล สิ่งที่หน่วยงานต้องการประสานงานกับหน่วยงานอื่น / คณะกรรมการที่เกี่ยวข้อง</span>
          </>
        ) : (
          <>
            {renderTextField("renew", "สรุปรายละเอียดเหตุการณ์", reportData?.renew || eventData?.renew || "-")}
            {renderTextField("summarydetail", "สรุปเหตุการณ์ไม่พึงประสงค์", eventData?.summarydetail, summarydetailRef, false, false)}
            <span className="validate">*กรอกข้อมูล สรุปเหตุการณ์ไม่พึงประสงค์</span>
          </>
        )}
      </DialogContent>
    </>
  );
};

export default EventForm;

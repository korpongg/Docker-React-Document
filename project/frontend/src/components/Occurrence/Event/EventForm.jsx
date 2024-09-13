import React from "react";
import { DialogTitle, DialogContent, TextField, Radio, RadioGroup, FormControlLabel, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

const EventForm = ({ mode, isHA, reportData, eventData, departments, formData, summarydetailRef, riskRef, factorsRef, commentRef, suggestionRef, forwardtxtRef, handleSelectChange, handleUrgentChange, handleISNewChange, handleInputChange }) => {
  return (
    <>
      <DialogTitle id="tranfer-dialog-title">
        {mode === "Add" && "ส่งรายงานให้หน่วยงาน"}
        {mode === "Edit" && "แก้ไขรายงาน"}
        {mode === "Accept" && "แบบบันทึกผลการทบทวนอุบัติการณ์"}
      </DialogTitle>
      <DialogContent>
        {mode !== "Add" && (
          <div className="EventBox" style={{ marginBottom: '16px' }}>
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
          </div>
        )}
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
                {(reportData?.deptAffInfo && reportData.deptAffInfo.length > 0 ? reportData.deptAffInfo : departments.filter(dept => dept.id === eventData?.deptrelate || dept.id === formData.deptrelate)).map((dept) => (
                    <MenuItem key={dept.id} value={dept.id} sx={{ fontFamily: "Prompt, sans-serif !important" }}>
                        {dept.DepName}
                    </MenuItem>
                ))}
              </Select>
              {mode !== "Accept" && (<span className="validate">*เลือกหน่วยงานที่ต้องการมอบหมาย</span>)}
            </FormControl>
          </Grid2>
          <Grid2 xs={12} md={6}>
            <FormControl component="fieldset">
              <RadioGroup
                id="urgenttype"
                name="urgenttype"
                value={formData.urgenttype || eventData?.urgenttype || "0"}
                onChange={handleUrgentChange}
                row
              >
                <FormControlLabel
                  value="0"
                  control={<Radio />}
                  label="เร่งด่วน"
                  disabled={!isHA || mode === "Accept"}
                />
                <FormControlLabel
                  value="1"
                  control={<Radio />}
                  label="ไม่เร่งด่วน"
                  disabled={!isHA || mode === "Accept"}
                />
              </RadioGroup>
            </FormControl>
            <FormControl component="fieldset">
              <RadioGroup
                id="isnew"
                name="isnew"
                value={formData.isnew || eventData?.isnew || "0"}
                onChange={handleISNewChange}
                row
              >
                <FormControlLabel
                  value="0"
                  control={<Radio />}
                  label="อุบัติการณ์ใหม่"
                  disabled={!isHA || mode === "Accept"}
                />
                <FormControlLabel
                  value="1"
                  control={<Radio />}
                  label="อุบัติการณ์ซ้ำ"
                  disabled={!isHA || mode === "Accept"}
                />
              </RadioGroup>
            </FormControl>
          </Grid2>
        </Grid2>

        {isHA && mode !== "Accept" && (
          <>
            <TextField
              id="description"
              value={reportData?.description || eventData?.description || "-"}
              label="รายละเอียดเหตุการณ์"
              fullWidth
              InputProps={{ readOnly: true }}
              disabled
              multiline
              rows={3}
              sx={{ marginTop: 2 }}
            />
            <TextField
              id="effectremark"
              defaultValue={reportData?.effectremark || eventData?.effectremark || "-"}
              label="ความเสียหายที่เกิดขึ้น"
              fullWidth
              InputProps={{ readOnly: true }}
              disabled
              multiline
              rows={3}
              sx={{ marginTop: 2 }}
            />
            <TextField
              id="impromptusolution"
              defaultValue={reportData?.impromptusolution || eventData?.impromptusolution || "-"}
              label="การแก้ไขปัญหาเฉพาะหน้า"
              fullWidth
              InputProps={{ readOnly: true }}
              disabled
              multiline
              rows={3}
              sx={{ marginTop: 2 }}
            />
            <TextField
              id="activefailure"
              defaultValue={reportData?.activefailure || eventData?.activefailure || "-"}
              label="ความคลาดเคลื่อนที่เกิดขึ้น (Active Failure) : ระบุความผิดพลาด/การละเมิดต่อมาตรการที่เกิดขึ้น"
              fullWidth
              InputProps={{ readOnly: true }}
              disabled
              multiline
              rows={3}
              sx={{ marginTop: 2 }}
            />
            <TextField
              id="suggestion"
              defaultValue={reportData?.suggestion || eventData?.suggestion || "-"}
              label="ข้อเสนอแนะเพื่อการแก้ไขปัญหา / แนวทางแก้ไขปัญหา"
              fullWidth
              InputProps={{ readOnly: true }}
              disabled
              multiline
              rows={3}
              sx={{ marginTop: 2 }}
            />
          </>
        )}

        {mode === "Accept" ? (
          <>
            <TextField
              id="renew"
              defaultValue={reportData?.renew || eventData?.renew || "-"}
              label="สรุปรายละเอียดเหตุการณ์"
              fullWidth
              InputProps={{ readOnly: true }}
              disabled
              multiline
              rows={3}
              sx={{ marginTop: 2 }}
            />

            <TextField
              id="summarydetail"
              defaultValue={reportData?.summarydetail || eventData?.summarydetail || "-"}
              label="สรุปเหตุการณ์ไม่พึงประสงค์"
              fullWidth
              InputProps={{ readOnly: true }}
              disabled
              multiline
              rows={3}
              sx={{ marginTop: 2 }}
            />

            <TextField
              id="activefailure"
              defaultValue={reportData?.activefailure || eventData?.activefailure || "-"}
              label="ความคลาดเคลื่อน"
              fullWidth
              InputProps={{ readOnly: true }}
              disabled
              multiline
              rows={3}
              sx={{ marginTop: 2 }}
            />

            <TextField
              id="risk"
              defaultValue={eventData?.risk}
              label="สรุปเหตุการณ์ความเสี่ยง / เหตุการณ์ไม่พึงประสงค์ที่เกิดขึ้น"
              inputRef={riskRef}
              fullWidth
              multiline
              rows={3}
              sx={{ marginTop: 2 }}
            />
            <span className="validate">*กรอกข้อมูล สรุปเหตุการณ์ความเสี่ยง / เหตุการณ์ไม่พึงประสงค์ที่เกิดขึ้น</span>

            <TextField
              id="factors"
              defaultValue={eventData?.factors}
              label="ปัจจัยกระตุ้นที่ส่งผลต่อความผิดพลาด / การละเมิดต่อมาตรการป้องกันที่เกิดขึ้น"
              inputRef={factorsRef}
              fullWidth
              multiline
              rows={3}
              sx={{ marginTop: 2 }}
            />
            <span className="validate">*กรอกข้อมูล ปัจจัยกระตุ้นที่ส่งผลต่อความผิดพลาด / การละเมิดต่อมาตรการป้องกันที่เกิดขึ้น</span>

            <TextField
              id="comment"
              defaultValue={eventData?.comment}
              label="สาเหตุที่แท้จริงของความเสี่ยง / เหตุการณ์ไม่พึงประสงค์ที่เกิดขึ้น"
              inputRef={commentRef}
              fullWidth
              multiline
              rows={3}
              sx={{ marginTop: 2 }}
            />
            <span className="validate">*กรอกข้อมูล สาเหตุที่แท้จริงของความเสี่ยง / เหตุการณ์ไม่พึงประสงค์ที่เกิดขึ้น</span>

            <TextField
              id="suggestion"
              defaultValue={eventData?.suggestion}
              label="แนวทางการแก้ไขปัญหา / มาตรการป้องกันความเสี่ยงที่กำหนดขึ้น"
              inputRef={suggestionRef}
              fullWidth
              multiline
              rows={3}
              sx={{ marginTop: 2 }}
            />
            <span className="validate">*กรอกข้อมูล แนวทางการแก้ไขปัญหา / มาตรการป้องกันความเสี่ยงที่กำหนดขึ้น</span>

            <TextField
              id="forwardtxt"
              defaultValue={eventData?.forwardtxt}
              label="สิ่งที่หน่วยงานต้องการประสานงานกับหน่วยงานอื่น / คณะกรรมการที่เกี่ยวข้อง"
              inputRef={forwardtxtRef}
              fullWidth
              multiline
              rows={3}
              sx={{ marginTop: 2 }}
            />
            <span className="validate">*กรอกข้อมูล สิ่งที่หน่วยงานต้องการประสานงานกับหน่วยงานอื่น / คณะกรรมการที่เกี่ยวข้อง</span>
          </>
        ) : (
          <>
            <TextField
              id="renew"
              defaultValue={reportData?.renew || eventData?.renew || "-"}
              label="สรุปรายละเอียดเหตุการณ์"
              fullWidth
              InputProps={{ readOnly: true }}
              disabled
              multiline
              rows={3}
              sx={{ marginTop: 2 }}
            />
            <TextField
              id="summarydetail"
              defaultValue={eventData?.summarydetail}
              label="สรุปเหตุการณ์ไม่พึงประสงค์"
              disabled={!isHA || mode === "Accept"}
              inputRef={summarydetailRef}
              fullWidth
              multiline
              rows={3}
              sx={{ marginTop: 2 }}
            />
            <span className="validate">*กรอกข้อมูล สรุปเหตุการณ์ไม่พึงประสงค์</span>
          </>
        )}
      </DialogContent>
    </>
  );
};

export default EventForm;

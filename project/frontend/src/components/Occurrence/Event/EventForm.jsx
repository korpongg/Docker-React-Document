import React from "react";
import { DialogTitle, DialogContent, TextField, Radio, RadioGroup, FormControlLabel, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

const EventForm = ({ mode, isHA, reportData, eventData, departments, formData, summarydetailRef, commentRef, handleSelectChange, handleUrgentChange, handleISNewChange, handleInputChange }) => {

    return (
        <>
            <DialogTitle id="tranfer-dialog-title">
                {mode === 'Add' && 'ส่งรายงานให้หน่วยงาน'}
                {mode === 'Edit' && 'แก้ไขรายงาน'}
                {mode === 'Accept' && 'ตอบกลับรายงาน'}
            </DialogTitle>
            <DialogContent>
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
                                disabled={!isHA || mode === 'Accept'}
                            >
                                <MenuItem value="0">เลือกหน่วยงานที่เกี่ยวข้อง</MenuItem>
                                {(reportData?.deptAffInfo && reportData.deptAffInfo.length > 0 ? reportData.deptAffInfo : departments).map(dept => (
                                    <MenuItem key={dept.id} value={dept.id}>
                                        {dept.DepName}
                                    </MenuItem>
                                ))}
                            </Select>
                            {mode !== 'Accept' && (<span className="validate">*เลือกหน่วยงานที่ต้องการมอบหมาย</span>)}
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
                                <FormControlLabel value="0" control={<Radio />} label="เร่งด่วน" disabled={!isHA || mode === 'Accept'} />
                                <FormControlLabel value="1" control={<Radio />} label="ไม่เร่งด่วน" disabled={!isHA || mode === 'Accept'} />
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
                                <FormControlLabel value="0" control={<Radio />} label="อุบัติการณ์ใหม่" disabled={!isHA || mode === 'Accept'} />
                                <FormControlLabel value="1" control={<Radio />} label="อุบัติการณ์ซ้ำ" disabled={!isHA || mode === 'Accept'} />
                            </RadioGroup>
                        </FormControl>
                    </Grid2>
                </Grid2>

                {isHA && mode !== 'Accept' && (
                    <TextField
                        id="description"
                        value={reportData?.description || eventData?.description || '-'}
                        label="รายละเอียดเหตุการณ์"
                        fullWidth
                        InputProps={{ readOnly: true }}
                        disabled
                        multiline
                        rows={3}
                        sx={{ marginTop: 2 }}
                    />
                )}

                {mode === 'Accept' ? (
                    <>
                        <TextField
                            id="summarydetail"
                            defaultValue={eventData?.summarydetail}
                            label="สรุปรายละเอียดเหตุการณ์"
                            disabled={!isHA || mode === 'Accept'}
                            inputRef={summarydetailRef}
                            fullWidth
                            multiline
                            rows={3}
                            sx={{ marginTop: 2 }}
                        />

                        <TextField
                            id="activefailure"
                            defaultValue={reportData?.activefailure || eventData?.activefailure || '-'}
                            label="ความคลาดเคลื่อน"
                            fullWidth
                            InputProps={{ readOnly: true }}
                            disabled
                            multiline
                            rows={3}
                            sx={{ marginTop: 2 }}
                        />

                        <TextField
                            id="comment"
                            defaultValue={eventData?.comment}
                            label="สรุปเหตุการณ์ไม่พึงประสงค์"
                            inputRef={commentRef}
                            fullWidth
                            multiline
                            rows={3}
                            sx={{ marginTop: 2 }}
                        />
                        <span className="validate">*กรอกข้อมูล สรุปเหตุการณ์ไม่พึงประสงค์</span>
                    </>
                ) : (
                    <>
                        <TextField
                            id="activefailure"
                            defaultValue={reportData?.activefailure || eventData?.activefailure || '-'}
                            label="ความคลาดเคลื่อน"
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
                            label="สรุปรายละเอียดเหตุการณ์"
                            disabled={!isHA || mode === 'Accept'}
                            inputRef={summarydetailRef}
                            fullWidth
                            multiline
                            rows={3}
                            sx={{ marginTop: 2 }}
                        />
                        <span className="validate">*กรอกข้อมูล สรุปรายละเอียดเหตุการณ์</span>
                    </>
                )}
            </DialogContent>
        </>
    );
};

export default EventForm;
import React, { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import { DialogTitle, DialogContent, DialogActions, Box, Button, TextField, Radio, RadioGroup, FormControlLabel, Select, MenuItem, InputLabel, FormControl, Snackbar } from '@mui/material';
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import Swal from 'sweetalert2';

import { TranferDialogBox } from "../../../styles/Dashboard.style";

const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

const EventDialog = ({ mode, isHA, userData, config, isDialogOpen, handleCloseDialog, reportData }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        reportid: "",
        deptrelate: 0,
        urgenttype: "0",
        summarydetail: ""
    });

    useEffect(() => {
        if (mode === 'Add' && reportData) {
            setFormData(prevState => ({
                ...prevState,
                reportid: reportData.reportid || "",
                createby: userData.userid
            }));
        }
    }, [mode, reportData]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevState => ({ ...prevState, [id]: value }));
    };

    const handleSelectChange = (e) => {
        const { value } = e.target;
        setFormData(prevState => ({ ...prevState, deptrelate: value }));
    };
    
    const handleRadioChange = (e) => {
        const { value } = e.target;
        setFormData(prevState => ({ ...prevState, urgenttype: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        if (formData.deptrelate !== '0' && formData.summarydetail.trim() !== '') {
            try {
                const response = await axios.post(`${apiUrl}/events`, formData, { ...config });
                if (response.status === 200 || response.status === 201) {
                    Swal.fire({ icon: 'success', title: 'Success', text: 'เพิ่มรายงานเรียบร้อยแล้ว' });
                    handleCloseDialog();
                }
            } catch (err) {
                console.log(err);
                Swal.fire({ icon: 'error', title: 'ไม่สามารถบันทึกข้อมูลได้', text: err.message });
            } finally {
                setLoading(false);
            }
        } else {
            Swal.fire({ icon: 'error', title: 'ไม่สามารถบันทึกข้อมูลได้', text: 'กรุณากรอกข้อมูลในฟิลด์ที่จำเป็นทั้งหมด' });
            setLoading(false);
        }
    };

    console.log(mode, formData, isHA);

    return (
        <TranferDialogBox
            open={isDialogOpen}
            onClose={handleCloseDialog}
            aria-labelledby="tranfer-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="md"
            fullWidth
        >
            <DialogTitle id="tranfer-dialog-title">{mode === 'Add' ? 'ส่งรายงานให้หน่วยงาน' : 'แก้ไขตอบกลับรายงาน'}</DialogTitle>
            <DialogContent>
                <Grid2 container spacing={2}>
                    <Grid2 xs={6}>
                        <FormControl fullWidth sx={{ marginTop: 1 }}>
                            <InputLabel id="deptrelate-label">*หน่วยงานที่เกี่ยวข้อง</InputLabel>
                            <Select
                                labelId="deptrelate-label"
                                id="deptrelate"
                                name="deptrelate"
                                value={formData.deptrelate}
                                label="หน่วยงานที่เกี่ยวข้อง"
                                onChange={handleSelectChange}
                                disabled={!isHA}
                            >
                                <MenuItem value="0">เลือกหน่วยงานที่เกี่ยวข้อง</MenuItem>
                                {reportData?.deptAffInfo?.map(dept => (
                                    <MenuItem key={dept.id} value={dept.id}>
                                        {dept.DepName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid2>
                    <Grid2 xs={6}>
                        <FormControl component="fieldset" sx={{ marginTop: 2 }}>
                            <RadioGroup
                                id="urgenttype"
                                name="urgenttype"
                                value={formData.urgenttype}
                                onChange={handleRadioChange}
                                row
                            >
                                <FormControlLabel value="1" control={<Radio />} label="เร่งด่วน" />
                                <FormControlLabel value="0" control={<Radio />} label="ไม่เร่งด่วน" />
                            </RadioGroup>
                        </FormControl>
                    </Grid2>
                </Grid2>

                {isHA && (
                    <TextField
                        id="description"
                        value={reportData?.description || '-'}
                        label="รายละเอียดเหตุการณ์"
                        fullWidth
                        InputProps={{ readOnly: true }}
                        disabled
                        multiline
                        rows={3}
                        sx={{ marginTop: 2 }}
                    />
                )}

                <TextField
                    id="activefailure"
                    value={reportData?.activefailure || '-'}
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
                    value={formData.summarydetail}
                    onChange={handleInputChange}
                    label="*สรุปรายละเอียดเหตุการณ์"
                    fullWidth
                    multiline
                    rows={3}
                    sx={{ marginTop: 2 }}
                />
                {mode !== 'Add' && (
                    <TextField
                        id="comment"
                        value={formData.comment}
                        onChange={handleInputChange}
                        label="ความคิดเห็น"
                        fullWidth
                        multiline
                        rows={3}
                        sx={{ marginTop: 2 }}
                    />
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseDialog} variant="contained" color="error" disabled={loading}>ยกเลิก</Button>
                <Button onClick={handleSubmit} variant="contained" disabled={loading}>บันทึก</Button>
            </DialogActions>
        </TranferDialogBox>
    );
};

export default EventDialog;
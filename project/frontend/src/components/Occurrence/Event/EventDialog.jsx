import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import Swal from 'sweetalert2';

import EventForm from "./EventForm";
import EventView from "./EventView";

import { TranferDialogBox } from "../../../styles/Event.style";

const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

const EventDialog = ({ mode, isHA, userData, config, isDialogOpen, handleCloseDialog, reportData, eventData, formData, setFormData }) => {
    const [loading, setLoading] = useState(false);
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        if (reportData == null || (reportData?.deptAffInfo && reportData.deptAffInfo.length === 0)) {
            fetchDepartments();
        }
    }, [reportData]);

    const fetchDepartments = useCallback(async () => {
        try {
            const response = await axios.get(`${apiUrl}/departments`, config);
            setDepartments(response.data);
        } catch (error) {
            console.error('Error fetching departments:', error);
            Swal.fire({ icon: 'error', title: 'Error', text: 'Could not fetch departments' });
        }
    }, [config]);

    useEffect(() => {
        if (mode === 'Add' && reportData) {
            setFormData(prevState => ({
                ...prevState,
                reportid: reportData.reportid || "",
                createby: userData.userid
            }));
        } else if (mode === 'Edit' && eventData) {
            setFormData({
                deptrelate: eventData.deptrelate,
                urgenttype: eventData.urgenttype,
                isnew: eventData.isnew,
                summarydetail: eventData.summarydetail,
            });
        } else if (mode === 'Accept' && eventData) {
            setFormData({
                deptrelate: eventData.deptrelate,
                urgenttype: eventData.urgenttype,
                isnew: eventData.isnew,
                summarydetail: eventData.summarydetail,
                comment: eventData?.comment || '',
                acceptby: userData.userid
            });
        }
    }, [mode, reportData, eventData, isHA]);

    // Memoize event handlers
    const handleSelectChange = useCallback((e) => {
        const { value } = e.target;
        setFormData(prevState => ({ ...prevState, deptrelate: value }));
    }, [setFormData]);

    const handleUrgentChange = useCallback((e) => {
        const { value } = e.target;
        setFormData(prevState => ({ ...prevState, urgenttype: value }));
    }, [setFormData]);

    const handleISNewChange = useCallback((e) => {
        const { value } = e.target;
        setFormData(prevState => ({ ...prevState, isnew: value }));
    }, [setFormData]);

    const handleInputChange = useCallback((e) => {
        const { id, value } = e.target;
        setFormData(prevState => ({ ...prevState, [id]: value }));
    }, [setFormData]);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();

        setLoading(true);

        let isValid = true;
        let errorMessage = '';

        if (mode === 'Add' || mode === 'Edit') {
            if (formData.deptrelate === '0' || formData.summarydetail.trim() === '') {
                isValid = false;
                errorMessage = 'กรุณากรอกข้อมูลในฟิลด์ที่จำเป็นทั้งหมด';
            }
        } else if (mode === 'Accept') {
            if (formData.comment.trim() === '') {
                isValid = false;
                errorMessage = 'กรุณากรอกข้อมูล สรุปเหตุการณ์ไม่พึงประสงค์';
            }
        }

        if (isValid) {
            try {
                let response;

                if (mode === 'Add') {
                    response = await axios.post(`${apiUrl}/events`, formData, { ...config });
                } else {
                    response = await axios.put(`${apiUrl}/events/${eventData.id}`, formData, { ...config });
                }

                if (response.status === 200 || response.status === 201) {
                    if (mode === 'Add') {
                        Swal.fire({ icon: 'success', title: 'Success', text: 'เพิ่มรายงานเรียบร้อยแล้ว' });
                    } else if (mode === 'Add') {
                        Swal.fire({ icon: 'success', title: 'Success', text: 'แก้ไขรายงานเรียบร้อยแล้ว' });
                    } else {
                        Swal.fire({ icon: 'success', title: 'Success', text: 'ตอบกลับรายงานเรียบร้อยแล้ว' });
                    }
                    handleCloseDialog();
                }
            } catch (err) {
                console.log(err);
                Swal.fire({ icon: 'error', title: 'ไม่สามารถบันทึกข้อมูลได้', text: err.message });
            } finally {
                setLoading(false);
            }
        } else {
            Swal.fire({ icon: 'error', title: 'ไม่สามารถบันทึกข้อมูลได้', text: errorMessage });
            setLoading(false);
        }
    }, [mode, formData, config, eventData, handleCloseDialog]);

    return (
        isDialogOpen && (
            <TranferDialogBox
                open={isDialogOpen}
                onClose={handleCloseDialog}
                aria-labelledby="tranfer-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="md"
                fullWidth
            >
                {mode !== 'View' ? (
                    <>
                        <EventForm
                            mode={mode}
                            isHA={isHA}
                            reportData={reportData}
                            departments={departments}
                            formData={formData}
                            handleSelectChange={handleSelectChange}
                            handleUrgentChange={handleUrgentChange}
                            handleISNewChange={handleISNewChange}
                            handleInputChange={handleInputChange}
                        />
                        <DialogActions>
                            <Button onClick={handleCloseDialog} variant="contained" color="error" disabled={loading}>ยกเลิก</Button>
                            <Button onClick={handleSubmit} variant="contained" disabled={loading}>บันทึก</Button>
                        </DialogActions>
                    </>
                ) : (
                    <>
                        <EventView isHA={isHA} eventData={eventData} />

                        <DialogActions>
                            <Button onClick={handleCloseDialog} variant="contained" color="error" disabled={loading}>ปิด</Button>
                        </DialogActions>
                    </>
                )}
            </TranferDialogBox>
        )
    );
};

export default EventDialog;
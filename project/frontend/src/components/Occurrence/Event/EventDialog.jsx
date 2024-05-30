import React, { useEffect, useState, useCallback, useRef } from "react";
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

    const summarydetailRef = useRef(null);
    const commentRef = useRef(null);

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

        const summarydetail = summarydetailRef.current ? summarydetailRef.current.value.trim() : '';
        const comment = commentRef.current ? commentRef.current.value.trim() : '';

        if (mode === 'Add' || mode === 'Edit') {
            if (formData.deptrelate === '0' || summarydetail === '') {
                isValid = false;
                errorMessage = 'กรุณากรอกข้อมูลในฟิลด์ที่จำเป็นทั้งหมด';
            }
        } else if (mode === 'Accept') {
            if (comment === '') {
                isValid = false;
                errorMessage = 'กรุณากรอกข้อมูล สรุปเหตุการณ์ไม่พึงประสงค์';
            }
        }

        if (isValid) {
            try {
                let response;
                let formDataToSend;

                if (mode === 'Add') {
                    formDataToSend = { ...formData, summarydetail };
                    response = await axios.post(`${apiUrl}/events`, formDataToSend, { ...config });
                } else {
                    if (mode === 'Edit') {
                        formDataToSend = { ...formData, summarydetail };
                    } else {
                        formDataToSend = { ...formData, comment };
                    }
                    response = await axios.put(`${apiUrl}/events/${eventData.id}`, formDataToSend, { ...config });
                }

                if (response.status === 200 || response.status === 201) {
                    const successMessage = mode === 'Add' ? 'เพิ่มรายงานเรียบร้อยแล้ว' :
                                          mode === 'Edit' ? 'แก้ไขรายงานเรียบร้อยแล้ว' :
                                          'ตอบกลับรายงานเรียบร้อยแล้ว';
                    Swal.fire({ icon: 'success', title: 'Success', text: successMessage });
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
                            eventData={eventData}
                            departments={departments}
                            formData={formData}
                            summarydetailRef={summarydetailRef}
                            commentRef={commentRef}
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
import React, { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import { DialogTitle, DialogContent, DialogActions, Box, Button, TextField } from '@mui/material';
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { TranferDialogBox } from "../../../styles/Dashboard.style";

const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

const TranferDialog = ({ config, rowData, eventData, setEventData, isDialogOpen, setDialogOpen, handleCloseDialog }) => {
    const userId = rowData?.reportid || 0;

    const fetchVitalSignData = async () => {
        try {
            const response = await axios.get(`${apiUrl}/events/${userId}`, { ...config });
            if (response.status === 200)
            setEventData(response.data);
        } catch (error) {
            console.error('Error fetching events data:', error);
        }
    };

    useEffect(() => {
        if (isDialogOpen && userId) {
            fetchVitalSignData();
        }
    }, [isDialogOpen, userId]);

    return (
        <TranferDialogBox
            open={isDialogOpen}
            onClose={handleCloseDialog}
            aria-labelledby="tranfer-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="md"
            fullWidth
        >
            <DialogTitle id="tranfer-dialog-title">Tranfer หน่วยงานที่เกี่ยวข้อง</DialogTitle>
            <DialogContent>

            </DialogContent>
        </TranferDialogBox >
    )
}

export default TranferDialog;
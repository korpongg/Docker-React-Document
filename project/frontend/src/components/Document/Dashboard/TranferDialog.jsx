import React, { useEffect, useState, useCallback } from "react";
import { DialogTitle, DialogContent } from '@mui/material';
import { TranferDialogBox } from "../../../styles/Dashboard.style";
import TranferTable from "./TranferTable";

const TranferDialog = ({ userData, config, isAdmin, rowData, tranType, eventData, isDialogOpen, handleCloseDialog }) => {
    const reportID = rowData?.reportid || 0;
    const [filterData, setFilterData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        if (isDialogOpen && reportID && eventData.length > 0) {
            setLoading(true);
            const filteredData = eventData.filter(item => item.reportid === reportID);
            setFilterData(filteredData);
            setLoading(false);
        } else {
            setFilterData([]);
            setLoading(false);
        }
    }, [isDialogOpen, reportID, eventData]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <TranferDialogBox
            open={isDialogOpen}
            onClose={handleCloseDialog}
            aria-labelledby="tranfer-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="lg"
            fullWidth
        >
            <DialogTitle id="tranfer-dialog-title">รายงานหน่วยงานที่เกี่ยวข้อง</DialogTitle>
            <DialogContent>
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <TranferTable
                        reportData={rowData}
                        tranType={tranType}
                        dataEvent={filterData}
                        isAdmin={isAdmin}
                        userData={userData}
                        config={config}
                        loading={loading}
                        setLoading={setLoading}
                    />
                )}
            </DialogContent>
        </TranferDialogBox>
    );
};

export default TranferDialog;
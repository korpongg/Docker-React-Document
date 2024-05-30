import React from "react";
import { DialogTitle, DialogContent } from '@mui/material';
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

const EventView = ({ isHA, eventData }) => {
    console.log(eventData);

    return (
        <>
            {eventData ? (
                <>
                    <DialogTitle id="tranfer-dialog-title">
                        <u>Report ID {eventData.reportid}</u>
                    </DialogTitle>
                    <DialogContent>
                        <Grid2 container spacing={1}>
                            <Grid2 xs={12} sm={6}>
                                <strong>ใบที่:</strong> {eventData.code}
                            </Grid2>
                            <Grid2 xs={12} sm={6}>
                                <strong>HN/AN:</strong> {eventData.hn}
                            </Grid2>
                            <Grid2 xs={12} sm={6}>
                                <strong>วันที่เกิดเหตุ:</strong> {new Date(eventData.occurrencedate).toLocaleString()}
                            </Grid2>
                            <Grid2 xs={12} sm={6}>
                                <strong>แผนกที่เกี่ยวข้อง:</strong> {eventData.depname}
                            </Grid2>
                            <Grid2 xs={12} sm={6}>
                                <strong>ประเภท:</strong> {eventData.reporttypename}
                            </Grid2>
                            <Grid2 xs={12} sm={6}>
                                <strong>ความรุนแรง:</strong> {eventData.level}
                            </Grid2>

                            {isHA && (
                                <Grid2 xs={12}>
                                    <u><strong>บันทึกรายละเอียด</strong></u>
                                    <pre>{eventData.description}</pre>
                                </Grid2>
                            )}

                            <Grid2 xs={12}>
                                <u><strong>สรุปรายละเอียดเหตุการณ์</strong></u>
                                <pre>{eventData.summarydetail}</pre>
                            </Grid2>

                            <Grid2 xs={12}>
                                <u><strong>ความคลาดเคลื่อน / การละเมิดที่เกิดขึ้น</strong></u>
                                <pre>{eventData.activefailure ? eventData.activefailure : '-'}</pre>
                            </Grid2>

                            {eventData.comment && (
                                <Grid2 xs={12}>
                                    <u><strong>สรุปเหตุการณ์ไม่พึงประสงค์</strong></u>
                                    <pre>{eventData.comment}</pre>
                                </Grid2>
                            )}
                        </Grid2>
                    </DialogContent>
                </>
            ) : (
                <span>ไม่มีข้อมูล</span>
            )}
        </>
    );
};

export default EventView;
import React, { useState, useEffect } from "react";
import axios from 'axios';
import Swal from 'sweetalert2';

import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import DataDict_Med from "../../data/form/DataDict_Med";
import { ApproveDialogBox } from "../../styles/MedicationStyle.style";
import ApproveForm from "./ApproveForm";

const ApproveDialog = ({ apiUrl, config, isOpen, setDialogOpen, setReportData, reportData, userData }) => {
  const [FormData, setFormData] = useState({});

  const handleDataChange = (event, name) => {
    let value;

    if (event && event.target) {
        value = event.target.value;
    } else if (event && event.id !== undefined) {
        value = event.id;
    } else {
        value = '';
    }
    setFormData({ ...FormData, [name]: value, approveby: userData.userid });
  };

  const handleDataChangeCheckbox = (dataarray, columnname) => {
    setFormData({ ...FormData, [columnname]: dataarray });
  };

  const handleConfirmApprove = async () => {
    if (!FormData.analysis) {
      Swal.fire("ผิดพลาด", "กรุณาระบุผลการวิเคราะห์สาเหตุ", "error");
      return;
    }
    if (!FormData.solution) {
      Swal.fire("ผิดพลาด", 'กรุณาระบุแนวทางการแก้ไข / ป้องกันปัญหาในเชิงระบบ"', "error");
      return;
    }
    if (FormData.rca.length <= 0) {
      Swal.fire("ผิดพลาด", 'กรุณาเลือก สรุปผลการวิเคราะห์สาเหตุที่แท้จริง (RCA) ของความคลาดเคลื่อน"', "error");
      return;
    } else {
      if (FormData.rca.includes("999") && !FormData.rcaremark) {
        Swal.fire("ผิดพลาด", 'กรุณาระบุรายละเอียด"', "error");
        return;
      }
    }

    try {
      const payload = {
        id: reportData.id,
        analysis: FormData.analysis,
        solution: FormData.solution,
        rca: JSON.stringify(FormData.rca),
        rcaremark: FormData.rcaremark || null,
        approveby: userData.userid
      };

      console.log(payload)

      const response = await axios.put(`${apiUrl}/medication`, payload, { ...config });

      if (response.status === 200 || response.status === 201){
        Swal.fire("สำเร็จ", "แก้ไขสถานะความคลาดเคลื่อนยาเรียบร้อยแล้ว", "success");
  
        setReportData(null);
        setFormData({})
        setDialogOpen(false);
      }
    } catch (error) {
      console.error(error);
      Swal.fire("ผิดพลาด", "เกิดข้อผิดพลาดในการแก้ไขสถานะความคลาดเคลื่อนยา", "error");
    }
  };

  const handleCloseDialog = () => {
    setReportData(null);
    setFormData({})
    setDialogOpen(false);
  };

  return (
    <ApproveDialogBox
      open={isOpen}
      onClose={handleCloseDialog}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle id="approve-dialog-title">แบบบันทึกผลการทบทวนความคลาดเคลื่อนยา</DialogTitle>

      <ApproveForm
        data={reportData}
        approveData={FormData}
        DataDictMed={DataDict_Med}
        handleDataChange={handleDataChange}
        handleDataChangeCheckbox={handleDataChangeCheckbox}
      />

      <DialogActions>
        <Button onClick={handleCloseDialog} variant="contained" color="error">ยกเลิก</Button>
        <Button onClick={handleConfirmApprove} variant="contained" color="primary">ยืนยัน</Button>
      </DialogActions>
    </ApproveDialogBox>
  );
};

export default ApproveDialog;
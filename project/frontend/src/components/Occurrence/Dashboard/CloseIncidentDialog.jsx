import React from "react";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { IncidentDialog } from "../../../styles/Dashboard.style";

const CloseIncidentDialog = ({ isOpen, closeReason, setCloseReason, closeComment, setCloseComment, handleConfirmClose, handleCloseDialog }) => {
  const handleDialogClose = () => {
    setCloseComment("");
    setCloseReason("");
    handleCloseDialog();
  };

  return (
    <IncidentDialog open={isOpen} onClose={handleDialogClose}>
      <DialogTitle id="incident-dialog-title">
        แก้ไขสถานะอุบัติการณ์
      </DialogTitle>
      <DialogContent>
        <TextField
          select
          label="เลือกสถานะ"
          value={closeReason}
          onChange={(e) => setCloseReason(e.target.value)}
          fullWidth
          margin="normal"
        >
          <MenuItem value="2" sx={{ fontFamily: "Prompt, sans-serif !important" }}>ปิดอุบัติการณ์</MenuItem>
          <MenuItem value="5" sx={{ fontFamily: "Prompt, sans-serif !important" }}>ไม่ใช่อุบัติการณ์</MenuItem>
        </TextField>
        {closeReason === "5" && (
          <TextField
            label="ความคิดเห็น"
            value={closeComment}
            onChange={(e) => setCloseComment(e.target.value)}
            fullWidth
            margin="normal"
            multiline
            rows={3}
            required
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose} variant="contained" color="error">ยกเลิก</Button>
        <Button onClick={handleConfirmClose} variant="contained" color="primary">ยืนยัน</Button>
      </DialogActions>
    </IncidentDialog>
  );
};

export default CloseIncidentDialog;
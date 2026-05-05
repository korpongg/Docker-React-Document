import React from "react";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { IncidentDialog } from "../styles/Dashboard.style";
import IncidentText from "./label.json";

const CloseIncidentDialog = ({ isOpen, type, closeReason, setCloseReason, closeComment, setCloseComment, handleConfirmClose, handleCloseDialog }) => {
  const labels = type === "Occurrence" ? IncidentText.CloseIncident.Occurrence : IncidentText.CloseIncident.Medication;

  const handleDialogClose = () => {
    setCloseComment("");
    setCloseReason("");
    handleCloseDialog();
  };

  return (
    <IncidentDialog open={isOpen} onClose={handleDialogClose}>
      <DialogTitle id="incident-dialog-title">{labels.title}</DialogTitle>
      <DialogContent>
        <TextField
          select
          label="เลือกสถานะ"
          value={closeReason}
          onChange={(e) => setCloseReason(e.target.value)}
          fullWidth
          margin="normal"
        >
          <MenuItem value="2" sx={{ fontFamily: "Prompt, sans-serif !important" }}>{labels.closeReport}</MenuItem>
          <MenuItem value={type === "Occurrence" ? "5" : "6"} sx={{ fontFamily: "Prompt, sans-serif !important" }}>ไม่ใช่ข้อร้องเรียน</MenuItem>
        </TextField>
        {closeReason && (
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
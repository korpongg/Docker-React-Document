import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import axios from "axios";

const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function DeleteDept({ id, fetch }) {
  const [open, setOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSuccessClose = () => {
    setSuccessOpen(false);
  };

  const DeleteData = async (id) => {
    try {
      const response = await axios.delete(`${apiUrl}/departments/${id}`);
      if (response.status === 204) {
        fetch();
        handleClose();
        setSuccessOpen(true);
      }
    } catch (error) {
      console.error("Error::", error);
    }
  };

  return (
    <>
      <Button className="btnDelete" onClick={handleClickOpen} variant="outlined">ลบ</Button>

      {open && (
        <Dialog
          open={open}
          onClose={handleClose}
          PaperProps={{
            component: "form",
            onSubmit: (event) => {
              event.preventDefault();
              DeleteData(id);
            },
          }}
        >
          <DialogTitle sx={{ fontSize: '1.25rem' }}>คุณยืนยันที่จะลบแผนกหรือไม่?</DialogTitle>
          <DialogContent sx={{ fontSize: '1.125rem' }}>หากทำการลบแล้วจะไม่สามารถกู้คืนได้ หรืออาจจะกระทบกับข้อมูลรายงานที่มีอยู่ในระบบ!</DialogContent>
          <DialogActions>
            <Button variant="contained" color="error" onClick={handleClose}>ยกเลิก</Button>
            <Button variant="contained" type="submit">ลบ</Button>
          </DialogActions>
        </Dialog>
      )}

      <Snackbar
        open={successOpen}
        autoHideDuration={6000}
        onClose={handleSuccessClose}
      >
        <Alert onClose={handleSuccessClose} severity="success">ลบแผนก/หน่วยงาน เรียบร้อย!</Alert>
      </Snackbar>

    </>
  );
}
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

export default function DeleteSup({ id, fetch }) {
  const storedAuth = JSON.parse(localStorage.getItem("auth"));
  const config = { headers: { Authorization: `Bearer ${storedAuth.accessToken}` } };
  const [open, setOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSuccessClose = () => {
    setSuccessOpen(false);
  };

  const handleErrorClose = () => {
    setErrorOpen(false);
  };

  const DeleteData = async (id) => {
    setLoading(true);
    try {
      const response = await axios.delete(`${apiUrl}/supervisor/${id}`, { ...config });
      if (response.status === 204) {
        fetch();
        setSuccessOpen(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorOpen(true);
    } finally {
      setLoading(false);
      handleClose();
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
          aria-labelledby="delete-dialog-title"
          aria-describedby="delete-dialog-description"
        >
          <DialogTitle id="delete-dialog-title" sx={{ fontSize: "1.25rem" }}>คุณยืนยันที่จะลบข้อมูลนี้หรือไม่?</DialogTitle>
          <DialogContent id="delete-dialog-description" sx={{ fontSize: "1.125rem" }}>หากทำการลบแล้วจะไม่สามารถกู้คืนข้อมูลได้!</DialogContent>
          <DialogActions>
            <Button variant="contained" color="error" onClick={handleClose} disabled={loading}>ยกเลิก</Button>
            <Button variant="contained" type="submit" disabled={loading}>ยืนยัน</Button>
          </DialogActions>
        </Dialog>
      )}

      <Snackbar open={successOpen} autoHideDuration={6000} onClose={handleSuccessClose}>
        <Alert onClose={handleSuccessClose} severity="success">ลบข้อมูลเรียบร้อย!</Alert>
      </Snackbar>

      <Snackbar open={errorOpen} autoHideDuration={6000} onClose={handleErrorClose}>
        <Alert onClose={handleErrorClose} severity="error">เกิดข้อผิดพลาดในการลบข้อมูล!</Alert>
      </Snackbar>
    </>
  );
}
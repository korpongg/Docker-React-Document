import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import axios from "axios";

const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function EditDept({ affs, id, fetch }) {
  const [open, setOpen] = useState(false);
  const [newData, setNewData] = useState({
    name: "",
    email: "",
    relateid: ""
  });
  const [errors, setErrors] = useState({
    name: false,
    email: false,
    relateid: false
  });
  const [successOpen, setSuccessOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const FetchQByID = async (id) => {
    try {
      const url = `${apiUrl}/departments/${id}`;
      const response = await axios.get(url);
      if (response.status === 200 || response.status === 201) {
        const responseData = response.data;
        const mappedData = {
          name: responseData.DepName,
          email: responseData.email || "",
          relateid: responseData.AffID,
        };
  
        setNewData(mappedData);
      } else {
        console.error("Error::", response.status);
      }
    } catch (error) {
      console.error("Error::", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClickOpen = (id) => {
    setLoading(true);
    FetchQByID(id);
    setErrors({
      name: false,
      relateid: false
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewData({
      name: "",
      email: "",
      relateid: "",
    });
  };

  const handleSuccessClose = () => {
    setSuccessOpen(false);
  };

  const handleChange = (event) => {
    setNewData({
      ...newData,
      [event.target.name]: event.target.name === "relateid" || event.target.name === "relateid" ? parseInt(event.target.value) : event.target.value,
    });
  };

  const validate = () => {
    let valid = true;
    const newErrors = {
      name: false,
      email: false,
      relateid: false
    };

    if (!newData.name) {
      newErrors.name = true;
      valid = false;
    }

    if (!newData.email) {
      newErrors.email = true;
      valid = false;
    }

    if (!newData.relateid) {
      newErrors.relateid = true;
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };
  const EditData = async (id) => {
    if (!validate()) return;

    try {
      const response = await axios.put(`${apiUrl}/departments/${id}`, newData);
      if (response.status === 200 || response.status === 201) {
        fetch();
        handleClose();
        setSuccessOpen(true);
      }
    } catch (error) {
      console.error("Error::", error);
    }
  };

  console.log(newData)

  return (
    <>
      <Button className="btnEdit" variant="outlined" onClick={() => handleClickOpen(id)} >แก้ไข</Button>

      {open && (
        <Dialog
          open={open}
          onClose={handleClose}
          PaperProps={{
            component: "form",
            onSubmit: (event) => {
              event.preventDefault();
              EditData(id);
            },
          }}
        >
          <DialogTitle>Edit Medic</DialogTitle>
          {loading ? "Loading..." :
            <DialogContent>

              <TextField
                sx={{ marginTop: 1 }}
                id="name"
                name="name"
                label="ชื่อแผนก/หน่วยงาน"
                type="text"
                fullWidth
                variant="standard"
                value={newData.name}
                onChange={handleChange}
                error={errors.name}
                helperText={errors.name ? "โปรดระบุ ชื่อแผนก/หน่วยงาน" : ""}
              />

              <TextField
                sx={{ marginTop: 1 }}
                id="email"
                name="email"
                label="Email"
                type="text"
                fullWidth
                variant="standard"
                value={newData.email}
                onChange={handleChange}
                error={errors.email}
                helperText={errors.email ? "โปรดระบุ Email" : ""}
              />

              <FormControl fullWidth sx={{ marginTop: 1 }} error={errors.relateid}>
                <InputLabel id="relateid">ฝ่าย</InputLabel>
                <Select
                  labelId="relateid"
                  id="relateid"
                  name="relateid"
                  value={newData.relateid}
                  label="ฝ่าย"
                  onChange={handleChange}
                >
                  <MenuItem value="">--- เลือกฝ่าย ---</MenuItem>
                  {affs?.map((row) => (
                    <MenuItem key={row.id} value={row.id}>{row.name}</MenuItem>
                  ))}
                </Select>
                {errors.relateid && <p className="name-helper-text" style={{ color: "red" }}>โปรดเลือก ฝ่าย</p>}
              </FormControl>

            </DialogContent>
          }
          <DialogActions>
            <Button variant="contained" color="error" onClick={handleClose}>ยกเลิก</Button>
            <Button variant="contained" type="submit">บันทึก</Button>
          </DialogActions>
        </Dialog>
      )}

      <Snackbar
        open={successOpen}
        autoHideDuration={6000}
        onClose={handleSuccessClose}
      >
        <Alert onClose={handleSuccessClose} severity="success">แก้ไขข้อมูล แผนก/หน่วยงาน เรียบร้อย!</Alert>
      </Snackbar>

    </>
  );
}
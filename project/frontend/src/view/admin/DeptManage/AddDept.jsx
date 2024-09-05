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

import { createGlobalStyle } from "styled-components";
const GlobalStyle = createGlobalStyle`
  .toggle-button-cover {
    display: table-cell;
    display: block;
    position: relative;
    // width: 200px;
    // height: 140px;
    box-sizing: border-box;
    margin-top: 12px;
  }

  .button-cover {
    height: 100px;
    margin: 20px;
    background-color: #fff;
    box-shadow: 0 10px 20px -8px #c5d6d6;
    border-radius: 4px;
  }

  .button-cover:before {
    counter-increment: button-counter;
    content: counter(button-counter);
    position: absolute;
    right: 0;
    bottom: 0;
    color: #d7e3e3;
    font-size: 12px;
    line-height: 1;
    padding: 5px;
  }

  .button-cover, .knobs, .layer {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  .button {
    position: relative;
    top: 50%;
    width: 74px;
    height: 36px;
    // margin: -20px auto 0 auto;
    margin-top: 6px;
    overflow: hidden;
    box-shadow: 3px 2px 0px 0px #b7c8cfab;
  }

  .checkbox {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    opacity: 0;
    cursor: pointer;
    z-index: 3;
  }

  .knobs {
    z-index: 2;
  }

  .layer {
    width: 100%;
    background-color: #ebf7fc;
    transition: 0.3s ease all;
    z-index: 1;
  }

  .button.r, .button.r .layer {
    border-radius: 100px;
  }

  #buttonSwitch .knobs:before {
    content: "On";
    position: absolute;
    top: 4px;
    left: 4px;
    width: 20px;
    height: 10px;
    color: #fff;
    font-size: 10px;
    font-weight: bold;
    text-align: center;
    line-height: 1;
    padding: 9px 4px;
    background-color: #03a9f4;
    border-radius: 50%;
    box-shadow: 2px 0px 0px 0px #1586b9;
    transition: 0.3s ease all, left 0.3s cubic-bezier(0.18, 0.89, 0.35, 1.15);
  }

  #buttonSwitch .checkbox:active + .knobs:before {
    width: 46px;
    border-radius: 100px;
  }

  #buttonSwitch .checkbox:checked:active + .knobs:before {
    margin-left: -26px;
  }

  #buttonSwitch .checkbox:checked + .knobs:before {
    content: "Off";
    left: 42px;
    background-color: #f44336;
    box-shadow: 2px 0px 0px 0px #ab342b;
  }

  #buttonSwitch .checkbox:checked ~ .layer {
    background-color: #fcebeb;
  }

  #name-helper-text, #email-helper-text, #relateid-helper-text {
    font-size: 0.875rem;
    margin: 2px 0 0 0;
  }
`;

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function AddDept({ affs, fetch }) {
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

  const handleClickOpen = () => {
    setNewData({
      name: "",
      relateid: ""
    });
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

  const AddData = async () => {
    if (!validate()) return;

    try {
      const response = await axios.post(`${apiUrl}/departments`, newData);
      if (response.status === 200 || response.status === 201) {
        fetch();
        handleClose();
        setSuccessOpen(true);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <GlobalStyle />
      <Button className="ADDBtn" variant="outlined" onClick={handleClickOpen}>เพิ่มแผนก</Button>

      {open && (
        <Dialog
          open={open}
          onClose={handleClose}
          PaperProps={{
            component: "form",
            onSubmit: (event) => {
              event.preventDefault();
              AddData();
            },
          }}
        >
          <DialogTitle>เพิ่มแผนก/หน่วยงาน</DialogTitle>
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
              {errors.relateid && <p id="relateid-helper-text" style={{ color: "red" }}>โปรดเลือก ฝ่าย</p>}
            </FormControl>

          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error" onClick={handleClose}>ยกเลิก</Button>
            <Button variant="contained" type="submit">เพิ่ม</Button>
          </DialogActions>
        </Dialog>
      )}

      <Snackbar
        open={successOpen}
        autoHideDuration={6000}
        onClose={handleSuccessClose}
      >
        <Alert onClose={handleSuccessClose} severity="success">เพิ่ม แผนก/หน่วยงาน เรียบร้อย!</Alert>
      </Snackbar>

    </>
  );
}
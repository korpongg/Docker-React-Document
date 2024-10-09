import React, { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, FormControl, Autocomplete, Checkbox, Chip, FormLabel, FormControlLabel, RadioGroup, Radio, Button, Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import CheckBoxOutlineIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { createGlobalStyle } from "styled-components";
import axios from "axios";

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

  #userid-helper-text, #deptrelate-helper-text {
    font-size: 0.875rem;
    margin: 3px 14px 0 14px;
    line-height: 1.66;
    letter-spacing: 0.03333em;
    text-align: left;
  }
`;

const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

const icon = <CheckBoxOutlineIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const Alert = React.forwardRef((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

export default function AddSup({ depData, fetch }) {
  const config = { headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem("auth")).accessToken}` } };
  const [open, setOpen] = useState(false);
  const [newData, setNewData] = useState({ userid: "", type: 0, deptrelate: "", accept: "" });
  const [depSelect, setDepSelect] = useState([]);
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const toggleDialog = (isOpen) => {
    setOpen(isOpen);
    if (!isOpen) {
      setNewData({ userid: "", type: 0, deptrelate: "", accept: "" });
      setErrors({});
      setDepSelect([]);
    }
  };

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewData((prev) => ({ ...prev, [name]: name === "type" ? +value : value }));
  };

  const handleCheckChange = (event) => {
    const { name, value, type, checked } = event.target;
    setNewData((prev) => ({ ...prev, [name]: type === "checkbox" ? (checked ? "y" : "") : value }));
  };

  const handleDeptChange = (_, newValue) => {
    const selectedIds = newValue.map((option) => option.id);
    setDepSelect(selectedIds);
    setNewData((prev) => ({ ...prev, deptrelate: selectedIds }));
  };

  const validate = () => {
    const validationErrors = {
      userid: !newData.userid,
      deptrelate: !newData.deptrelate.length,
    };
    setErrors(validationErrors);
    return !Object.values(validationErrors).some(Boolean);
  };

  const AddData = async () => {
    if (!validate()) return;
    
    try {
      const response = await axios.post(`${apiUrl}/supervisor`,
        { ...newData, deptrelate: JSON.stringify(newData.deptrelate) },
        config
      );
      if (response.status === 200 || response.status === 201) {
        fetch();
        toggleDialog(false);
        setSnackbar({ open: true, message: "เพิ่มข้อมูลเรียบร้อย!", severity: "success" });
      }
    } catch (error) {
      const errorMessage = error.response?.status === 409 ? "มีข้อมูลนี้ในระบบแล้ว!" : error.response?.status === 404 ? "ไม่พบข้อมูล รหัสพนักงานในระบบ!" : "เกิดข้อผิดพลาดในการเพิ่มข้อมูล";
      setSnackbar({ open: true, message: errorMessage, severity: "error" });
    }
  };

  return (
    <>
      <GlobalStyle />
      <Button className="ADDBtn" variant="outlined" onClick={() => toggleDialog(true)}>เพิ่มข้อมูล</Button>
      <Dialog open={open} onClose={() => toggleDialog(false)} PaperProps={{ component: "form", onSubmit: (e) => { e.preventDefault(); AddData(); } }}>
        <DialogTitle>เพิ่มข้อมูล</DialogTitle>
        <DialogContent>
          <TextField
            sx={{ marginTop: 1 }}
            id="userid"
            name="userid"
            label="รหัสพนักงาน"
            variant="outlined"
            fullWidth
            value={newData.userid}
            onChange={handleChange}
            error={errors.userid}
            helperText={errors.userid ? "โปรดระบุ รหัสพนักงาน" : ""}
          />

          <FormControl fullWidth variant="outlined" error={errors.deptrelate} sx={{ pt: 2 }}>
            <Autocomplete
              multiple
              limitTags={2}
              id="checkboxes-deps"
              options={depData}
              value={depData.filter((dep) => depSelect.includes(dep.id))}
              onChange={handleDeptChange}
              disableCloseOnSelect
              getOptionLabel={(option) => `${option.DepName} (${option.AffName})`}
              renderOption={(props, option, { selected }) => {
                const { key, ...restProps } = props;
                return (
                  <li key={key} {...restProps}>
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {`${option.DepName} (${option.AffName})`}
                  </li>
                );
              }}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => {
                  const { key, ...restProps } = getTagProps({ index });
                  return (
                    <Chip key={key} label={option.DepName} {...restProps} />
                  );
                })
              }
              renderInput={(params) => <TextField {...params} label="แผนกที่ดูแล" placeholder="เลือกแผนกที่ดูแล" />}
              style={{ paddingRight: "10px", width: "100%" }}
            />
            {errors.deptrelate && <p id="deptrelate-helper-text" style={{ color: "red" }}>โปรดเลือก แผนก</p>}
          </FormControl>
          
          <FormControl sx={{ pt: 2 }}>
            <FormLabel id="radio-buttons-group">Type</FormLabel>
            <RadioGroup row name="type" value={newData.type} onChange={handleChange}>
              <FormControlLabel value="0" control={<Radio />} label="Occurrence" />
              <FormControlLabel value="1" control={<Radio />} label="Medication" />
              <FormControlLabel value="2" control={<Radio />} label="Occurrence & Medication" />
            </RadioGroup>
          </FormControl>
          
          <FormControlLabel
            control={
              <Checkbox
                id="accept"
                name="accept"
                checked={newData.accept === "y"}
                onChange={handleCheckChange}
              />
            }
            label="สามารถตอบกลับรายงาน"
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="error" onClick={() => toggleDialog(false)}>ยกเลิก</Button>
          <Button variant="contained" type="submit">เพิ่ม</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </>
  );
}
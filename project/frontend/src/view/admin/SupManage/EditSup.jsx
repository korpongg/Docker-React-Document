import React, { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, FormControl, Autocomplete, Checkbox, Chip, FormLabel, FormControlLabel, RadioGroup, Radio, Button, Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import CheckBoxOutlineIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import axios from "axios";

const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

const icon = <CheckBoxOutlineIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const Alert = React.forwardRef((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

export default function EditSup({ depData, id, fetch }) {
  const config = { headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem("auth")).accessToken}` } };
  const [open, setOpen] = useState(false);
  const [newData, setNewData] = useState({ userid: "", type: 0, deptrelate: [] });
  const [depSelect, setDepSelect] = useState([]);
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [loading, setLoading] = useState(false);

  const FetchSupByID = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/supervisor/${id}`, config);
      if (response.status === 200) {
        const { userid, type, deptrelate } = response.data;
        setNewData({ userid, type, deptrelate });
        setDepSelect(deptrelate);
      }
    } catch (error) {
      console.error("Error fetching supervisor:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDialog = (isOpen) => {
    setOpen(isOpen);
    if (!isOpen) {
      setNewData({ userid: "", type: 0, deptrelate: [] });
      setErrors({});
      setDepSelect([]);
    } else {
      FetchSupByID(id);
    }
  };

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewData((prev) => ({ ...prev, [name]: name === "type" ? +value : value }));
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

  const EditData = async () => {
    if (!validate()) return;

    try {
      const response = await axios.put(`${apiUrl}/supervisor/${id}`,
        { ...newData, deptrelate: JSON.stringify(newData.deptrelate) },
        config
      );
      if (response.status === 200) {
        fetch();
        toggleDialog(false);
        setSnackbar({ open: true, message: "แก้ไขข้อมูลเรียบร้อย!", severity: "success" });
      }
    } catch (error) {
      console.error("Error updating supervisor:", error);
      setSnackbar({ open: true, message: "เกิดข้อผิดพลาดในการแก้ไขข้อมูล", severity: "error" });
    }
  };

  console.log(newData)

  return (
    <>
      <Button className="btnEdit" variant="outlined" onClick={() => toggleDialog(true)}>แก้ไข</Button>
      <Dialog open={open} onClose={() => toggleDialog(false)} PaperProps={{ component: "form", onSubmit: (e) => { e.preventDefault(); EditData(); } }}>
        <DialogTitle>แก้ไขข้อมูล</DialogTitle>
        {loading ? "Loading..." :
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
              {errors.deptrelate && <p style={{ color: "red" }}>โปรดเลือก แผนก</p>}
            </FormControl>
            <FormControl sx={{ pt: 2 }}>
              <FormLabel>Type</FormLabel>
              <RadioGroup row name="type" value={newData.type} onChange={handleChange}>
                <FormControlLabel value="0" control={<Radio />} label="Occurrence" />
                <FormControlLabel value="1" control={<Radio />} label="Medication" />
              </RadioGroup>
            </FormControl>
          </DialogContent>
        }
        <DialogActions>
          <Button variant="contained" color="error" onClick={() => toggleDialog(false)}>ยกเลิก</Button>
          <Button variant="contained" type="submit">บันทึก</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </>
  );
}
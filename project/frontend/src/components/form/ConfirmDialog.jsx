import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function ConfirmDialog({Mode,submitfunction,SubmitMode,Lable}) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
  
      <Button sx={{fontSize:22,width:180,p:0.25,margin:'0 auto',
      
     bgcolor: Mode === "Add" ? "#04a54dff" : "#b8b01fff",
   "&:hover": {
  bgcolor: Mode === "Add" ? "#14974dff" : "#d9a806ff",
},}} variant="contained" color={SubmitMode==="Draft" ? "success" : "success"}   onClick={handleClickOpen}>
        {Lable}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            submitfunction(SubmitMode);
            // const formData = new FormData(event.currentTarget);
            // const formJson = Object.fromEntries(formData.entries());
            // const email = formJson.email;
            // console.log(email);
            handleClose();
          },
        }}
      >
        <DialogTitle sx={{fontFamily:"inherit"}} variant="success" color="success">บันทึก</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{fontFamily:"inherit"}}>
            ต้องการส่งข้อมูลเข้าสู่ระบบและทำการยื่นแบบฟอร์มหรือไม่?
          </DialogContentText>
          {/* <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
          /> */}
        </DialogContent>
        <DialogActions>
          <Button sx={{fontFamily:"inherit",fontSize:22,width:100,p:0.25,color:'black'}} onClick={handleClose}>ยกเลิก</Button>
          <Button sx={{fontFamily:"inherit",fontSize:22,width:120,p:0.25,   backgroundColor: "#061e5fffed",
    "&:hover": {
      backgroundColor: "#047857", // เขียวเข้มขึ้น
    },}} variant="contained" className="ConfirmBTN" type="submit">ยืนยัน</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

import { styled } from "@mui/system";
import Box from "@mui/material/Box";
import Modal from '@mui/material/Modal';
import { Dialog } from "@mui/material";

const NavFormStyle = styled(Box)`
 
  display:flex;
  flex-direction:row;
  justify-content:space-between;
  position: fixed;
  bottom: 0;
  width:100%;
  height:50px;
  background: rgb(255,255,255);
  background: linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 55%, rgba(255,255,255,0) 100%);
  // padding:10px;
  border-radius:5px;
  .StageNo{
    width:35px;
    height:35px;
  }

`
export default NavFormStyle;
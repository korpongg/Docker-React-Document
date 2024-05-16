import { styled } from "@mui/system";
import Box from "@mui/material/Box";
import Modal from '@mui/material/Modal';
import { Dialog } from "@mui/material";

const OccurrenceStyle = styled(Box)`
  background:#ffffff;
  color:#000000;
  height:80vh;
  width:1000px;
  // padding:5px;
  display:flex;
  flex-direction:column;
  border-radius:5px;

  .MainContainer{
    display:flex;
    flex-direction:column;
    // justify-content:center;
    position: relative;
    width: 100%; 
    height: 100%; 
    overflow:scroll;
    // border: 1px solid #000;
  }
  .FormHeader{
    display:flex;
  flex-direction:row;
  justify-content:space-between;
  align-items:center;
  font-size:24px;
  // position: absolute;
  // bottom: 0;
  // width:100%;
  height:50px;
  padding:8px;
  padding-left:15px;
  background: rgb(155,164,147);
  background: linear-gradient(90deg, rgba(155,164,147,1) 0%, rgba(193,194,178,1) 100%);
    color:#000000;
    border-top-left-radius:5px;
    border-top-right-radius:5px;
  }
  .FormFooter{
    display:flex;
  flex-direction:row;
  justify-content:space-between;
  align-items:center;
  font-size:24px;
  // position: absolute;
  // bottom: 0;
  // width:100%;
  height:50px;
  padding:8px;
  padding-left:15px;
  background: rgb(155,164,147);
  background: linear-gradient(90deg, rgba(155,164,147,1) 0%, rgba(193,194,178,1) 100%);
    color:#000000;
  }
  .TopicHeader{
    display:flex;
    background: rgb(221,230,214);
    // background: linear-gradient(180deg, rgba(231,230,214,1) 0%, rgba(254,254,254,1) 90%, rgba(255,255,255,0) 100%);
    color:#000000;
    font-size:18px;
    padding:10px;
  }
`
export default OccurrenceStyle;
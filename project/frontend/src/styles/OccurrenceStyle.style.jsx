import styled from "styled-components";
import Box from "@mui/material/Box";
import Modal from '@mui/material/Modal';
import { Dialog } from "@mui/material";

export const OccurrenceStyle = styled(Box)`
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
  .CheckBoxMain{
    padding-left:25px;
  }
  .ContentBoxMain{
    display:flex;
    flex-direction:column;
    padding-left:25px;
    padding-right:25px;
    padding-top:10px;
    padding-bottom:10px;
  }
  .FormFooter{
    display:flex;
  flex-direction:row;
  justify-content:space-between;
  align-items:center;
  font-size:12px;
  // position: absolute;
  // bottom: 0;
  // width:100%;
  height:25px;
  padding:12px;
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
  .DatetimeBox{
    width:100%;
    display:flex;
    flex-direction:column;
    justify-content:space-between;
    border: 0;
    border-bottom: 1px solid rgb(118, 118, 118);
    align-items:left;
    // padding:10px;
    font-size:18px;
    background: #f1f1f1;
    span{
      padding-left:12px;
      padding-top:10px;
      font-size:12px;
      text-align:left;
      color: rgba(51, 51, 51, 0.87);
    }
  }
  .AutoBox{
    width:100%;
    height:80px;
    display:flex;
    flex-direction:column;
    justify-content:center;
    border: 0;
    border-bottom: 1px solid rgb(118, 118, 118);
    align-items:left;
    // padding:10px;
    font-size:18px;
    background: #f1f1f1;
    // span{
    //   padding-left:12px;
    //   padding-top:10px;
    //   font-size:12px;
    //   text-align:left;
    //   color: rgba(51, 51, 51, 0.87);
    // }
  }
  .DatetimeInput{
    font: inherit;
    letter-spacing: inherit;
    color: rgba(51, 51, 51, 0.87);
    padding: 4px 0 5px;
    border: 0;
    // border-bottom: 1px solid rgb(118, 118, 118);
    box-sizing: content-box;
    background: #f1f1f1;
    height: 1.4375em;
    margin: 0;
    -webkit-tap-highlight-color: transparent;
    // display: block;
    // min-width: 0;
    width: 250px;
    -webkit-animation-name: mui-auto-fill-cancel;
    animation-name: mui-auto-fill-cancel;
    -webkit-animation-duration: 10ms;
    animation-duration: 10ms;
    padding-top: 5px;
    padding-right: 12px;
    padding-bottom: 8px;
    padding-left: 12px;
  }
  input[type="datetime-local"]::-webkit-calendar-picker-indicator {
    filter: invert(0.5);
}
  .DatetimeInput:hover{
    background rgb(133, 133, 133))
  }
  .SubmitBTN{
    display:flex;
    justify-content:center;
    align-items: center;

    width:180px;
    height:40px;
    border:2px solid #ffffff;
    border-radius:3px;
    background:#4ecf4e;
    color:#ffffff;
    font-size:30px;
    padding:unset;
    transition:0.35s;
  }
  .SubmitBTN:hover{
    background:#559f55;
    color:#f1f1f1;
  }
  .ConfirmBTN{
    display:flex;
    justify-content:center;
    align-items: center;

    width:180px;
    height:40px;
    border:2px solid #ffffff;
    border-radius:3px;
    background:#4ecf4e;
    color:#ffffff;
    font-size:30px;
    padding:unset;
    transition:0.35s;
  }
`;
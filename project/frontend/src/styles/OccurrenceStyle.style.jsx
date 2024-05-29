import styled from "styled-components";
import Box from "@mui/material/Box";
import Modal from '@mui/material/Modal';
import { Dialog } from "@mui/material";

export const OccurrenceStyle = styled(Box)`
  background:#ffffff;
  color:#000000;
  // min-height:88vh;
  width:960px;
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
    min-height:400px;
    // overflow:scroll;
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
    position:;
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
    // background: #f1f1f1;
    background:unset;
    padding-left:12px;
    padding-right:50px;
    span{
      padding-left:12px;
      padding-top:10px;
      font-size:12px;
      text-align:left;
      color: rgba(51, 51, 51, 0.87);
    }
    input{
      background:unset;
    }
  }
  input,textarea{
    background:unset;
  }
  input:disabled{
    background:#f1f1f1;
  }
  textarea:disabled{
    background:#f1f1f1;
  }
  .MuiInputBase-root{
    background:unset;
  }
  .MuiInputBase-root:hover{
    background:unset;
  }
  .MuiInputBase-root:focused{
    background:unset;
  }
  .MuiFilledInput-root{
    background:unset;
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
    // background: #f1f1f1;
    background:unset;
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
    // width:50px;
    color: rgba(51, 51, 51, 0.87);
    padding: 4px 0 5px;
    border: 0;
    border:1px solid #a6a6a6;
    // border: 1px solid rgb(118, 118, 118);
    border-radius:3px;
    box-sizing: content-box;
    // background: #f1f1f1;
    height: 1.4375em;
    margin: 0;
    -webkit-tap-highlight-color: transparent;
    // display: block;
    // min-width: 0;
    width: 290px;
    -webkit-animation-name: mui-auto-fill-cancel;
    animation-name: mui-auto-fill-cancel;
    -webkit-animation-duration: 10ms;
    animation-duration: 10ms;
    padding-top: 5px;
    padding-right: 12px;
    padding-bottom: 8px;
    padding-left: 12px;
    cursor:text;
  }
  input[type="datetime-local"]::-webkit-calendar-picker-indicator {
    filter: invert(0.5);
    cursor:pointer;
}
  .DatetimeInput:disabled{
    // background: unset;
    background: #f1f1f1
    // cursor:pointer;
  }
  .DatetimeInput:hover{
    background :#f5f5f5;
  }
  .DatetimeInput:disabled:hover {
    background: #f1f1f1;
    cursor:unset;
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

  .FormInputBorder{
    // width:95%;
    background: unset;
    border: unset;
  }
  .SETERROR{
    background: #ffe5e580;
    border: 1px solid #ff000080;
    border-radius:8px;
  }
  .RadioBoxED{
    width:100%;
    height:100%;
  }

  .ReportViewStyle{
    color:red;
  }


  .GeneralBox{
    // border:1px solid green;
    width:940px;
    display:flex;
    // margin-bottom:10px;
  }
  .ContentBox{
    // border:1px solid red;
    width:100%;
    // display:flex;
    // justify-content: flex-start;
    // text-align: left;
    // align-items: center;
    // span{
    //   border:1px solid blue;
    // }
  }
  .ContentRow{
    // border:1px solid red;
    width:100%;
    display:flex;
    justify-content: flex-start;
    text-align: left;
    height:50px;
    align-items: center;
    // span{
    //   border:1px solid blue;
    // }
  }
  
  .w30P{
    // border:1px solid blue;
    // padding-left:35px;
    font-size:18px;
    width:30%;
    height:50px;
    display:flex;
    // justify-content: flex-start;
    justify-content: center;
    align-items: center;
    // text-align: left;
  }
  .w70P{
    display:flex;
    justify-content:space-between;
    align-items: center;
    // border:1px solid blue;
    width:70%;
    // padding:5px;
    height:50px;
  }
  .TextInputContent{
    font-family:inherit;
    padding:5px;
    font-size:16px;
    width:100%;
    color:#000;
    // color: rgba(51, 51, 51, 0.87);
    margin-right:6px;
    border:1px solid #a6a6a6;
    border-radius:3px;
    // height:30px;
  }
  .TextInputContent:disable{
    color: rgba(51, 51, 51, 0.87);
  }
  .SyncBTN{
    margin:15px;
    color:#fff;
    width:35px;
    height:35px;
    display:flex;
    justify-content: center;
    align-items: center;
  }
  .AreaContentBox{
    // width:945px;
    // border:1px solid blue;
    display:flex;
    flex-direction:column;
    justify-content: center;
    padding-left:40px;
  }
  .TextAreaTopic{
    display:flex;
    justify-content: flex-start;
    // justify-content: center;
    align-items: center;
    text-align: left;
    padding-left:15px;
    width:280px;
  }

  .TextAreaInputContent{
    font-family:inherit;
    padding:5px;
    font-size:16px;
    width:860px;
    color:#000;
    margin:6px;
    border:1px solid #a6a6a6;
    border-radius:3px;
    // height:30px;
    display:flex;
    // justify-content: flex-start;
    justify-content: center;
    align-items: center;
    // text-align: left;
  }

  .SelectInput{
    padding:5px;
    font-size:16px;
    background:unset;
    color:inherit;
    font-family:inherit;
    border:1px solid #a6a6a6;
    border-radius:3px;
    width:100%;
    margin-right:6px;
    cursor:pointer;
  }

  .SelectInputDominant{
    padding:5px;
    font-size:18px;
    background:#f1f1f1;
    color:inherit;
    font-family:inherit;
    border:1px solid #a6a6a6;
    border-radius:3px;
    width:100%;
    margin-right:6px;
    cursor:pointer;
  }
  
  .ListSelectTable{
    margin:5px;
    border:1px solid #a6a6a6;
    height:220px;
    overflow:scroll;
  }

  .ListSelectTable_Row{
    display:flex;
    width:100%;
    // border-bottom:1px solid #a6a6a6;
  }

  .ListSelectTable_Row:hover{
    background:rgb(243 243 243);
  }

  .ListSelectTable_Row:first-child{
    background:rgb(243 243 243);
    // width:100%;
    border-bottom:1px solid #a6a6a6;
    // border-bottom:unset ;
    position: -webkit-sticky;
    position: sticky;
    top: 0;
  }

  .ListSelectTable_Cell{
    width:100%;
    // border:1px solid #fe0;
    padding:4px;
  }
`;
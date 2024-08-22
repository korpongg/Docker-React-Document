import { Paper, Box, FormControl, TableContainer, Dialog } from "@mui/material";
import styled from "styled-components";

export const EventBox = styled(Box)`
  display: block;
  justify-content: center;
  background-color: #fff;
  border:2px solid rgb(170 170 170);
  border-radius: 14px;
  padding: 30px;
  width: 80vw;
  min-height: 60vh;
  position: relative;

  .viewRoom {
    position: absolute;
    left: 4px;
    top: 4px;
  }

  h1 {
    font-size: 2rem;
    margin-top: 0;
  }

  .MuiDataGrid-toolbarContainer .MuiButton-root {
    font-family: inherit;
    font-size: 16px;
  }

  .add-button {
    border-radius: 8px;
  }

  .odd-row {
    background: #fff;
  }
  .even-row {
    background: #f3f2fa;
  }
  .alert-row {
    background: #ff0000 !important;
  }

  .MuiDataGrid-root {
    font-size: 19px;
    font-size: 16px;
  }

  .MuiDataGrid-root,
  .MuiDataGrid-columnHeader,
  .MuiDataGrid-cell,
  .MuiTablePagination-selectLabel,
  .MuiTablePagination-displayedRows {
    font-family: inherit;
    outline: unset !important;
  }

  .post-status {
    border: 1px solid #fff;
    border-radius: 10px;
    color: #fff;
    font-size: 21px;
    font-size: 18px;
    padding: 6px 10px;
  }

  .post-status.new {
    background: cadetblue;
    text-align: center;
    box-shadow: 1px 1px 2px 0px #5f9ea0c4;
    // -webkit-animation: glow 1s ease-in-out infinite alternate;
    // -moz-animation: glow 1s ease-in-out infinite alternate;
    // animation: glow 1s ease-in-out infinite alternate;
  }
  .post-status.report {
    background: blueviolet;
    box-shadow: 1px 1px 2px 0px #8000808c;
  }
  .post-status.repeat {
    background: black;
    box-shadow: 1px 1px 2px 0px #0000008c;
  }
  .post-status.in-progress {
    background: orange;
    box-shadow: 1px 1px 2px 0px #ffa5008c;
  }
  .post-status.success {
    background: green;
    box-shadow: 1px 1px 2px 0px #0080008c;
  }
  .post-status.cancel {
    background: red;
    box-shadow: 1px 1px 2px 0px #ff0000c4;
  }

  @-webkit-keyframes glow {
    from {
      text-shadow: 0 0 0px #fff, 0 0 2px #fff, 0 0 6px #e60073, 0 0 11px #e60073,
        0 0 17px #e60073;
    }
    to {
      text-shadow: 0 0 2px #fff, 0 0 4px #ffd700, 0 0 8px #ffd700,
        0 0 14px #ffd700, 0 0 20px #ffd700;
    }
  }

  .rotate-icon {
    transform: scaleX(-1);
  }

  @media screen and (max-width: 1600px) {
    margin-top: 40px;
    width: 86vw;
  }
`;

export const TranferDialogBox = styled(Dialog)`
  font-size: 16px;

  #tranfer-dialog-title, label, pre, .MuiDataGrid-toolbarContainer .MuiButton-root, button, textarea, .MuiTypography-root, .MuiSelect-select {
    font-family: 'Prompt', sans-serif !important;
  }

  pre {
    margin: 0;
  }

  .odd-row {
    background: #f3f2fa;
  }
  .even-row {
    background: #fff;
  }
  .alert-row {
    background: #ff0000 !important;
  }

  .validate {
    color: red;
    font-family: 'Prompt', sans-serif;
    font-size: 14px;
  }

  .MuiDataGrid-root,
  .MuiDataGrid-columnHeader,
  .MuiDataGrid-cell,
  .MuiTablePagination-selectLabel,
  .MuiTablePagination-displayedRows {
    font-family: 'Prompt', sans-serif;
    outline: unset !important;
  }
  .EventBox{
    border:2px solid #e9e9e9;
    margin:2.5px;
    background:unset;
  }
  .EventRow{
    display:flex;
    width:100%;
    border-bottom:1px solid #e9e9e9;
  }
  .EventRow:last-child{
    border:unset;
  }
  .EventRow #ListSelect .ListSelectTable_Row {
    background: #f3f2fa;
  }
  .EventRow #ListSelect hr {
    border-color: #a6a6a6;
  }
  .EventCol{
    display:flex;
    width:50%;
    border-right:3px solid #e9e9e9;
  }
  .EventCol:last-child{
    border:unset;
  }

  .EventCell{
    border-right:3px solid #e9e9e9;
    padding:5px;
    width:100%;
  }
  .EventCell:last-child{
    border:unset;
  }
  .EventCell.view {
    background: #f3f2fa;
  }
  .Topic{
    width:40%;
    background:#e9e9e9;
  }
  .Content{
    width:60%;
  }
  .AreaTopic{
    width:100%;
    background:#e9e9e9;
  }
  .AreaContent{
    width:100%;
    height:100px;
    overflow:scroll;
  }

  .MuiInputBase-root.MuiOutlinedInput-root.Mui-disabled.Mui-disabled {
    background: whitesmoke;
    div, textarea {
      color: #555555;
      -webkit-text-fill-color: unset;
    }
  }

  @media screen and (max-width: 901px) {
    #tranfer-dialog-title {
      font-size: 1.125rem;
      // color:red;
    }
  }
`;
import { Paper, Box, FormControl, TableContainer, Dialog } from "@mui/material";
import styled from "styled-components";

export const DashboardBox = styled(Box)`
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
    text-align: center;
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
  .post-status.draft {
    background: dimgray;
    box-shadow: 1px 1px 2px 0px #494949cc;
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

  .HighLV {
    background: red;
    color: white;
    padding: 5px 15px;
    border-radius: 10px;
  }

  @media screen and (max-width: 1600px) {
    margin-top: 40px;
    width: 86vw;
  }

  @media screen and (max-width: 901px) {
    padding: 30px 10px;
    h1 {
      font-size: 1.375rem;
    }
  }
`;

export const SearchContainer = styled(Box)`
  border-radius: 16px;
  border: 1px solid #c9c9c9;
  margin: auto;
  margin-bottom: 15px;
  padding: 20px;
  width: 80%;

  .MuiInputBase-input.MuiOutlinedInput-input {
    // padding: 8px 12px;
  }

  input[type="date"]::-webkit-calendar-picker-indicator {
    cursor: pointer;
    border-radius: 4px;
    margin-right: 2px;
    opacity: 0.6;
    filter: invert(0.8);
  }

  input[type="date"]::-webkit-calendar-picker-indicator:hover {
    opacity: 1
  }
`;

export const IncidentDialog = styled(Dialog)`
  #incident-dialog-title {
    font-family: inherit;
  }

  #incident-dialog-title, label, .MuiButton-root, button, textarea, .MuiTypography-root, .MuiSelect-select {
    font-family: 'Prompt', sans-serif !important;
  }
`;

export const TranferDialogBox = styled(Dialog)`
  #tranfer-dialog-title {
    font-family: inherit;
  }

  .odd-row {
    background: #f3f2fa;
  }
  .even-row {
    background: #fff;
  }
  .alert-row {
    background: #ff0000a6 !important;
  }

  .MuiDataGrid-toolbarContainer .MuiButton-root {
    font-family: inherit;
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
    padding: 6px 10px;
  }
  .post-status.new {
    background: cadetblue;
    text-align: center;
    box-shadow: 1px 1px 2px 0px #5f9ea0c4;
  }
  .post-status.in-progress {
    background: orange;
    box-shadow: 1px 1px 2px 0px #ffa5008c;
  }
  .post-status.report {
    background: blueviolet;
    box-shadow: 1px 1px 2px 0px #8000808c;
  }
  .post-status.repeat {
    background: black;
    box-shadow: 1px 1px 2px 0px #0000008c;
  }

  @media screen and (max-width: 901px) {
    #tranfer-dialog-title {
      font-size: 1.125rem;
    }
  }
`;
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
  .ItemBox {
    display:flex;
    justify-content: center;
    align-items: center;
    width:100%;
    flex-wrap: wrap;
  }
  .LinkTo {
    display:flex;
    justify-content: center;
    align-items: center;
    color: #525252;
    background:#f4ffff;
    padding: 10px;
    width:80%;
    height:60px;
    font-size: 1.2rem;
    letter-spacing: 0.1rem;
    cursor:pointer;
    border:2px solid rgba(0, 0, 0, 0.2);
    border-radius:15px;
    margin:5px;
    box-shadow: rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
  }
  .LinkTo span {
    width: 100%;
    max-height:100%;
    display: block;
    white-space: wrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
  }
  .LinkTo:hover {
    background:#dafffd;
  }

  input[type="radio"], label {
    cursor: pointer;
    margin-right: 6px;
  }

  @media screen and (max-width: 901px) {
    #tranfer-dialog-title {
      font-size: 1.125rem;
    }
  }
`;
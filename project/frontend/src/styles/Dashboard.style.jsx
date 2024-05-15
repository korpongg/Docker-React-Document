import { Box } from "@mui/material";
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
    font-size: 17px;
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
    padding: 6px 10px;
  }

  .post-status.new {
    background: #1976d2;
    text-align: center;
    box-shadow: 1px 1px 2px 0px #1976d28c;
    // -webkit-animation: glow 1s ease-in-out infinite alternate;
    // -moz-animation: glow 1s ease-in-out infinite alternate;
    // animation: glow 1s ease-in-out infinite alternate;
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
  .post-status.in-progress {
    background: orange;
    box-shadow: 1px 1px 2px 0px #ffa5008c;
  }
  .post-status.success {
    background: green;
    box-shadow: 1px 1px 2px 0px #0080008c;
  }
  .post-status.cancel-request {
    background: red;
    box-shadow: 1px 1px 2px 0px #ff00008c;
  }

  .rotate-icon {
    transform: scaleX(-1);
  }

  @media screen and (max-width: 1600px) {
    margin-top: 40px;
    width: 86vw;
  }
`;

export const VNBox = styled(Box)`
  // min-height: 30vh;
  max-height: 90vh;
  width: 100%;
  overflow: hidden;
  overflow-y: auto;
  margin: 20px 0;

  div.item {
    cursor: help;
    // background: black;
    background: darkslategray;
    color: white;
    border: 1px solid #fff;
    border-radius: 20px;
    // font-size: 21px;
    padding: 6px 10px;
    display: block;
    text-align: center;
    cursor: pointer;
  }
  div.item.df {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }
  div.item.use {
    background: #a91b0d;
  }
  div.item.available {
    background: green;
  }
  div.item.allow {
    background: #FF8000;
  }
  div.item.cleaning {
    background: #00A2E8;
  }
  div.item.ma {
    background: #000;
  }
`;
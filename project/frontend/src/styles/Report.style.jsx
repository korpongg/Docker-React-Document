import { Box, Button } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import styled from "styled-components";

export const ReportBox = styled(Box)`
  position: relative;
  display: block;
  justify-content: center;
  background-color: #fff;
  border-radius: 14px;
  padding: 10px;
  width: 90vw;
  margin-bottom: 50px;
  text-align: center;

  h1 {
    font-size: 2rem;
    line-height: 1;
    margin: 0;
  }
  h1 span {
    cursor: pointer;
    text-decoration: underline red;
    text-transform: uppercase;
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

  .ai-center {
    align-items: center;
  }

  .jc-start {
    justify-content: start;
  }
  .jc-end {
    justify-content: end;
  }

  .textAL {
    text-align: left;
  }

  .contentBox {
    display: flex;
    flex-direction: column;
    border: 2px solid #ebebeb;
    border-radius: 10px;
    margin: 5px;
  }

  .contentBoxRow {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
  .contentBoxRow .contentSubHead {
    background: #4682b4;
    color: #fff;
    font-size: 16px;
    margin: 0;
  }
  .contentBoxRow.Heparin > div {
    .contentBoxLeft {
      border-right: none;
    }
    .contentBoxRight {
      border-left: 1px solid #ebebeb;
    }
    .contentBoxLeft,
    .contentBoxRight {
      padding: 5px 20px;
    }
  }

  .contentBoxDetail {
    display: flex;
  }

  .contentBoxLeft {
    display: flex;
    flex-direction: column;
    text-align: left;
    border-right: 1px solid #ebebeb;
    line-height: 1.2;
  }
  .contentBoxLeft > div {
    padding: 5px 20px;
  }
  .contentBoxLeft .rate {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border-bottom: 1px solid #ebebeb;
  }

  .contentBoxRight {
    display: flex;
    flex-direction: column;
    justify-content: center;
    line-height: 1.2;
    padding: 10px 0;
  }
  .contentBoxRight.nopad {
    padding: 0;
  }
  .contentBoxRight.nopad > div {
    padding: 10px 0;
  }
  .contentBoxRight.nopad > div:first-child {
    border-bottom: 1px solid #ebebeb;
  }
  .contentBoxRight p {
    line-height: 1;
    margin: 0;
  }
  .contentBoxRight .dose {
    color: #ff0000;
    font-size: 36px;
  }

  ${Array.from(
    { length: 100 },
    (_, index) =>
      `.w${(index + 1) * 1}` +
      ` {
        width: ${(index + 1) * 1}%;
      }`
  ).join("\n")}

  @media screen and (max-width: 360px) {
    .contentBoxRow.Heparin .contentBoxDetail {
      flex-direction: column;
    }
    .contentBoxRow.Heparin .contentBoxDetail > div {
      width: 100%;
    }
    .contentBoxRow.Heparin > div {
      .contentBoxRight {
        border-left: none;
        border-top: 1px solid #ebebeb;
      }
      .contentBoxLeft,
      .contentBoxRight {
        padding: 5px 0;
      }
    }
  }

  @media screen and (max-width: 901px) {
    h1 {
      font-size: 1.625rem;
    }
  }

  @media screen and (max-width: 1048px) {
    flex-direction: column !important;
    .contentBox {
      margin: 5px 0;
      width: 99%;
    }
  }

  @media screen and (max-width: 1600px) {
    margin-top: 40px;
    width: 86vw;
  }
`;

export const InputBox = styled(Box)`
  select#reportType {
    background: white;
    border-radius: 7px;
    color: #000;
    cursor: pointer;
    font-family: inherit;
    padding: 10px;
    width:150px;
    width:-webkit-fill-available;
  }

  input[type="date"] {
    color: black;
    border: 1px solid #80808061;
    background: unset;
    width:150px;
    width:-webkit-fill-available;
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

  @media screen and (max-width: 768px) {
  display:flex;
  flex-direction:column;
  button {
    margin-top:10px;
  }
    padding: 0;
  }
`;
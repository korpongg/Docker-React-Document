import Box from "@mui/material/Box";
import styled from "styled-components";

export const SupBox = styled(Box)`
  width: 75vw;
  color:#000;
  margin-top: 10px;

  @media screen and (max-width: 680px){
    width: 95vw;
  }
  .SupManageFrame {
    width: 100%;
    background:#fff;
    border: 2px solid #c8d5d5;
    border-radius: 8px;
    max-height: 90vh;
  }
  .SupHeader{
    display:flex;
    padding-top:20px;
    padding-bottom:15px;
    padding-left:20px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    font-size:24px;
  }
  .SupToolbox {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  .ADDBtn {
    color: white;
    background: blue;
    margin: 0 5px;
    padding: 8px 18px;
  }
  .btnEdit, .btnDelete {
    color: white;
    background: orange;
    border: 1px solid orange;
    margin: 1px 5px;
  }
  .ADDBtn:hover {
    background: darkblue;
  }
  .btnEdit:hover {
    background: coral;
    border: 1px solid coral;
  }
  .btnDelete {
    background: red;
    border: 1px solid red;
  }
  .btnDelete:hover {
    background: crimson;
    border: 1px solid red;
  }

  .InputBox {
    margin-top: 5px;
  }
  .MuiGrid2-root .GridCell {
    border: 1px solid blue;
    div {
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .JCL{
      justify-content: left;
      text-align:left;
    }
  }

  .SupTable {
    max-height: 64vh;
    overflow: auto;
  }
`;
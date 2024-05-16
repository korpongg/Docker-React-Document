import { styled } from "styled-components";
import Box from "@mui/material/Box";

export const ItemStyle = styled(Box)`
  font-family:inherit;
  width:65vw;
  max-width:1280px;
  
  .HeaderItem {
    display:flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1.75rem;
    color: #525252;
    width:100%;
  }
  .HeaderItem span {
    margin-left:25px;
    margin-right:25px;
  }
  
  .ItemBox {
    display:flex;
    justify-content: center;
    align-items: center;
    width:100%;
    flex-wrap: wrap;
  }

  .IBW80 {
    width:80% !important;
  }

  .Item {
    border-radius:8px;
    width:unset;
    height:50px;
    display:flex;
    justify-content: center;
    align-items: center;
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

  .LinkToMNG {
    display:flex;
    // display: inline-block;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #525252;
    background:#f4ffff;
    padding: 10px;
    width:150px;
    height:150px;
    font-size: 1rem;
    letter-spacing: 0.1rem;
    cursor:pointer;
    border:2px solid rgba(0, 0, 0, 0.2);
    border-radius:15px;
    margin:5px;
    box-shadow: rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
  }
  .LinkToMNG span {
    width: 150px;
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
    padding:5;
  }
  .LinkToMNG img {
    width: 75px;
    padding:10px;
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
    padding:5;
  }
  .LinkToMNG:hover {
    background:#dafffd;
  }
  
  @media screen and (max-width: 680px){
    width:98vw;

    .ItemBox {
      display:flex;
      justify-content: center;
      align-items: center;
      width:100%;
    }
  }
`;
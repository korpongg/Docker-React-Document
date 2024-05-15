import { styled } from "styled-components";
import Box from "@mui/material/Box";

export const ItemStyle = styled(Box)`
    font-family:inherit;
    // border:1px solid #000;
    width:65vw;
    max-width:1280px;
    @media screen and (max-width: 680px){
    width:98vw;
    .ItemBox{
        display:flex;
        justify-content: center;
        align-items: center;
        // border:1px solid #000;
        width:100%;
    }
    }
    .HeaderItem{
    display:flex;
    // justify-content: center;
    justify-content: space-between;
    align-items: center;
    font-size: 1.75rem;
    color: #525252;
    width:100%;
    // padding-left:20px;
    // padding-right:20px;
    // border:1px solid #000;
    }
    .HeaderItem span{
    margin-left:25px;
    margin-right:25px;
    }

  .ItemBox{
    display:flex;
    justify-content: center;
    align-items: center;
    // border:1px solid #000;
    width:100%;
    // height:70vh;
    flex-wrap: wrap;
    // margin-left:20px;
    // margin-right:20px;
  }
  .IBW80{
    width:80% !important;
  }
  .Item{
    // border:1px solid #000;
    border-radius:8px;
    width:unset;
    height:50px;
    // padding:10px;
    // margin:5px;
    display:flex;
    justify-content: center;
    align-items: center;
  }
  .LinkTo{
    display:flex;
    // display: inline-block;
    justify-content: center;
    align-items: center;
    color: #525252;
    background:#f4ffff;
    padding: 10px;
    width:80%;
    height:60px;
    // overflow:hidden;
    // padding-left: 55px;
    // padding-right: 55px;
    font-size: 1.2rem;
    // font-weight: 600;
    letter-spacing: 0.1rem;
    // text-decoration: none;
    // text-transform: uppercase;
    cursor:pointer;
    border:2px solid rgba(0, 0, 0, 0.2);
    border-radius:15px;
    margin:5px;
    box-shadow: 
      // rgba(0, 0, 0, 0.4) 0px 2px 4px, 
      // rgba(0, 0, 0, 0.3) 0px 7px 8px -3px;
    rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
  }
  .LinkTo span{
    width: 100%;
    max-height:100%;
    display: block;
    // justify-content: center;
    // align-items: center;
    white-space: wrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
    // margin-top:10px;
    // margin-bottom:10px;
  }
  .LinkTo:hover{
    // color: #fff;
    background:#dafffd;
    // padding: 0 25px;
    // font-size: 1.875rem;
    // font-weight: 600;
    // letter-spacing: 0.1rem;
    // text-decoration: none;
    // text-transform: uppercase;
    // cursor:pointer;
  }


  .LinkToMNG{
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
    // overflow:hidden;
    // padding-left: 55px;
    // padding-right: 55px;
    font-size: 1rem;
    // font-weight: 600;
    letter-spacing: 0.1rem;
    // text-decoration: none;
    // text-transform: uppercase;
    cursor:pointer;
    border:2px solid rgba(0, 0, 0, 0.2);
    border-radius:15px;
    margin:5px;
    box-shadow: 
      // rgba(0, 0, 0, 0.4) 0px 2px 4px, 
      // rgba(0, 0, 0, 0.3) 0px 7px 8px -3px;
    rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
  }
  .LinkToMNG span{
    width: 150px;
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
    padding:5;
  }
  .LinkToMNG img{
    width: 75px;
    padding:10px;
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
    padding:5;
  }
  .LinkToMNG:hover{
    // color: #fff;
    background:#dafffd;
    // padding: 0 25px;
    // font-size: 1.875rem;
    // font-weight: 600;
    // letter-spacing: 0.1rem;
    // text-decoration: none;
    // text-transform: uppercase;
    // cursor:pointer;
  }
  .MuiDialogContent-root .SyncDialog .SyncBTN {
    background: red;
    border: 1px solid red;
    color: white;
    padding: 8px 16px;
    margin: 8px;
    cursor: pointer;
  }
  
  .MuiDialogContent-root .SyncDialog .SyncBTN:hover {
    background: darkred;
  }
`;
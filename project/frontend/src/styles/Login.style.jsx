import styled from "styled-components";
import Box from "@mui/material/Box";

export const LoginBox = styled(Box)`
  text-align: center;

  .login {
    overflow: hidden;
    background-color: white;
    padding: 44px;
    border-radius: 10px;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 480px;
    transform: translate(-50%, -50%);
    transition: transform 300ms, box-shadow 300ms;
    box-shadow: 5px 5px 10px 0px rgb(0 184 255 / 30%);
  }
  .login::before, .login::after {
    content: "";
    position: absolute;
    width: 730px;
    height: 730px;
    border-top-left-radius: 40%;
    border-top-right-radius: 45%;
    border-bottom-left-radius: 35%;
    border-bottom-right-radius: 40%;
    z-index: -1;
  }
  .login::before {
    left: 35%;
    bottom: -130%;
    background-color: #40e0d0;
    animation: wawes 5s infinite linear;
  }
  .login::after {
    left: 15%;
    bottom: -125%;
    background-color: #87cede3b;
    animation: wawes 7s infinite;
  }

  .login h1 {
    color: #5b5b5b;
    font-size: 26px;
    line-height: 1;
    margin: 0 0 20px 0;
    text-align: center;
  }

  .login > input {
    font-family: 'DB-Helvethaica-X', 'Kanit', sans-serif;
    border-radius: 5px;
    font-size: 20px;
    background: white;
    color: black;
    width: 80%;
    border: 1px solid #ffd1fe;
    padding: 10px 10px;
    margin: 15px 0;
  }
  .login > input#userid {
    margin-top: 15px;
  }
  .login > input#password {
    margin-bottom: 15px;
  }

  .login > button {
    font-family: 'DB-Helvethaica-X', 'Kanit', sans-serif;
    cursor: pointer;
    color: #fff;
    font-size: 18px;
    text-transform: uppercase;
    width: max-content;
    border: 0;
    padding: 10px 20px;
    margin: 20px 0 0 0;
    border-radius: 5px;
    background-color: #57b846;
    transition: background-color 300ms;
  }
  .login > button:hover {
    background-color: #ed143d;
  }

  @media screen and (max-width: 560px) {
    .login {
        width: 80vw;
        padding: 40px 30px 30px 30px;
    }
  }

  @keyframes wawes {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;
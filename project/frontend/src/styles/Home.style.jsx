import { styled } from "styled-components";
import Box from "@mui/material/Box";

export const ItemStyle = styled(Box)`
font-family: inherit;
width: 65vw;
max-width: 1280px;

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

.LinkToMNG {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #525252;
  background: #f4ffff;
  padding: 10px;
  width: 165px;
  height: 165px;
  font-size: 1rem;
  letter-spacing: 0.1rem;
  cursor: pointer;
  border: 2px solid rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  margin: 10px 20px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
  position: relative;
  transition: transform 0.8s;
  transform-style: preserve-3d;
  perspective: 1000px;
}
.LinkToMNG img {
  width: 125px;
}
.LinkToMNG span {
    font-size: 18px;
  width: 150px;
  display: block;
  text-align: center;
}

.flip-card-front, .flip-card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    border: 2px solid rgba(0, 0, 0, 0.2);
    border-radius: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.flip-card-front {
    color: black;
}

.flip-card-back {
    background-color: dodgerblue;
    color: white;
    transform: rotateY(180deg);
}

.LinkToMNG:hover {
  background:#dafffd;
  transform: rotateY(180deg);
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
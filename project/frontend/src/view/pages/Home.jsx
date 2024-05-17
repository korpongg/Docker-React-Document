import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { ItemStyle } from '../../styles/Home.style';
import occurrence from '../../assets/occurrence.png';
import Medication from '../../assets/medication.png';

const Home = () => {
  const navigate = useNavigate();

  return (
    <ItemStyle>
      <Box className="ItemBox">
        <Box className="ItemBox IBW80">
          <Box className="LinkToMNG" onClick={() => navigate(`/occurrence`)} >
            <Box className="flip-card-front">
              <img src={occurrence} alt="Avatar" />
            </Box>
            <Box className="flip-card-back">
              <span>การรายงานเหตุการณ์ (Occurrence Report)</span>
            </Box>
          </Box>
          <Box className="LinkToMNG" onClick={() => navigate(`/medication`)} >
            <Box className="flip-card-front">
              <img src={Medication} alt="Avatar" />
            </Box>
            <Box className="flip-card-back">
              <span>การายงานความคลาดเคลื่อนทางยา (Medication Errors Report)</span>
            </Box>
          </Box>
        </Box>
      </Box>
    </ItemStyle>
  )
}

export default Home;
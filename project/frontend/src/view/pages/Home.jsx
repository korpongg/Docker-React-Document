import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Divider from '@mui/material/Divider';
import { ItemStyle } from '../../styles/Test.style';
import occurrence from '../../assets/occurrence.png';
import Medication from '../../assets/medication.png';

const Home = () => {
  const navigate = useNavigate();

  return (
    // <ItemStyle>
    //   <Box className="ItemBox">
    //     <Box className="ItemBox IBW80">
    //       <Box className="LinkToMNG" onClick={() => navigate(`/occurrence`)} >
    //         <img src={occurrence} /> 
    //         <span>occurrence</span>
    //       </Box>
    //       <Box
    //         className="LinkToMNG"
    //         // onClick={() => navigate(`/medication`)}
    //       >
    //         <img src={Medication} />
    //         <span>Medication</span>
    //       </Box>
    //     </Box>
    //   </Box>
    // </ItemStyle>
    <ItemStyle>
      <Box className="flip-card">
        <Box className="flip-card-inner">
          <Box className="flip-card-front">
            <img src={occurrence} alt="Avatar" />
          </Box>
          <Box className="flip-card-back">
            <p>การรายงานเหตุการณ์ (Occurrence Report)</p>
          </Box>
        </Box>
      </Box>
    </ItemStyle>
  )
}

export default Home;
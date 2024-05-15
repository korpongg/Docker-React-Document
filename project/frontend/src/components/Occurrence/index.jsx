import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";

import OccurrenceStyle from "../../styles/OccurrenceStyle.style";

const IndexPage = () => {

  return (
    <>
    {console.log("IndexPage")}
    <OccurrenceStyle>
        IndexPage
        <ul>
            <li><Link href="/occurrence/form">occurrence Form</Link></li>
        </ul>
      </OccurrenceStyle> 
    </>
  );
};



export default IndexPage;
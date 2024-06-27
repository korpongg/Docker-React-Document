import React from 'react';
import { Box, Link, Select, MenuItem } from "@mui/material";

import { InputBox } from '../../styles/Report.style';

const SearchBox = ( {reportType, setReportType, startDate, setStartDate, endDate, setEndDate, fetchData } ) => {

  return (
    <InputBox sx={{ display: 'flex', gap: 2, marginBottom: 2, alignItems: "center", justifyContent: "center" }}>
        <div style={{width:"100%",paddingRight:2.5,paddingLeft:2.5}}>
          <label htmlFor="reportType">Report Type</label>
          <select
            id="reportType"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="occurrence">Occurrence</option>
            <option value="medication">Medication</option>
          </select>
        </div>

        <div style={{width:"100%",paddingRight:2.5,paddingLeft:2.5}}>
          <label htmlFor="dateform">วันที่เริ่มต้น:</label>
          <input
            id="datefrom"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ padding: "7px 10px", height: "max-content", borderRadius: "4px", fontSize: "1rem" }}
          />
        </div>

        <div style={{width:"100%",paddingRight:2.5,paddingLeft:2.5}}>
          <label htmlFor="dateto">วันที่สิ้นสุด:</label>
          <input
            id="dateto"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{ padding: "7px 10px", height: "max-content", borderRadius: "4px", fontSize: "1rem" }}
          />
        </div>

        <button style={{ backgroundColor: "#789461", color: "white", padding: "10px 30px", height: "max-content" }} onClick={fetchData}>Search</button>
      </InputBox>
  );
};

export default SearchBox;
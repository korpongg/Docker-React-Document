import React from "react";
import PropTypes from 'prop-types';
import AutoCompleteText from "./AutoCompleteText";
import { getCurrentDate } from "../Function";
import Divider from '@mui/material/Divider';

const ReportLog = ({ Mode, data, setDataFunction, handleDateChange, handleDataChangeCheckbox, missingKeys }) => {
  return (
    <>
      <div className="TopicHeader">ข้อมูลสถานการณ์</div>
      <div className="GeneralBox">
        <div className="ContentBox">
          <div className="ContentRow">
            <div className="w30P">สถานที่เกิดเหตุ</div>
            <div className="w70P">
              <input
                className={missingKeys.some(item => item.key === "reportlocation") ? "TextInputContent SETERROR" : "TextInputContent"}
                disabled={Mode === "Show"}
                id="reportlocation"
                label="สถานที่เกิดเหตุ"
                value={data?.reportlocation || ""}
                onChange={(e) => setDataFunction(e, "reportlocation")}
              />
            </div>
          </div>
          <div className="ContentRow">
            <div className="w30P">วัน-เวลาที่เกิดเหตุการณ์</div>
            <div className="w70P">
              <input
                id="occurrencedate"
                disabled={Mode === "Show"}
                className={missingKeys.some(item => item.key === "occurrencedate") ? "DatetimeInput SETERROR" : "DatetimeInput"}
                placeholder="วันที่รายงานเหตุการณ์"
                type="datetime-local"
                value={getCurrentDate(data?.occurrencedate)}
                onChange={(e) => handleDateChange(e, "occurrencedate")}
              />
            </div>
          </div>
          <Divider variant="middle" flexItem sx={{ marginLeft: 5, marginTop: 1 }} />
          <div className="ContentRow" style={{ margin: "0px" }}>
            <div className="w30P">หน่วยงานที่เกี่ยวข้อง</div>
          </div>
          <div className="ContentRow" style={{ margin: "5px", paddingLeft: "0px", flexDirection: "column" }}>
            <div className={missingKeys.some(item => item.key === "deptrelate") ? "SETERROR" : ""}>
              <AutoCompleteText
                required
                Mode={Mode}
                data={data}
                datacolumn="deptrelate"
                handleDataChangeCheckbox={handleDataChangeCheckbox}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

ReportLog.propTypes = {
  Mode: PropTypes.string.isRequired,
  data: PropTypes.object,
  setDataFunction: PropTypes.func.isRequired,
  handleDateChange: PropTypes.func.isRequired,
  handleDataChangeCheckbox: PropTypes.func.isRequired,
  missingKeys: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired
  })).isRequired
};

export default ReportLog;

//--OLD-VERSION--
// import React, { useState, useEffect } from "react";
// import AutoCompleteText from "./AutoCompleteText";
// import { getCurrentDate } from "../Function";
// import Divider from '@mui/material/Divider';

// const ReportLog = ({Mode,data,setDataFunction,handleDateChange,handleDataChangeCheckbox,missingKeys}) => {

//   return (
//     <>
//     <div className="TopicHeader">ข้อมูลสถานการณ์</div>
//     <div className="GeneralBox">
//       <div className="ContentBox">
//           <div className="ContentRow">
//             <div className="w30P">สถานที่เกิดเหตุ</div>
//             <div className="w70P">
//               <input className={missingKeys.some(item => item.key === "reportlocation") ? "TextInputContent SETERROR":"TextInputContent" } disabled={Mode==="Show"} id="reportlocation" label="สถานที่เกิดเหตุ" value={data?.reportlocation || ""} onChange={(e) => setDataFunction(e, "reportlocation")} />
//             </div>
//           </div>
//           <div className="ContentRow">
//             <div className="w30P">วัน-เวลาที่เกิดเหตุการณ์</div>
//             <div className="w70P">
//             <input id="occurrencedate" disabled={Mode==="Show"} className={missingKeys.some(item => item.key === "occurrencedate") ? "DatetimeInput SETERROR":"DatetimeInput" } placeholder="วันที่รายงานเหตุการณ์" type="datetime-local" value={getCurrentDate(data?.occurrencedate)} onChange={(e)=>handleDateChange(e,"occurrencedate")}/>
//             </div>
//           </div>
//           <Divider variant="middle" flexItem sx={{marginLeft:5,marginTop:1}} />
//           <div className="ContentRow" style={{margin:"0px"}}>
//             <div className="w30P">หน่วยงานที่เกี่ยวข้อง</div>
            
//           </div>
//           <div className="ContentRow" style={{margin:"5px",paddingLeft:"0px",flexDirection:"column"}}>
//             <div className={missingKeys.some(item => item.key === "deptrelate") && "SETERROR" }>
//             <AutoCompleteText
//               required
//               Mode={Mode}
//               data={data} 
//               datacolumn="deptrelate"
//               handleDataChangeCheckbox={handleDataChangeCheckbox}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };



// export default ReportLog;
import React, { useState, useEffect, useCallback } from "react";
// import React from "react";
import PropTypes from 'prop-types';
// import AutoCompleteText from "./AutoCompleteText";
import { getCurrentDate } from "../Function";
import Divider from '@mui/material/Divider';
import { TextField, Autocomplete } from '@mui/material';
import axios from "axios";

const datacolumn="deptrelate";

function filterDataByIds(data, ids) {
  return data.filter(item => ids.includes(item.id));
};

const ReportLog = ({ Mode, data, setDataFunction, handleDateChange,handleDataChangeCheckbox,label, missingKeys }) => {
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

  const [departmentData, setDepartmentData] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState(data[datacolumn]||[]);
  const fetchDeptData = useCallback(async () => {
    try {
      const response = await axios.get(apiUrl + "/departments");
      setDepartmentData(response.data);

      if (data[datacolumn]) {
        const initialSelectedDepartments = response.data.filter(dept => data[datacolumn].includes(dept.id));
        setSelectedDepartments(initialSelectedDepartments);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  }, [apiUrl, data, datacolumn]);

  useEffect(() => {
    fetchDeptData();
  }, []);
  useEffect(() => {
    setSelectedDepartments(filterDataByIds(departmentData, data[datacolumn]))
  }, [departmentData]);

  useEffect(() => {
    handleDataChangeCheckbox(selectedDepartments.map(dept => dept.id), datacolumn);
  }, [selectedDepartments]);

  const handleChange = (event, values) => {
    setSelectedDepartments(values);
  };

  console.log("ReportLog Data : ",data.deptrelate);
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
              {/* <AutoCompleteText
                required
                Mode={Mode}
                data={data}
                datacolumn="deptrelate"
                handleDataChangeCheckbox={handleDataChangeCheckbox}
              /> */}
              <Autocomplete
                      multiple
                      id="deptrelate"
                      disabled={Mode==="Show"}
                      sx={{width:"860px",padding:"unset"}}
                      options={departmentData}
                      
                      getOptionLabel={(option) => option.DepName}
                      value={selectedDepartments}
                      onChange={handleChange}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      renderInput={(params) => (
                        <TextField {...params} label={label} variant="outlined" />
                      )}
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
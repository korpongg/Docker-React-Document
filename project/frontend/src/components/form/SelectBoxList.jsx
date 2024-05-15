import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';

// import DataDict_occurrenceForm from "../../data/form/DataDict_occurrenceForm";

import SelectBoxListStyle from "../../styles/SelectBoxListStyle.style";
// const dataset = [
//     {
//         code: 101,
//         title: "การเข้าถึงและเข้ารับบริการ",
//         status: false,
//       },
//       {
//         code: 102,
//         title: "การประเมินผู้ป่วยแรกรับ/ รับใหม่ /รับย้าย",
//         status: false,
//       },
//       {
//         code: 103,
//         title: "การส่งตรวจเพื่อประกอบการวินิจฉัยโรค",
//         status: false,
//       },
//     ];

const SelectBoxList = ({data,optionsdata,datacolumn,handleDataChangeCheckbox,handleDataChange,remark,remarkno,remarkcolumn}) => {
    // console.log(data.datacolumn)
    const [pickdata,setPickdata] = useState(data[datacolumn] || [])

    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
        if (checked) {
            setPickdata(prevData => [...prevData, value]);
        } else {
            setPickdata(prevData => prevData.filter(item => item !== value));
        }
    };

    useEffect(() => {
        handleDataChangeCheckbox(pickdata,datacolumn);
    }, [pickdata]);

  return (
    <>

{/* {console.log("data",data)}
{console.log("datacolumn",datacolumn)}
{console.log("DataDict_occurrenceForm",DataDict_occurrenceForm[datacolumn])} */}
{/* {console.log("title",title)} */}
        {/* {datadict && //check array lenght to list */}
        {optionsdata[datacolumn].topic &&
            optionsdata[datacolumn].topic
        }
        {optionsdata && datacolumn &&
        <SelectBoxListStyle>
            <FormGroup>
                {optionsdata[datacolumn].options.map((datarow,datakey)=>(
                    <FormControlLabel key={datakey} value={datarow.code} control={<Checkbox checked={pickdata.includes(datarow.code.toString())} onChange={handleCheckboxChange} />} label={datarow.code+" "+datarow.title} />
                ))}
                {remark &&<>
                <FormControlLabel value={remarkno} control={<Checkbox checked={pickdata.includes(remarkno.toString())} onChange={handleCheckboxChange} />} label={remarkno+" อื่นๆ..."} />
                    {pickdata.includes(remarkno.toString()) &&
                        <TextField id={remarkcolumn} label="อื่นๆ ระบุ" value={data[remarkcolumn] || ""} onChange={(e) => handleDataChange(e, remarkcolumn)} variant="filled" />}
                    </>}
            </FormGroup>
        </SelectBoxListStyle>
        }
        {/* } */}
    </>
  );
};



export default SelectBoxList;
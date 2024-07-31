import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { getCurrentDate } from "../Function";
import { Autocomplete, TextField } from '@mui/material';

const options = [
  "ไม่ระบุ",
  "PCT ศัลยกรรม",
  "PCT สูตินรีเวช-ปริกำเนิด",
  "PCT หัวใจและหลอดเลือด",
  "PCT อายุรกรรม 1",
  "PCT อายุรกรรม 2",
  "PCT หู คอ จมูก",
  "PCT อายุรกรรมทางเดินอาหาร",
  "PCT ตา",
  "PCT กุมารเวชกรรม",
  "PCT ฉุกเฉิน"
  ]

const GeneralInfo = ({ Mode, data, setDataFunction,setSingleDataFunction, missingKeys }) => {
  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [tosentvalue, settosentvalue] = useState("select"); // select or textinput

  useEffect(()=>{
    if(data.pct){
      if(options.includes(data.pct)){
        settosentvalue("select");
        setValue(data.pct);
      }else{
        settosentvalue("textinput");
        setInputValue(data.pct);
      }
    }
  },[])

  return (
    <>
    {/* {console.log("Test : ",value)}
    {console.log("Test : ",inputValue)}
    {console.log("Test : ",tosentvalue)}
    {console.log("------------------")}
    {console.log("Result",data.pct)}
    {console.log("------------------")} */}
    
      <Box className="TopicHeader">ข้อมูลทั่วไป</Box>
      <div className="GeneralBox" style={{ marginTop: "15px" }}>
        <div className="ContentBox">
          <div className="ContentRow">
            <div className="w30P">HN</div>
            <div className="w70P">
              <input
                className={
                  missingKeys.some((item) => item.key === "hn")
                    ? "TextInputContent SETERROR"
                    : "TextInputContent"
                }
                disabled={Mode === "Show"}
                type="text"
                id="hn"
                label="HN"
                value={data?.hn || ""}
                onChange={(e) => setDataFunction(e, "hn")}
              />
            </div>
          </div>
          <div className="ContentRow">
            <div className="w30P">AN/VN</div>
            <div className="w70P">
              <input
                className={
                  missingKeys.some((item) => item.key === "an")
                    ? "TextInputContent SETERROR"
                    : "TextInputContent"
                }
                disabled={Mode === "Show"}
                type="text"
                id="an"
                label="AN"
                value={data?.an || ""}
                onChange={(e) => setDataFunction(e, "an")}
              />
            </div>
          </div>
          <div className="ContentRow">
            <div className="w30P">อายุ</div>
            <div className="w70P">
              <div className="ContentRow">
                <div className="w70P">
                  <input
                    className={
                      missingKeys.some((item) => item.key === "age")
                        ? "TextInputContent SETERROR"
                        : "TextInputContent"
                    }
                    disabled={Mode === "Show"}
                    type="text"
                    id="age"
                    label="อายุ"
                    value={data?.age || ""}
                    onChange={(e) => setDataFunction(e, "age")}
                  />
                </div>
                <div className="w30P">เพศ</div>
                <div className="w70P">
                  {Mode === "Show" ? (
                    <input
                      className={
                        missingKeys.some((item) => item.key === "gender")
                          ? "TextInputContent SETERROR"
                          : "TextInputContent"
                      }
                      disabled
                      type="text"
                      id="gender"
                      label="ID"
                      value={
                        (data?.gender &&
                          (data?.gender === "M" ? "ชาย" : "หญิง")) ||
                        ""
                      }
                    />
                  ) : (
                    <select
                      className="SelectInput"
                      id="gender"
                      name="gender"
                      form="gender"
                      value={data?.gender || "M"}
                      onChange={(e) => setDataFunction(e, "gender")}
                    >
                      <option value="M">ชาย</option>
                      <option value="F">หญิง</option>
                    </select>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="ContentRow">
            <div className="w30P">Dx.</div>
            <div className="w70P">
              <input
                className={
                  missingKeys.some((item) => item.key === "dx")
                    ? "TextInputContent SETERROR"
                    : "TextInputContent"
                }
                disabled={Mode === "Show"}
                type="text"
                id="dx"
                label="Dx."
                value={data?.dx || ""}
                onChange={(e) => setDataFunction(e, "dx")}
              />
            </div>
          </div>

          <div className="ContentRow" >
            <div
              className=""
              style={{
                justifyContent: "flex-start",
                paddingLeft: "50px",
                paddingRight: "50px",
              }}
            >
              PCT ที่เกี่ยวข้อง
            </div>
            <div className="Test">
              {Mode === "Show" ? (
                <input
                  disabled
                  id="pct"
                  className={
                    missingKeys.some((item) => item.key === "pct")
                      ? "TextInputContent SETERROR"
                      : "TextInputContent"
                  }
                  placeholder="pct"
                  value={data?.pct}
                />
              ) : (
                <div style={{width:"245px"}}>

                {/* <select
                  className="SelectInput"
                  id="pct"
                  name="pct"
                  form="pct"
                  value={data?.pct || null}
                  onChange={(e) => setDataFunction(e, "pct")}
                >
                  
                  
                  <option value="ไม่ระบุ">ไม่ระบุ</option>
                  <option value="PCT ศัลยกรรม">PCT ศัลยกรรม</option>
                  <option value="PCT สูตินรีเวช-ปริกำเนิด">
                    PCT สูตินรีเวช-ปริกำเนิด
                  </option>
                  <option value="PCT หัวใจและหลอดเลือด">
                    PCT หัวใจและหลอดเลือด
                  </option>
                  <option value="PCT อายุรกรรม">PCT อายุรกรรม</option>
                  <option value="PCT หู คอ จมูก">PCT หู คอ จมูก</option>
                  <option value="PCT อายุรกรรมทางเดินอาหาร">
                    PCT อายุรกรรมทางเดินอาหาร
                  </option>
                  <option value="PCT ตา">PCT ตา</option>
                  <option value="PCT กุมารเวชกรรม">PCT กุมารเวชกรรม</option>
                  <option value="PCT ฉุกเฉิน">PCT ฉุกเฉิน</option>
                  <option value="99">อื่นๆ</option>
                </select> */}
                
                <Autocomplete
                freeSolo
                fullWidth
                value={value}
                onChange={(event, newValue) => {
                  setValue(newValue);
                  settosentvalue("select");
                  setSingleDataFunction(newValue,"pct")
                }}
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
                  setInputValue(newInputValue);
                  settosentvalue("textinput");
                  setSingleDataFunction(newInputValue,"pct")
                }}
                options={options}
                renderInput={(params) => (
                  <TextField {...params} label="อื่นๆโปรดระบุ" variant="outlined" />
                )}
              />
              </div>
              
              )}
            </div>
          </div>
        </div>
        <Divider
          orientation="vertical"
          variant="middle"
          flexItem
          sx={{ m: 1 }}
        />
        <div className="ContentBox">
          <div className="ContentRow">
            <div className="w30P">รหัสพนักงาน</div>
            <div className="w70P">
              <input
                className={
                  missingKeys.some((item) => item.key === "userreport")
                    ? "TextInputContent SETERROR"
                    : "TextInputContent"
                }
                disabled
                type="text"
                id="userreport"
                label="ID"
                value={data?.userreport || ""}
              />
            </div>
          </div>
          <div className="ContentRow">
            <div className="w30P">สังกัด</div>
            <div className="w70P">
              <input
                className={
                  missingKeys.some((item) => item.key === "aff")
                    ? "TextInputContent SETERROR"
                    : "TextInputContent"
                }
                disabled
                type="text"
                id="aff"
                label="สังกัด"
                value={data?.aff || ""}
              />
            </div>
          </div>
          <div className="ContentRow">
            <div className="w30P">ฝ่าย</div>
            <div className="w70P">
              <input
                className={
                  missingKeys.some((item) => item.key === "faction")
                    ? "TextInputContent SETERROR"
                    : "TextInputContent"
                }
                disabled
                type="text"
                id="faction"
                label="ฝ่าย"
                value={data?.faction || ""}
              />
            </div>
          </div>
          <div className="ContentRow">
            <div className="w30P">แผนก</div>
            <div className="w70P">
              <input
                className={
                  missingKeys.some((item) => item.key === "dep")
                    ? "TextInputContent SETERROR"
                    : "TextInputContent"
                }
                disabled
                type="text"
                id="dep"
                label="แผนก"
                value={data?.dep || ""}
              />
            </div>
          </div>
          <div className="ContentRow">
            <div className="w30P">วัน-เวลาที่รายงานเหตุการณ์</div>
            <div className="w70P">
              <input
                disabled
                id="reportdate"
                className="DatetimeInput"
                placeholder="วันที่รายงานเหตุการณ์"
                type="datetime-local"
                value={getCurrentDate(data?.reportdate)}
                onChange={(e) => handleDateChange(e, "reportdate")}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GeneralInfo;

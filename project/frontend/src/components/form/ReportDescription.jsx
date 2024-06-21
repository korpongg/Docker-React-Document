import React from "react";
import TextField from "@mui/material/TextField";
import MoveDownIcon from '@mui/icons-material/MoveDown';
import IconButton from '@mui/material/IconButton';

const ReportDescription = ({ OccType,Mode, data, setDataFunction, missingKeys ,UserData,isAdmin,handleReplaceData}) => {
  return (
    <>
      <div className="TopicHeader">บันทึกรายละเอียด</div>
      <div className="GeneralBox">
        <div
          className="ContentBox"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <div
            className={
              missingKeys.some((item) => item.key === "description")
                ? "AreaBOX SETERRORBOX"
                : "AreaBOX"
            }
          >
            {/* {UserData.userid===data.userreport ? ( "is เจ้าของ view") : (isAdmin && ("adminview") )} */}
            {/* {Mode} */}
            {/* {Mode==="Add" && ( */}
              <TextField
              fullWidth
              id="description"
              disabled={Mode === "Show"}
              label="บรรยายสรุปเหตุการณ์ (เกิดเหตุการณ์อะไร เกิดที่ไหน เกิดเมื่อไหร่ ใครคือผู้เกี่ยวข้อง เกี่ยวข้องอย่างไร) Add"
              value={data?.description || ""}
              onChange={(e) => setDataFunction(e, "description")}
              variant="filled"
              multiline
              rows={6}
              sx={{ marginBottom: 1 }}
            />
            {/* )} */}
            
{/* <button onClick={()=>handleReplaceData("description","renew")}><MoveDownIcon/></button> */}
            {Mode!=="Add" && (
              isAdmin && (
                <>
                {Mode!=="Show" && 
                <div style={{width:"100%",textAlign:"left",paddingLeft:"20px"}}>
                  <IconButton aria-label="Replace" onClick={()=>handleReplaceData("description","renew")} size="large">
                    <MoveDownIcon fontSize="small" />
                  </IconButton>
                  <span style={{fontSize:"14px"}}>
                    *สำเนา "บรรยายเหตุการณ์" จากต้นฉบับ
                  </span>
                </div>
                }
                <TextField
                  fullWidth
                  id="renew"
                  disabled={Mode === "Show"}
                  label="ADMIN : บรรยายสรุปเหตุการณ์ (เกิดเหตุการณ์อะไร เกิดที่ไหน เกิดเมื่อไหร่ ใครคือผู้เกี่ยวข้อง เกี่ยวข้องอย่างไร)"
                  value={data?.renew || ""}
                  onChange={(e) => setDataFunction(e, "renew")}
                  variant="filled"
                  multiline
                  rows={6}
                  sx={{ marginBottom: 1 }}
                />
              </>
              ) 
            )}
            
          </div>

          {OccType==="Occurrence" &&
            <div
              className={
                missingKeys.some((item) => item.key === "effectremark")
                  ? "AreaBOX SETERRORBOX"
                  : "AreaBOX"
              }
            >
              <TextField
                fullWidth
                id="effectremark"
                disabled={Mode === "Show"}
                label="ระบุความเสียหายที่เกิดขึ้น"
                value={data?.effectremark || ""}
                onChange={(e) => setDataFunction(e, "effectremark")}
                variant="filled"
                multiline
                rows={3}
                sx={{ marginBottom: 1 }}
              />
            </div>
          }

        </div>
      </div>
    </>
  );
};

export default ReportDescription;

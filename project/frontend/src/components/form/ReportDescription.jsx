import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import ReportDescriptionStyle from "../../styles/ReportDescriptionStyle.style";

const ReportDescription = ({ Mode, data, setDataFunction,missingKeys }) => {
  return (
    <>
      <div className="TopicHeader">บันทึกรายละเอียด</div>
      <div className="GeneralBox" >
        <div className="ContentBox" style={{display:"flex",flexDirection:"column"}}>
          <div className={missingKeys.some(item => item.key === "description") ? "AreaBOX SETERRORBOX":"AreaBOX" }>
            <TextField
              fullWidth
              id="description"
              disabled={Mode === "Show"}
              label="บรรยายสรุปเหตุการณ์ (เกิดเหตุการณ์อะไร เกิดที่ไหน เกิดเมื่อไหร่ ใครคือผู้เกี่ยวข้อง เกี่ยวข้องอย่างไร)"
              value={data?.description || ""}
              onChange={(e) => setDataFunction(e, "description")}
              variant="filled"
              multiline
              rows={6}
              sx={{ marginBottom: 1 }}
            />
          </div>

          <div className={missingKeys.some(item => item.key === "effectremark") ? "AreaBOX SETERRORBOX":"AreaBOX" }>
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
        </div>
      </div>
      {/* <Box className="ContentBoxMain">
        <div >

        <TextField id="description" disabled={Mode==="Show"} label="บรรยายสรุปเหตุการณ์ (เกิดเหตุการณ์อะไร เกิดที่ไหน เกิดเมื่อไหร่ ใครคือผู้เกี่ยวข้อง เกี่ยวข้องอย่างไร)" value={data?.description || ""} onChange={(e) => setDataFunction(e, "description")} variant="filled" multiline rows={6} sx={{marginBottom:1}}/>
        </div>
        <TextField id="effectremark" disabled={Mode==="Show"} label="ระบุความเสียหายที่เกิดขึ้น" value={data?.effectremark || ""} onChange={(e) => setDataFunction(e, "effectremark")} variant="filled" multiline rows={3} sx={{marginBottom:1}}/>
      </Box> */}
    </>
  );
};

export default ReportDescription;

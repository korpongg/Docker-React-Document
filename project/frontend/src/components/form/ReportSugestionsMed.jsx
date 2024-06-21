import React from "react";
import TextField from "@mui/material/TextField";

const ReportSugestionsMed = ({ Mode, data, setDataFunction, missingKeys }) => {
  return (
    <>
      <div className="TopicHeader">ผลการทบทวน วิเคราะห์สาเหตุ กำหนดแนวทางแก้ไขป้องกัน</div>
      <div className="GeneralBox">
        <div
          className="ContentBox"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <div
            className={
              missingKeys.some((item) => item.key === "analysis")
                ? "AreaBOX SETERRORBOX"
                : "AreaBOX"
            }
          >
            <TextField
              fullWidth
              id="analysis"
              disabled={Mode === "Show"}
              label="ผลการวิเคราะห์สาเหตุ"
              value={data?.analysis || ""}
              onChange={(e) => setDataFunction(e, "analysis")}
              variant="filled"
              multiline
              rows={5}
              sx={{ marginBottom: 1 }}
            />
          </div>

          <div
            className={
              missingKeys.some((item) => item.key === "solution")
                ? "AreaBOX SETERRORBOX"
                : "AreaBOX"
            }
          >
            <TextField
              fullWidth
              id="solution"
              disabled={Mode === "Show"}
              label="แนวทางการแก้ไข / ป้องกันปัญหาในเชิงระบบ"
              value={data?.solution || ""}
              onChange={(e) => setDataFunction(e, "solution")}
              variant="filled"
              multiline
              rows={6}
              sx={{ marginBottom: 1 }}
            />
          </div>

          {/* <div
            className={
              missingKeys.some((item) => item.key === "suggestion")
                ? "AreaBOX SETERRORBOX"
                : "AreaBOX"
            }
          >
            <TextField
              fullWidth
              id="suggestion"
              disabled={Mode === "Show"}
              label="ข้อเสนอแนะเพื่อการแก้ไขปัญหา / แนวทางแก้ไขปัญหา (ถ้ามี)"
              value={data?.suggestion || ""}
              onChange={(e) => setDataFunction(e, "suggestion")}
              variant="filled"
              multiline
              rows={2}
              sx={{ marginBottom: 1 }}
            />
          </div> */}

        </div>
      </div>
    </>
  );
};

export default ReportSugestionsMed;

import React from "react";
import TextField from "@mui/material/TextField";

const ReportComment = ({ data }) => {
  return (
    <>
      <div className="TopicHeader">ความคิดเห็น</div>
      <div className="GeneralBox">
        <div className="ContentBox" style={{ display: "flex", flexDirection: "column" }}>
          <div className="AreaBOX">
            <TextField
              fullWidth
              id="comment"
              disabled
              label="ความคิดเห็น"
              value={data?.comment || ""}
              variant="filled"
              multiline
              rows={5}
              sx={{ marginBottom: 1 }}
            />
          </div>
        </div>
      </div>
    </>
  )

}

export default ReportComment;
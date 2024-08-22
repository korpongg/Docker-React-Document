import React, { useState, useEffect } from "react";
import { DialogTitle, DialogContent, TextField, Radio, RadioGroup, FormControlLabel, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import Divider from "@mui/material/Divider";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import ListSelectData from "../form/ListSelectData";
import SelectBoxListRCA from "../form/SelectBoxListRCA";

const ApproveForm = ({ mode, isHA, data, approveData, DataDictMed, handleDataChange, handleDataChangeCheckbox }) => {
  const [OccStage, setOccStage] = useState(0);
    
  return (
    data && (
      <DialogContent>
        {/* View */}
        <div className="EventBox">
          <div className="EventRow">
            <div className="EventCell AreaTopic">สรุปรายละเอียดเหตุการณ์</div>
          </div>
          <div className="EventRow">
            <pre className="EventCell AreaContent view">{data.renew || "-"}</pre>
          </div>
        </div>
        <div className="EventBox">
          <div className="EventRow">
            <div className="EventCell AreaTopic">ความคลาดเคลื่อนที่เกิดขึ้น</div>
          </div>
          <div className="EventRow">
            <ListSelectData OccType="Medication" data={data} Mode="Show" setOccStage={0} />
          </div>
        </div>

        {/* Form  */}
        <div className="EventBox">
          <div className="EventRow">
            <div className="EventCell AreaTopic">ผลการทบทวน วิเคราะห์สาเหตุ กำหนดแนวทางแก้ไขป้องกัน</div>
          </div>
          <div className="EventRow">
            <div className="FormTable">
              <div className="FormTable_Row">
                <div className="FormTable_Cell">ผลการวิเคราะห์สาเหตุ</div>
                <Divider
                  orientation="vertical"
                  variant="middle"
                  flexItem
                  sx={{ m: 0.5 }}
                />
                <div className="FormTable_Cell">แนวทางการแก้ไข / ป้องกันปัญหาในเชิงระบบ</div>
              </div>

              <div className="FormTable_Row">
                <div className="FormTable_Cell">
                  <TextField
                    fullWidth
                    id="analysis"
                    // label="ผลการวิเคราะห์สาเหตุ"
                    value={approveData?.analysis || ""}
                    onChange={(e) => handleDataChange(e, "analysis")}
                    variant="outlined"
                    multiline
                    rows={6}
                    sx={{ marginBottom: 1, background: 'white' }}
                  />
                </div>
                <Divider
                  orientation="vertical"
                  variant="middle"
                  flexItem
                  sx={{ m: 0.5 }}
                />
                <div className="FormTable_Cell">
                  <TextField
                    fullWidth
                    id="solution"
                    // label="แนวทางการแก้ไข / ป้องกันปัญหาในเชิงระบบ"
                    value={approveData?.solution || ""}
                    onChange={(e) => handleDataChange(e, "solution")}
                    variant="outlined"
                    multiline
                    rows={6}
                    sx={{ marginBottom: 1 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="EventBox">
          <div className="EventRow">
            <div className="EventCell AreaTopic">สรุปผลการวิเคราะห์สาเหตุที่แท้จริง (RCA) ของความคลาดเคลื่อน</div>
          </div>
          <div className="EventRow SelectRCA">
            <SelectBoxListRCA
              data={approveData}
              optionsdata={DataDictMed}
              datacolumn="rca"
              remark={true}
              remarkno="999"
              remarkcolumn="rcaremark"
              handleDataChangeCheckbox={handleDataChangeCheckbox}
              handleDataChange={handleDataChange}
            />
          </div>
        </div>
      </DialogContent>
    )
  );
};

export default ApproveForm;
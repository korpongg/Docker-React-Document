import React, { useState, useEffect } from "react";
import { DialogTitle, DialogContent, TextField, Radio, RadioGroup, FormControlLabel, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import Divider from "@mui/material/Divider";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import ListSelectData from "../form/ListSelectData";
import SelectBoxListRCA from "../form/SelectBoxListRCA";
import ReportFile from "../form/ReportFile";
import { checkFileExists } from "../Function";

const ApproveForm = ({ mode, isHA, data, approveData, DataDictMed, handleDataChange, handleDataChangeCheckbox }) => {
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
  const hostUrl = import.meta.env.VITE_REACT_APP_HOST_URL;
  const [OccStage, setOccStage] = useState(0);

  const [attachData, setAttachData] = useState({
    filePDF: null,
    filePDFName: null,
    previewPDF: null,
    fileImage: null,
    fileImageName: null,
    previewImg: null,
  });

  console.log(data)

  const fetchAttach = async () => {
    try {
      const imgExtensions = ["jpg", "jpeg", "png"]; // List of image formats to check
      let imgPathLocl = "";
      let imgExt = "";
      let imgExists = false;

      // Check for image files dynamically
      for (const ext of imgExtensions) {
        const imgPath = `${apiUrl}/filemanage/MED${data.reportid}.${ext}`;
        const localPath = `../../../storage/attachfiles/MED${data.reportid}.${ext}`;
        
        if (await checkFileExists(imgPath)) {
          imgPathLocl = localPath;
          imgExt = ext;
          imgExists = true;
          break;
        }
      }
      if (imgExists) {
        setAttachData((prevAttachData) => ({ ...prevAttachData, fileImageName: `MED${data.reportid}.${imgExt}`, previewImg: imgPathLocl }));
      }
      
      const docExtensions = ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx"]; 
      let docPathLocal = "";
      let docExt = "";
      let docExists = false;

      // Check for Doc files dynamically
      for (const ext of docExtensions) {
        const docPath = `${apiUrl}/filemanage/MED${data.reportid}.${ext}`;
        const localPath = `../../../storage/attachfiles/MED${data.reportid}.${ext}`;
        const hostPath = `${hostUrl}/storage/attachfiles/MED${data.reportid}.${ext}`;
        
        if (await checkFileExists(docPath)) {
          docPathLocal = ext === "pdf" ? localPath : hostPath;
          docExt = ext;
          docExists = true;
          break;
        }
      }
      
      if (docExists) {
        setAttachData((prevAttachData) => ({
          ...prevAttachData,
          filePDFName: `MED${data.reportid}.${docExt}`,
          previewPDF: docPathLocal,
        }));
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if(data?.reportid) {
      fetchAttach();
    }
  }, [data?.reportid]);
    
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

        <ReportFile Mode="Show" attachData={attachData} handleImgChange="" handleFileChange="" />

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
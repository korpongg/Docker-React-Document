import React from "react";
import TextField from "@mui/material/TextField";

const ReportFile = ({ Mode, pdfData, handleFilePChange }) => {
  return (
    <>
      <div className="TopicHeader">แนบเอกสาร (ถ้ามี)</div>
      <div className="GeneralBox">
        <div className="ContentBox" style={{ display: "flex", flexDirection: "column" }}>
          <div id="reportFile" className="AreaBOX">
            <input
              type="file"
              id="filess"
              name="filess"
              accept=".pdf"
              style={{ display: 'none' }}
              disabled={Mode === "Show"}
              onChange={handleFilePChange}
            />
            <label htmlFor="filess" className="pdf-input-label">
              {pdfData.filePDFName ? (<><span className="pdf-selected">เลือกไฟล์</span>{pdfData.filePDFName}</>) : (<><span className="pdf-selected">เลือกไฟล์</span>ไม่ได้เลือกไฟล์ใด</>)}
            </label>
            <span style={{ color: "red", fontSize: "0.9rem", marginTop: "-10px" }}>*สามารถอัพโหลดไฟล์ pdf เพื่อแสดงผล</span>
            {pdfData.previewPDF && (
              <div className="pdfViewer">
                <iframe src={pdfData.previewPDF} title="PDF Viewer" width="100%" height="500px"></iframe>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportFile;
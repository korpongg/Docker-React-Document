import React from "react";
import { Tooltip } from "@mui/material";
import AddImgIcon from "@mui/icons-material/AddPhotoAlternateRounded";
import DownloadIcon from "@mui/icons-material/CloudDownloadRounded";
import { ReportFileBox } from "../../styles/ReportFile.style";

const ReportFile = ({ Mode, attachData, handleImgChange, handleFileChange }) => {
  return (
    <ReportFileBox>
      <div className="TopicHeader">เอกสารแนบ (ถ้ามี)</div>
      <div className="GeneralBox">
        <div className="ContentBox" style={{ display: "flex", flexDirection: "column" }} >
          {/* Image Box */}
          <div id="reportImage" className="AreaBOX">
            {Mode !== "Show" && (
              <>
                <input
                  style={{ display: "none" }}
                  type="file"
                  id="files"
                  name="files"
                  accept="image/png, image/jpeg"
                  onChange={handleImgChange}
                  disabled={Mode === "Show"}
                />
                <label className="file-input-label" htmlFor="files">
                  {attachData.fileImageName ? (
                    <><span className="file-selected"><AddImgIcon />อัพโหลดรูป</span>{attachData.fileImageName}</>
                  ) : (
                    <><span className="file-selected"><AddImgIcon />อัพโหลดรูป</span>ไม่ได้เลือกรูปใด</>
                  )}
                </label>
                <span className="remark">*ไฟล์ .jpg หรือ .png</span>
              </>
            )}

            {attachData.previewImg && (
              <>
                <div className="imgViewer">
                  <img
                    src={attachData.previewImg}
                    alt="Preview"
                    className="preview-img"
                    loading="lazy"
                  />
                </div>
                {Mode === "Show" && (
                  <span className="Download">
                    ไฟล์รูป : {attachData.fileImageName}
                    <Tooltip title="Download" placement="right" arrow><a href={attachData.previewImg} target="_blank"><DownloadIcon /></a></Tooltip>
                  </span>
                )}
              </>
            )}
          </div>
          {/* File Box */}
          <div id="reportFile" className="AreaBOX">
            {Mode !== "Show" && (
              <>
                <input
                  type="file"
                  id="filess"
                  name="filess"
                  accept=".pdf"
                  style={{ display: "none" }}
                  disabled={Mode === "Show"}
                  onChange={handleFileChange}
                />
                <label htmlFor="filess" className="file-input-label">
                  {attachData.filePDFName ? (
                    <><span className="file-selected">เลือกไฟล์</span>{attachData.filePDFName}</>
                  ) : (
                    <><span className="file-selected">เลือกไฟล์</span>ไม่ได้เลือกไฟล์ใด</>
                  )}
                </label>
                <span className="remark">*สามารถอัพโหลดไฟล์ pdf เพื่อแสดงผล</span>
              </>
            )}
            {attachData.previewPDF && (
              <>
                <div className="pdfViewer">
                  <iframe
                    src={attachData.previewPDF}
                    title="PDF Viewer"
                    width="99%"
                    height="500px"
                  ></iframe>
                </div>
                {Mode === "Show" && (
                  <span className="Download">
                    ไฟล์เอกสาร : {attachData.filePDFName}
                    <Tooltip title="Download" placement="right" arrow><a href={attachData.previewPDF} target="_blank"><DownloadIcon /></a></Tooltip>
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </ReportFileBox>
  );
};

export default ReportFile;
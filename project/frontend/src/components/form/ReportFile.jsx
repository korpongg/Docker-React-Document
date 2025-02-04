import React from "react";
import { Tooltip } from "@mui/material";
import AddImgIcon from "@mui/icons-material/AddPhotoAlternateRounded";
import DownloadIcon from "@mui/icons-material/CloudDownloadRounded";
import { ReportFileBox } from "../../styles/ReportFile.style";

const FileUpload = ({ id, accept, onChange, fileName, label, remark, disabled }) => (
  <>
    <input type="file" id={id} accept={accept} style={{ display: "none" }} onChange={onChange} disabled={disabled} />
    <label htmlFor={id} className="file-input-label">
      <span className="file-selected">{label}</span><span className="text">{fileName || "ไม่ได้เลือกไฟล์ใด"}</span>
    </label>
    <span className="remark">{remark}</span>
  </>
);

const FilePreview2 = ({ forFile, Mode, previewSrc, fileName, downloadTitle }) => (
  previewSrc && (
    <>
      {/* previewSrc.endsWith(".pdf") */}
      {forFile === "FileDoc" ? (
        <div className="docViewer">
          <iframe src={previewSrc} title="PDF Viewer" width="99%" height="510px" />
        </div>
      ) : (
        <div className="imgViewer">
          <img src={previewSrc} alt="Preview" className="preview-img" loading="lazy" />
        </div>
      )}
      {Mode === "Show" && (
        <span className="Download">
          {fileName}
          <Tooltip title={downloadTitle} placement="right" arrow>
            <a href={previewSrc} target="_blank" rel="noopener noreferrer">
              <DownloadIcon />
            </a>
          </Tooltip>
        </span>
      )}
    </>
  )
);

const FilePreview3 = ({ forFile, Mode, previewSrc, fileName, downloadTitle }) => (
  previewSrc && (
    <>
      {fileName.endsWith(".pdf") && forFile === "FileDoc" ? (
        <div className="docViewer">
          <iframe src={previewSrc} title="PDF Viewer" width="99%" height="510px" />
        </div>
      ) : (
        <div className="imgViewer">
          <img src={previewSrc} alt="Preview" className="preview-img" loading="lazy" />
        </div>
      )}
      {Mode === "Show" && (
        <span className="Download">
          {fileName}
          <Tooltip title={downloadTitle} placement="right" arrow>
            <a href={previewSrc} target="_blank" rel="noopener noreferrer">
              <DownloadIcon />
            </a>
          </Tooltip>
        </span>
      )}
    </>
  )
);

const FilePreview = ({ forFile, Mode, previewSrc, fileName, downloadTitle }) => {
  if (!previewSrc) return null;
  const fileExt = fileName.split(".").pop().toLowerCase();
  const googleDocsFormats = ["pdf"];
  let viewerSrc = "";
  if (googleDocsFormats.includes(fileExt)) {
    viewerSrc = previewSrc; // PDF directly displayed in iframe
  }

  return (
    <>
      {forFile === "FileDoc" ? 
        viewerSrc && (
          <div className="docViewer">
            <iframe src={viewerSrc} title="Document Viewer" width="99%" height="510px" />
          </div>
        )
      : (
        <div className="imgViewer">
          <img src={previewSrc} alt="Preview" className="preview-img" loading="lazy" />
        </div>
      )}
      {Mode === "Show" && (
        <span className="Download">
          {fileName}
          <Tooltip title={downloadTitle} placement="right" arrow>
            <a href={previewSrc} target="_blank" rel="noopener noreferrer">
              <DownloadIcon />
            </a>
          </Tooltip>
        </span>
      )}
    </>
  );
};


const ReportFile = ({ Mode, attachData, handleImgChange, handleFileChange }) => {
  return (
    <ReportFileBox>
      <div className="TopicHeader">เอกสารแนบ (ถ้ามี)</div>
      <div className="GeneralBox">
        <div className="ContentBox" style={{ display: "flex", flexDirection: "column" }} >
          {/* Image Box */}
          <div id="reportImage" className="AreaBOX">
            {Mode !== "Show" && (
              <FileUpload
                id="files"
                accept="image/png, image/jpeg"
                onChange={handleImgChange}
                fileName={attachData.fileImageName}
                label={<><AddImgIcon />อัพโหลดรูป</>}
                remark="*ไฟล์ .jpg หรือ .png"
                disabled={Mode === "Show"}
              />
            )}
            <FilePreview Mode={Mode} previewSrc={attachData.previewImg} fileName={`ไฟล์รูป : ${attachData.fileImageName}`} downloadTitle="Download" />
          </div>
          {/* File Box */}
          <div id="reportFile" className="AreaBOX">
            {Mode !== "Show" && (
              <FileUpload
                id="filess"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                onChange={handleFileChange}
                fileName={attachData.filePDFName}
                label="เลือกไฟล์"
                remark="*สามารถอัพโหลดไฟล์เอกสาร (PDF, Word, Excel, PowerPoint)"
                disabled={Mode === "Show"}
              />
            )}
            
            <FilePreview forFile="FileDoc" Mode={Mode} previewSrc={attachData.previewPDF} fileName={`ไฟล์เอกสาร : ${attachData.filePDFName}`} downloadTitle="Download" />
          </div>
        </div>
      </div>
    </ReportFileBox>
  );
};

export default ReportFile;
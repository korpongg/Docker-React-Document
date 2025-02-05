import React, { useState, useEffect } from "react";
import { DialogTitle, DialogContent } from "@mui/material";
import ReportFile from "../../form/ReportFile";
import { checkFileExists } from "../../Function";

const EventView = ({ isHA, eventData }) => {
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
  const hostUrl = import.meta.env.VITE_REACT_APP_HOST_URL;
  const [attachData, setAttachData] = useState({
    filePDF: null,
    filePDFName: null,
    previewPDF: null,
    fileImage: null,
    fileImageName: null,
    previewImg: null,
  });

  const fetchAttach = async () => {
    try {
      const imgExtensions = ["jpg", "jpeg", "png"]; // List of image formats to check
      let imgPathLocl = "";
      let imgExt = "";
      let imgExists = false;

      // Check for image files dynamically
      for (const ext of imgExtensions) {
        const imgPath = `${apiUrl}/filemanage/OCC${eventData.reportid}.${ext}`;
        const localPath = `../../../storage/attachfiles/OCC${eventData.reportid}.${ext}`;
        
        if (await checkFileExists(imgPath)) {
          imgPathLocl = localPath;
          imgExt = ext;
          imgExists = true;
          break;
        }
      }
      if (imgExists) {
        setAttachData((prevAttachData) => ({ ...prevAttachData, fileImageName: `OCC${eventData.reportid}.${imgExt}`, previewImg: imgPathLocl }));
      }
      
      const docExtensions = ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx"]; 
      let docPathLocal = "";
      let docExt = "";
      let docExists = false;

      // Check for Doc files dynamically
      for (const ext of docExtensions) {
        const docPath = `${apiUrl}/filemanage/OCC${eventData.reportid}.${ext}`;
        const localPath = `../../../storage/attachfiles/OCC${eventData.reportid}.${ext}`;
        const hostPath = `${hostUrl}/storage/attachfiles/OCC${eventData.reportid}.${ext}`;
        
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
          filePDFName: `OCC${eventData.reportid}.${docExt}`,
          previewPDF: docPathLocal,
        }));
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if(eventData?.reportid) {
      fetchAttach();
    }
  }, [eventData?.reportid]);

  return (
    <>
      {eventData ? (
        <>
          <DialogTitle id="tranfer-dialog-title">
            <div>Report ID : {eventData.reportid}</div>
          </DialogTitle>
          <DialogContent>
            <div className="EventBox">
              <div className="EventRow">
                <div className="EventCol">
                  <div className="EventCell Topic">ใบที่</div>
                  <div className="EventCell Content">{eventData.code}</div>
                </div>
                <div className="EventCol">
                  <div className="EventCell Topic">HN</div>
                  <div className="EventCell Content">{eventData.hn}</div>
                </div>
              </div>
              <div className="EventRow">
                <div className="EventCol">
                  <div className="EventCell Topic">วันที่เกิดเหตุ</div>
                  <div className="EventCell Content">{new Date(eventData.occurrencedate).toLocaleString()}</div>
                </div>
                <div className="EventCol">
                  <div className="EventCell Topic">แผนกที่เกี่ยวข้อง</div>
                  <div className="EventCell Content">{eventData.depname}</div>
                </div>
              </div>
              <div className="EventRow">
                <div className="EventCol">
                  <div className="EventCell Topic">ประเภท</div>
                  <div className="EventCell Content">{eventData.reporttypename}</div>
                </div>
                <div className="EventCol">
                  <div className="EventCell Topic">ความรุนแรง</div>
                  <div className="EventCell Content">{eventData.level}</div>
                </div>
              </div>
              <div className="EventRow">
                <div className="EventCol">
                  <div className="EventCell Topic">ความเร่งด่วน</div>
                  <div className="EventCell Content">{eventData.urgenttype === "0" ? "เร่งด่วน" : "ไม่เร่งด่วน"}</div>
                </div>
                <div className="EventCol">
                  <div className="EventCell Topic">ประเภทอุบัติการณ์</div>
                  <div className="EventCell Content">{eventData.isnew === "0" ? "อุบัติการณ์ใหม่" : "อุบัติการณ์ซ้ำ"}</div>
                </div>
              </div>
            </div>

            {/* {isHA && ( */}
              <div className="EventBox">
                <div className="EventRow"><div className="EventCell AreaTopic">สรุปรายละเอียดเหตุการณ์</div></div>
                <div className="EventRow">
                  <pre className="EventCell AreaContent">{eventData.renew}</pre>
                </div>
              </div>
            {/* )} */}

            <div className="EventBox">
              <div className="EventRow">
                <div className="EventCell AreaTopic">สรุปเหตุการณ์ไม่พึงประสงค์</div>
              </div>
              <div className="EventRow">
                <pre className="EventCell AreaContent">{eventData.summarydetail}</pre>
              </div>
            </div>

            {/* <div className="EventBox">
              <div className="EventRow">
                <div className="EventCell AreaTopic">ความคลาดเคลื่อน / การละเมิดที่เกิดขึ้น</div>
              </div>
              <div className="EventRow">
                <pre className="EventCell AreaContent">{eventData.activefailure ? eventData.activefailure : "-"}</pre>
              </div>
            </div> */}

            {eventData.risk && (
                <div className="EventBox">
                    <div className="EventRow">
                    <div className="EventCell AreaTopic">สรุปเหตุการณ์ความเสี่ยง / เหตุการณ์ไม่พึงประสงค์ที่เกิดขึ้น</div>
                    </div>
                    <div className="EventRow">
                    <pre className="EventCell AreaContent">{eventData.risk}</pre>
                    </div>
                </div>
            )}

            {eventData.factors && (
                <div className="EventBox">
                    <div className="EventRow">
                    <div className="EventCell AreaTopic">ปัจจัยกระตุ้นที่ส่งผลต่อความผิดพลาด / การละเมิดต่อมาตรการป้องกันที่เกิดขึ้น</div>
                    </div>
                    <div className="EventRow">
                    <pre className="EventCell AreaContent">{eventData.factors}</pre>
                    </div>
                </div>
            )}

            {eventData.comment && (
              <div className="EventBox">
                <div className="EventRow">
                  <div className="EventCell AreaTopic">สาเหตุที่แท้จริงของความเสี่ยง / เหตุการณ์ไม่พึงประสงค์ที่เกิดขึ้น</div>
                </div>
                <div className="EventRow">
                  <pre className="EventCell AreaContent">{eventData.comment}</pre>
                </div>
              </div>
            )}

            {eventData.suggestion && (
              <div className="EventBox">
                <div className="EventRow">
                  <div className="EventCell AreaTopic">แนวทางการแก้ปัญหา / มาตราการป้องกันความเสี่ยงที่กำหนดขึ้น</div>
                </div>
                <div className="EventRow">
                  <pre className="EventCell AreaContent">{eventData.suggestion}</pre>
                </div>
              </div>
            )}

            {eventData.forwardtxt && (
              <div className="EventBox">
                <div className="EventRow">
                  <div className="EventCell AreaTopic">สิ่งที่หน่วยงานต้องการประสานกับหน่วยง่านอื่น / คณะกรรมการที่เกี่ยวข้อง</div>
                </div>
                <div className="EventRow">
                  <pre className="EventCell AreaContent">{eventData.forwardtxt}</pre>
                </div>
              </div>
            )}
            
            <ReportFile Mode="Show" attachData={attachData} handleImgChange="" handleFileChange="" />

            {/* <Grid2 container spacing={1}>
              <Grid2 xs={12} sm={6}>
                <strong>ใบที่:</strong> {eventData.code}
              </Grid2>
              <Grid2 xs={12} sm={6}>
                <strong>HN/AN:</strong> {eventData.hn}
              </Grid2>
              <Grid2 xs={12} sm={6}>
                <strong>วันที่เกิดเหตุ:</strong>{" "}
                {new Date(eventData.occurrencedate).toLocaleString()}
              </Grid2>
              <Grid2 xs={12} sm={6}>
                <strong>แผนกที่เกี่ยวข้อง:</strong> {eventData.depname}
              </Grid2>
              <Grid2 xs={12} sm={6}>
                <strong>ประเภท:</strong> {eventData.reporttypename}
              </Grid2>
              <Grid2 xs={12} sm={6}>
                <strong>ความรุนแรง:</strong> {eventData.level}
              </Grid2>
              <Grid2 xs={12} sm={6}>
                <strong>ความเร่งด่วน:</strong>{" "}
                {eventData.urgenttype === "0" ? "เร่งด่วน" : "ไม่เร่งด่วน"}
              </Grid2>
              <Grid2 xs={12} sm={6}>
                <strong>ประเภทอุบัติการณ์:</strong>{" "}
                {eventData.isnew === "0" ? "อุบัติการณ์ใหม่" : "อุบัติการณ์ซ้ำ"}
              </Grid2>

              {isHA && (
                <Grid2 xs={12}>
                  <u>
                    <strong>บันทึกรายละเอียด</strong>
                  </u>
                  <pre>{eventData.description}</pre>
                </Grid2>
              )}

              <Grid2 xs={12}>
                <u>
                  <strong>สรุปรายละเอียดเหตุการณ์</strong>
                </u>
                <pre>{eventData.summarydetail}</pre>
              </Grid2>

              <Grid2 xs={12}>
                <u>
                  <strong>ความคลาดเคลื่อน / การละเมิดที่เกิดขึ้น</strong>
                </u>
                <pre>
                  {eventData.activefailure ? eventData.activefailure : "-"}
                </pre>
              </Grid2>

              {eventData.comment && (
                <Grid2 xs={12}>
                  <u>
                    <strong>สรุปเหตุการณ์ไม่พึงประสงค์</strong>
                  </u>
                  <pre>{eventData.comment}</pre>
                </Grid2>
              )}
            </Grid2> */}
          </DialogContent>
        </>
      ) : (
        <span>ไม่มีข้อมูล</span>
      )}
    </>
  );
};

export default EventView;

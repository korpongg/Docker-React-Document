import * as React from "react";
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { getCurrentDateNoT } from "../components/Function";
import DataDict_Risk from "../data/form/DataDict_Risk";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ReportView({ Mode, data }) {
  const [open, setOpen] = React.useState(false);
//   const maxlengthdept = 0;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function getTitleFromCode(topic, code) {
    if (DataDict_Risk[topic]) {
      const option = DataDict_Risk[topic].options.find(option => option.code === code);
      if (option) {
        return option.title;
      } else {
        return `Code ${code} not found in topic ${topic}`;
      }
    } else {
      return `Topic ${topic} not found`;
    }
  }

//   console.log(maxlengthdept)

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Open full-screen dialog
      </Button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {Mode}
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClose}>
              save
            </Button>
          </Toolbar>
        </AppBar>

    <div className="ReportViewStyle">
            <div className="ReportViewHeader">รายงานเหตุการณ์</div>
            <div className="ReportViewContainer">
                <div className="ReportViewTable">
                    <div className="ReportViewTable_Row">
                        <span className="ReportViewTable_Topic">รหัสพนักงาน</span>
                        <span className="ReportViewTable_Content">{data?.createby || "-"}</span>
                    </div>
                    {/* <div className="ReportViewTable_Row">
                        <span className="ReportViewTable_Topic">ชื่อ-นามสกุล</span>
                        <span className="ReportViewTable_Content">{data?.requestby || "-"}</span>
                    </div> */}
                    <div className="ReportViewTable_Row">
                        <span className="ReportViewTable_Topic">HN</span>
                        <span className="ReportViewTable_Content">{data?.hn || "-"}</span>
                    </div>
                    <div className="ReportViewTable_Row">
                        <span className="ReportViewTable_Topic">AN</span>
                        <span className="ReportViewTable_Content">{data?.an || "-"}</span>
                    </div>
                    <div className="ReportViewTable_Row">
                        <span className="ReportViewTable_Topic">อายุ</span>
                        <span className="ReportViewTable_Content">{data?.age || "-"}</span>
                    </div>
                    <div className="ReportViewTable_Row">
                        <span className="ReportViewTable_Topic">เพศ</span>
                        <span className="ReportViewTable_Content">{data?.gender || "-"}</span>
                    </div>
                    <div className="ReportViewTable_Row">
                        <span className="ReportViewTable_Topic">สังกัด</span>
                        <span className="ReportViewTable_Content">{data?.aff || "-"}</span>
                    </div>
                    <div className="ReportViewTable_Row">
                        <span className="ReportViewTable_Topic">ฝ่าย</span>
                        <span className="ReportViewTable_Content">{data?.faction || "-"}</span>
                    </div>
                    <div className="ReportViewTable_Row">
                        <span className="ReportViewTable_Topic">แผนก</span>
                        <span className="ReportViewTable_Content">{data?.dep || "-"}</span>
                    </div>
                </div>

                <div className="ReportViewTable">
                    <div className="ReportViewTable_Row">
                        <span className="ReportViewTable_Topic">ประเภท</span>
                        <span className="ReportViewTable_Content">{data?.type || "-"}</span>
                    </div>
                    <div className="ReportViewTable_Row">
                        <span className="ReportViewTable_Topic">สถานที่เกิดเหตุ</span>
                        <span className="ReportViewTable_Content">{data?.reportlocation || "-"}</span>
                    </div>
                    <div className="ReportViewTable_Row">
                        <span className="ReportViewTable_Topic">วัน-เวลาที่รายงานเหตุการณ์</span>
                        <span className="ReportViewTable_Content">{getCurrentDateNoT(data?.reportdate) || "-"}</span>
                    </div>
                    <div className="ReportViewTable_Row">
                        <span className="ReportViewTable_Topic">วัน-เวลาที่เกิดเหตุการณ์</span>
                        <span className="ReportViewTable_Content">{getCurrentDateNoT(data?.occurrencedate) || "-"}</span>
                    </div>
                    <div className="ReportViewTable_Row">
                        <span className="ReportViewTable_Topic">หน่วยงานที่เกี่ยวข้อง</span>
                        <span className="ReportViewTable_Content">
                            {
                                data?.deptAffInfo ? 
                                (
                                    data?.deptAffInfo.map((row,index)=>(
                                        <div key={index}>{row.DepName},</div>
                                    ))
                                ) :
                                 "-"
                            }
                        </span>
                    </div>
                                        
                </div>

                
            </div>

            <div className="ReportViewContainer">
                                
                <div className="ReportViewTable">
                    <div className="ReportViewTable_Row">
                        <span className="ReportViewTable_Topic">Dx.</span>
                        <span className="ReportViewTable_Content">{data?.dx || "-"}</span>
                    </div>
                    <div className="ReportViewTable_Row">
                        <span className="ReportViewTable_Topic">PCT ที่เกี่ยวข้อง</span>
                        <span className="ReportViewTable_Content">{data?.pct || "-"}</span>
                    </div>
                                                            
                </div>

                
            </div>

            <div className="ReportViewContainer">
                                
                <div className="ReportViewTable">
                    <div className="ReportViewTable_Row">
                        <span className="ReportViewTable_Topic">ประเภทอุบัติการณ์</span>
                        <span className="ReportViewTable_Content">{data?.reporttype && data?.reporttype==="0" ? "General Risk" : "Clinical Risk"|| "-"}</span>
                    </div>
                    <div className="ReportViewTable_Row">
                        <span className="ReportViewTable_Topic">ระดับความเสี่ยงอุบัติการณ์</span>
                        <span className="ReportViewTable_Content">
                            {/* {data?.level || "-"} */}
                            {data?.level+" "+getTitleFromCode("ClinicalRisk", "A")}
                        </span>
                    </div>
                                                            
                </div>

                
            </div>
            <div className="ReportViewContainer">
                                
                <div className="ReportViewTable">
                    <div className="ReportViewTable_Row">
                        หัวข้อที่เกี่ยวข้องกับระบบงาน
                    </div>
                    <div className="ReportViewTable_Row">
                        <span className="ReportViewTable_Full">สถานที่เกิดเหตุ</span>
                    </div>
                    <div className="ReportViewTable_Row">
                        <span className="ReportViewTable_Full">วัน-เวลาที่รายงานเหตุการณ์</span>
                    </div>

                                                            
                </div>

                
            </div>


    </div>
       


        
      </Dialog>
    </React.Fragment>
  );
}

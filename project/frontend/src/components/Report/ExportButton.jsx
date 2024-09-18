import React from 'react';
import { Button } from '@mui/material';
import * as XLSX from 'xlsx';
import DownloadIcon from '@mui/icons-material/FileDownloadRounded';
import { formatDateTimeN7 } from '../Function';
import requestStatusData from "../label.json";

const ExportButton = ({ data, fileName, label = 'Export' }) => {

  const exportToExcel = () => {
    const statusMap = requestStatusData.subStatus.reduce((map, status) => {
      map[status.id] = { text: status.statusText, color: status.statusColor };
      return map;
    }, {});

    const wb = XLSX.utils.book_new();
    
    const sheetData = [
      [
        "ใบที่",
        "HN",
        "สถานะ",
        "วันที่เกิดเหตุ",
        "แผนก",
        "ประเภท",
        "ความรุนแรง",
        "สรุปรายละเอียดเหตุการณ์",
        "สรุปเหตุการณ์ไม่พึงประสงค์",
        "ปัจจัยกระตุ้นให้เกิดความคลาดเคลื่อน",
        "ผลการวิเคราะห์สาเหตุที่แท้จริง",
        "มาตราการป้องกัน",
        "วันที่ส่งทบทวน",
        "วันที่ส่งทบทวนซ้ำ",
      ]
    ];

    data.forEach((rowData) => {
      const statusInfo = statusMap[rowData.status];
      const row = [
        rowData.code,
        rowData.hn,
        statusInfo.text,
        rowData.occurrencedate ? formatDateTimeN7(rowData.occurrencedate) : '',
        rowData.depname,
        rowData.reporttypename,
        rowData.level,
        rowData.renew,
        rowData.summarydetail,
        rowData.factors,
        rowData.comment,
        rowData.suggestion,
        rowData.createAt ? formatDateTimeN7(rowData.createAt) : '',
        rowData.repeatAt ? formatDateTimeN7(rowData.repeatAt) : '',
      ];

      sheetData.push(row);
    });

    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, fileName);
  };

  return (
    <Button
      variant="contained"
      onClick={exportToExcel}
      sx={{
        background: 'darkgreen', color: 'white', textTransform: 'none',
        ':hover': { background: 'green' }
      }}
      startIcon={<DownloadIcon />}
      disabled={data.length <=0}
    >
      {label}
    </Button>
  );
};

export default ExportButton;
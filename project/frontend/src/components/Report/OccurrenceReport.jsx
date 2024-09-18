import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid, GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector, GridToolbarExportContainer, GridCsvExportMenuItem } from "@mui/x-data-grid";
import { Box, Link, Select, MenuItem } from "@mui/material";
import { formatDateTimeN7 } from "../Function";
import { ReportBox } from '../../styles/Report.style';
import SearchBox from './SearchBox';

const csvOptions = (type) => ({
  fileName: type === 'occurrence' ? 'รายงานอุบัติการณ์' : 'รายงานความคลาดเคลื่อนทางยา',
  utf8WithBom: true
});

function EditToolbar({ type }) {
  return (
    <GridToolbarContainer style={{ padding: "10px 10px 0" }}>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExportContainer sx={{ background: 'green !important', color: 'white', padding: '3px 12px', textTransform: 'none' }} >
        <GridCsvExportMenuItem options={csvOptions(type)} />
      </GridToolbarExportContainer>
    </GridToolbarContainer>
  );
}

function ExpandableCell({ value }) {
  const [expanded, setExpanded] = React.useState(false);
  if (!value) return null;

  // Function to split value into lines
  const renderLines = (text) => {
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <div style={{ wordBreak: 'break-all' }}>
      {expanded ? renderLines(value) : renderLines(value.slice(0, 100))}
      {value.length > 100 && (
        <Link
          type="button"
          component="button"
          sx={{ fontSize: "inherit" }}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "ดูน้อยลง" : "ดูเพิ่มเติม"}
        </Link>
      )}
    </div>
  );
}

const getDefaultDate = () => new Date().toISOString().split('T')[0];

const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

const OccurrenceReport = () => {
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState(getDefaultDate());
  const [endDate, setEndDate] = useState(getDefaultDate());
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState('occurrence');

  // Fetch data based on start and end dates
  const fetchData = async () => {
    setLoading(true);
    try {
      const storedAuth = JSON.parse(localStorage.getItem("auth"));
      const config = { headers: { Authorization: `Bearer ${storedAuth.accessToken}` } };
      const baseUrl = reportType === 'occurrence' ? `${apiUrl}/events/reports` : `${apiUrl}/medication/reports`;
      const url = `${baseUrl}/${startDate}/${endDate}`;
      const response = await axios.get(url, config);
      if (response.status === 200 || response.status === 201) {
        setData(response.data);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch data on component mount
  }, []);

  useEffect(() => {
    setData([])
  }, [reportType]);

  // Columns for Data Grid
  const occurrenceColumns = [
    { field: "code", headerName: "ใบที่", minWidth: 150, flex: 1, align: "center", headerAlign: "center" },
    { field: "hn", headerName: "HN", minWidth: 180, flex: 1, align: "center", headerAlign: "center" },
    {
      field: "occurrencedate", headerName: "วันที่เกิดเหตุ", minWidth: 150, flex: 1, align: "center", headerAlign: "center",
      valueGetter: (params) => params.value ? formatDateTimeN7(params.value, "dmy") : ''
    },
    { field: "depname", headerName: "แผนกที่เกี่ยวข้อง", minWidth: 180, flex: 1, align: "center", headerAlign: "center", sortable: false, filterable: false },
    { field: "affname", headerName: "ฝ่าย", minWidth: 180, flex: 1, align: "center", headerAlign: "center", sortable: false, filterable: false },
    { field: "reporttypename", headerName: "ประเภท", minWidth: 150, flex: 1, align: "center", headerAlign: "center" },
    { field: "level", headerName: "ความรุนแรง", minWidth: 120, flex: 1, align: "center", headerAlign: "center" },
    {
      field: "renew", headerName: "สรุปรายละเอียดเหตุการณ์", minWidth: 300, flex: 1, align: "center", headerAlign: "center", sortable: false, filterable: false,
      renderCell: (params) => <ExpandableCell {...params} />,
    },
    {
      field: "summarydetail", headerName: "สรุปเหตุการณ์ไม่พึงประสงค์", minWidth: 300, flex: 1, align: "center", headerAlign: "center", sortable: false, filterable: false,
      renderCell: (params) => <ExpandableCell {...params} />,
    },
    // {
    //   field: "activefailure", headerName: "ความคลาดเคลื่อน", minWidth: 300, flex: 1, align: "center", headerAlign: "center", sortable: false, filterable: false,
    //   renderCell: (params) => <ExpandableCell {...params} />,
    // },
    {
      field: "factors", headerName: "ปัจจัยกระตุ้นให้เกิดความคลาดเคลื่อน", minWidth: 300, flex: 1, align: "center", headerAlign: "center", sortable: false, filterable: false,
      renderCell: (params) => <ExpandableCell {...params} />,
    },
    {
      field: "comment", headerName: "ผลการวิเคราะห์สาเหตุที่แท้จริง", minWidth: 300, flex: 1, align: "center", headerAlign: "center", sortable: false, filterable: false,
      renderCell: (params) => <ExpandableCell {...params} />,
    },
    {
      field: "suggestion", headerName: "มาตราการป้องกัน", minWidth: 300, flex: 1, align: "center", headerAlign: "center", sortable: false, filterable: false,
      renderCell: (params) => <ExpandableCell {...params} />,
    },
    // {
    //   field: "forwardtxt", headerName: "ประสานกับหน่วยง่านอื่น", minWidth: 300, flex: 1, align: "center", headerAlign: "center", sortable: false, filterable: false,
    //   renderCell: (params) => <ExpandableCell {...params} />,
    // },
    { field: "requestdep", headerName: "หน่วยงานที่รายงาน", minWidth: 180, flex: 1, align: "center", headerAlign: "center", sortable: false, filterable: false },
    { field: "requestaff", headerName: "ฝ่าย", minWidth: 180, flex: 1, align: "center", headerAlign: "center", sortable: false, filterable: false },
    { field: "occtype", headerName: "OPD / IPD", minWidth: 150, flex: 1, align: "center", headerAlign: "center" },
    {
      field: "reportcode", headerName: "Code", minWidth: 200, flex: 1, align: "center", headerAlign: "center", sortable: false, filterable: false,
      renderCell: (params) => <ExpandableCell {...params} />,
    },
    {
      field: "createAt", headerName: "วันที่ส่งทบทวน", minWidth: 150, flex: 1, align: "center", headerAlign: "center",
      valueGetter: (params) => params.value ? formatDateTimeN7(params.value, "dmy") : ''
    },
    {
      field: "repeatAt", headerName: "วันที่ส่งทบทวนซ้ำ", minWidth: 155, flex: 1, align: "center", headerAlign: "center",
      valueGetter: (params) => params.value ? formatDateTimeN7(params.value, "dmy") : ''
    },
    {
      field: "acceptAt", headerName: "วันที่ตอบกลับ", minWidth: 150, flex: 1, align: "center", headerAlign: "center",
      valueGetter: (params) => params.value ? formatDateTimeN7(params.value, "dmy") : ''
    },
    { field: "selfreport", headerName: "Self Report", minWidth: 130, flex: 1, align: "center", headerAlign: "center" },
    { field: "timelyreport", headerName: "Timely Report", minWidth: 150, flex: 1, align: "center", headerAlign: "center" },
  ];

  const medicationColumns = [
    { field: "reportid", headerName: "ใบที่", minWidth: 150, flex: 1, align: "center", headerAlign: "center" },
    {
      field: "occurrencedate", headerName: "วันที่เกิดเหตุ", minWidth: 150, flex: 1, align: "center", headerAlign: "center",
      valueGetter: (params) => params.value ? formatDateTimeN7(params.value, "dmy") : ''
    },
    { field: "hn", headerName: "HN", minWidth: 180, flex: 1, align: "center", headerAlign: "center" },
    { field: "an", headerName: "AN/VN", minWidth: 150, flex: 1, align: "center", headerAlign: "center" },
    { field: "age", headerName: "อายุ", minWidth: 80, flex: 1, align: "center", headerAlign: "center" },
    { field: "medtype", headerName: "OPD / IPD", minWidth: 150, flex: 1, align: "center", headerAlign: "center" },
    {
      field: "renew", headerName: "สรุปรายละเอียดเหตุการณ์", minWidth: 300, flex: 1, align: "center", headerAlign: "center", sortable: false, filterable: false,
      renderCell: (params) => <ExpandableCell {...params} />,
    },
    { field: "level", headerName: "ความรุนแรง", minWidth: 120, flex: 1, align: "center", headerAlign: "center" },
    { field: "reporttypename", headerName: "ประเภท", minWidth: 150, flex: 1, align: "center", headerAlign: "center" },
    { field: "depname", headerName: "แผนกที่เกี่ยวข้อง", minWidth: 180, flex: 1, align: "center", headerAlign: "center" },
    {
      field: "errortype", headerName: "ประเภทความคลาดเคลื่อน", minWidth: 250, flex: 1, align: "center", headerAlign: "center", sortable: false, filterable: false,
      renderCell: (params) => <ExpandableCell {...params} />,
    },
    {
      field: "error", headerName: "ความคลาดเคลื่อนที่เกิดขึ้น", minWidth: 300, flex: 1, align: "center", headerAlign: "center", sortable: false, filterable: false,
      renderCell: (params) => <ExpandableCell {...params} />,
    },
    {
      field: "rca", headerName: "RCA", minWidth: 300, flex: 1, align: "center", headerAlign: "center", sortable: false, filterable: false,
      renderCell: (params) => <ExpandableCell {...params} />,
    },
    {
      field: "analysis", headerName: "ผลการวิเคราะห์สาเหตุ", minWidth: 300, flex: 1, align: "center", headerAlign: "center", sortable: false, filterable: false,
      renderCell: (params) => <ExpandableCell {...params} />,
    },
    {
      field: "solution", headerName: "มาตรการป้องกัน", minWidth: 300, flex: 1, align: "center", headerAlign: "center", sortable: false, filterable: false,
      renderCell: (params) => <ExpandableCell {...params} />,
    },
    { field: "requestdep", headerName: "หน่วยงานที่รายงาน", minWidth: 180, flex: 1, align: "center", headerAlign: "center" },
    { field: "requestaff", headerName: "ฝ่าย", minWidth: 180, flex: 1, align: "center", headerAlign: "center" },
    {
      field: "reportcode", headerName: "Code", minWidth: 200, flex: 1, align: "center", headerAlign: "center", sortable: false, filterable: false,
      renderCell: (params) => <ExpandableCell {...params} />,
    },
    // {
    //   field: "description", headerName: "Events", minWidth: 300, flex: 1, align: "center", headerAlign: "center", sortable: false, filterable: false,
    //   renderCell: (params) => <ExpandableCell {...params} />,
    // },
    {
      field: "renewAt", headerName: "วันที่ส่งทบทวน", minWidth: 150, flex: 1, align: "center", headerAlign: "center",
      valueGetter: (params) => params.value ? formatDateTimeN7(params.value, "dmy") : ''
    },
    {
      field: "approveAt", headerName: "วันที่ตอบกลับ", minWidth: 150, flex: 1, align: "center", headerAlign: "center",
      valueGetter: (params) => params.value ? formatDateTimeN7(params.value, "dmy") : ''
    },
    { field: "selfreport", headerName: "Self Report", minWidth: 130, flex: 1, align: "center", headerAlign: "center" },
    { field: "timelyreport", headerName: "Timely Report", minWidth: 150, flex: 1, align: "center", headerAlign: "center" },
  ];

  const columns = reportType === 'occurrence' ? occurrenceColumns : medicationColumns;

  return (
    <ReportBox>
      <h1>{reportType === 'occurrence' ? 'รายงานอุบัติการณ์' : 'รายงานความคลาดเคลื่อนทางยา'}</h1>
      <SearchBox
        reportType={reportType}
        setReportType={setReportType}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        fetchData={fetchData}
      />
      
      <DataGrid
        autoHeight
        rows={data}
        columns={columns}
        getRowHeight={() => 'auto'}
        getEstimatedRowHeight={() => 200}
        disableRowSelectionOnClick
        hideFooterSelectedRowCount={true}
        initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
        pageSizeOptions={[10, 25, 50, 100]}
        getRowClassName={(params) => params.indexRelativeToCurrentPage % 2 === 0 ? "even-row" : "odd-row" }
        slots={{ toolbar: () => <EditToolbar type={reportType} /> }}
        localeText={{ toolbarColumns: "คอลัมน์", toolbarFilters: "ตัวกรอง", toolbarDensity: "ระยะห่าง", toolbarExport: "Excel" }}
        loading={loading}
        sx={{
          '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': { py: 1 },
          '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': { py: '15px' },
          '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': { py: '22px' },
          '& .MuiDataGrid-cell': { alignItems: 'flex-start' },
        }}
      />
    </ReportBox>
  );
};

export default OccurrenceReport;
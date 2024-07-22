import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid, GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector, GridToolbarExportContainer, GridCsvExportMenuItem } from "@mui/x-data-grid";
import { Box, Link, Select, MenuItem } from "@mui/material";
import { formatDateTimeN7 } from "../Function";
import { ReportBox } from '../../styles/Report.style';
import SearchBox from './SearchBox';

const csvOptions = { utf8WithBom: true };

function EditToolbar() {
  return (
    <GridToolbarContainer style={{ padding: "10px 10px 0" }}>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExportContainer sx={{ background: 'green !important', color: 'white', padding: '3px 12px', textTransform: 'none' }} >
        <GridCsvExportMenuItem options={csvOptions} />
      </GridToolbarExportContainer>
    </GridToolbarContainer>
  );
}

function ExpandableCell({ value }) {
  const [expanded, setExpanded] = React.useState(false);

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
    <>
      {value && (
        <div>
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
      )}
    </>
  );
}

const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

const OccurrenceReport = () => {
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]); // Default to today
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]); // Default to today
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState('occurrence');

  // Fetch data based on start and end dates
  const fetchData = async () => {
    setLoading(true);
    try {
      const storedAuth = JSON.parse(localStorage.getItem("auth"));
      const config = { headers: { Authorization: `Bearer ${storedAuth.accessToken}` } };
      const url = reportType === 'occurrence'
        ? `${apiUrl}/events/reports/${startDate}/${endDate}`
        : `${apiUrl}/medication/reports/${startDate}/${endDate}`;
      const response = await axios.get(url, { ...config });
      if (response.status === 200 || response.status === 201 ) {
        setData(response.data);
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
    { field: "depname", headerName: "แผนก", minWidth: 180, flex: 1, align: "center", headerAlign: "center", sortable: false, filterable: false },
    { field: "reporttypename", headerName: "ประเภท", minWidth: 150, flex: 1, align: "center", headerAlign: "center" },
    { field: "level", headerName: "ความรุนแรง", minWidth: 120, flex: 1, align: "center", headerAlign: "center" },
    {
      field: "summarydetail", headerName: "สรุปเหตุการณ์ไม่พึงประสงค์", minWidth: 300, flex: 1, align: "center", headerAlign: "center", sortable: false, filterable: false,
      renderCell: (params) => <ExpandableCell {...params} />,
    },
    {
      field: "renew", headerName: "รายละเอียดเหตุการณ์", minWidth: 300, flex: 1, align: "center", headerAlign: "center", sortable: false, filterable: false,
      renderCell: (params) => <ExpandableCell {...params} />,
    },
    {
      field: "activefailure", headerName: "ความคลาดเคลื่อน", minWidth: 300, flex: 1, align: "center", headerAlign: "center", sortable: false, filterable: false,
      renderCell: (params) => <ExpandableCell {...params} />,
    },
    {
      field: "comment", headerName: "ปัจจัยกระตุ้นให้เกิดความคลาดเคลื่อน", minWidth: 300, flex: 1, align: "center", headerAlign: "center", sortable: false, filterable: false,
      renderCell: (params) => <ExpandableCell {...params} />,
    },
    {
      field: "suggestion", headerName: "ผลการวิเคราะห์สาเหตุที่แท้จริง", minWidth: 300, flex: 1, align: "center", headerAlign: "center", sortable: false, filterable: false,
      renderCell: (params) => <ExpandableCell {...params} />,
    },
    {
      field: "forwardtxt", headerName: "มาตราการป้องกัน", minWidth: 300, flex: 1, align: "center", headerAlign: "center", sortable: false, filterable: false,
      renderCell: (params) => <ExpandableCell {...params} />,
    },
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
    { field: "type", headerName: "O/I", minWidth: 80, flex: 1, align: "center", headerAlign: "center" },
    {
      field: "description", headerName: "Events", minWidth: 300, flex: 1, align: "center", headerAlign: "center", sortable: false, filterable: false,
      renderCell: (params) => <ExpandableCell {...params} />,
    },
    { field: "level", headerName: "Harm", minWidth: 120, flex: 1, align: "center", headerAlign: "center" },
    {
      field: "error", headerName: "ประเภท", minWidth: 300, flex: 1, align: "center", headerAlign: "center", sortable: false, filterable: false,
      renderCell: (params) => <ExpandableCell {...params} />,
    },
    {
      field: "errortype", headerName: "ประเภท 2", minWidth: 250, flex: 1, align: "center", headerAlign: "center", sortable: false, filterable: false,
      renderCell: (params) => <ExpandableCell {...params} />,
    },
    { field: "depname", headerName: "แผนก", minWidth: 180, flex: 1, align: "center", headerAlign: "center" },
    {
      field: "rca", headerName: "RCA", minWidth: 300, flex: 1, align: "center", headerAlign: "center", sortable: false, filterable: false,
      renderCell: (params) => <ExpandableCell {...params} />,
    },
    { field: "requestdep", headerName: "หน่วยงานที่รายงาน", minWidth: 180, flex: 1, align: "center", headerAlign: "center" },
  ];

  return (
    <ReportBox>
      <h1>รายงานอุบัติการณ์</h1>
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
        columns={reportType === 'occurrence' ? occurrenceColumns : medicationColumns}
        getRowHeight={() => 'auto'}
        getEstimatedRowHeight={() => 200}
        disableRowSelectionOnClick
        hideFooterSelectedRowCount={true}
        initialState={{
          pagination: { paginationModel: { page: 0, pageSize: 10 } },
        }}
        pageSizeOptions={[10, 25, 50, 100]}
        getRowClassName={(params) => params.indexRelativeToCurrentPage % 2 === 0 ? "even-row" : "odd-row" }
        slots={{ toolbar: () => <EditToolbar /> }}
        localeText={{ toolbarColumns: "คอลัมน์", toolbarFilters: "ตัวกรอง", toolbarDensity: "ระยะห่าง", toolbarExport: "Excel" }}
        loading={loading}
        sx={{
          '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': {
            py: 1,
          },
          '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': {
            py: '15px',
          },
          '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': {
            py: '22px',
          },
          '& .MuiDataGrid-cell': {
            alignItems: 'flex-start',
          },
        }}
      />
    </ReportBox>
  );
};

export default OccurrenceReport;
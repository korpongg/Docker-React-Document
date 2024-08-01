import React, { useState, useEffect } from "react";
import { Button, Box, Tooltip, Link } from "@mui/material";
import { DataGrid, GridToolbarContainer, GridToolbar, GridToolbarQuickFilter, GridActionsCellItem } from "@mui/x-data-grid";
import { Add as AddIcon, DescriptionRounded as FileIcon, SwapHorizRounded as RotateIcon, SendRounded as SendIcon, FindInPageRounded as ViewIcon, Edit as EditIcon, RefreshRounded as CloseIcon, DeleteForeverRounded as DeleteIcon } from "@mui/icons-material";
import { formatDateTimeN7 } from "../../Function";
import requestStatusData from "../../label.json";

function EditToolbar({ handleAddItem, loading }) {
  return (
    <GridToolbarContainer style={{ justifyContent: "space-between", padding: "10px 10px 0" }}>
      <div>
        <Button variant="contained" onClick={handleAddItem} startIcon={<AddIcon />} style={{ marginRight: 10 }}>บันทึกอุบัติการณ์</Button>
      </div>
      {/* <GridToolbar /> */}
      <GridToolbarQuickFilter />
    </GridToolbarContainer>
  );
}

function ExpandableCell({ value }) {
  const [expanded, setExpanded] = React.useState(false);
  if (!value) { return null; }
  
  return (
    <div style={{ wordBreak: 'break-all' }}>
      {expanded ? value : value.slice(0, 200)}&nbsp;
      {value.length > 200 && (
        <Link
          type="button"
          component="button"
          sx={{ fontSize: 'inherit' }}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'ดูน้อยลง' : 'ดูเพิ่มเติม'}
        </Link>
      )}
    </div>
  );
}

const DataTable = ({ data, isAdmin, isEXEC, userData, handleAddItem, handleViewClick, handleTranfClick, handleCloseClick, handleEditClick, handleDeleteClick, loading }) => {
  // console.log(data);
  const statusMap = {};
  requestStatusData.reportStatus.forEach(status => {
    statusMap[status.id] = { text: status.statusText, color: status.statusColor };
  });

  const renderDeptrelateCell = (params) => {
    const deptAffInfo = Array.isArray(params.row.deptAffInfo) ? params.row.deptAffInfo : [];
    const deptNames = deptAffInfo.map(dept => dept.DepName).join(", ");
    return (
      <Tooltip title={deptNames}><div className="MuiDataGrid-cellContent" role="presentation">{deptNames}</div></Tooltip>
    );
  };

  const shouldShowButton = (row) => {
    const isGeneralRisk = row.reporttypename === 'General Risk';
    const levelCheck = isGeneralRisk ? parseInt(row.level, 10) > 2 : ["D", "E", "F", "G", "H", "I"].includes(row.level);
    
    return isAdmin && row.renew && levelCheck && (row.formstatus === '1' || row.formstatus === '2' || row.formstatus === '4');
  };

  const shouldShowLowlvButton = (row) => {
    const isGeneralRisk = row.reporttypename === 'General Risk';
    const levelCheck = isGeneralRisk ? parseInt(row.level, 10) > 2 : ["D", "E", "F", "G", "H", "I"].includes(row.level);
  
    return isAdmin && row.renew && !levelCheck && (row.formstatus === '1' || row.formstatus === '2' || row.formstatus === '4');
  };

  const columns = [
    {
      field: "formstatus",
      headerName: "สถานะ",
      minWidth: 180,
      flex: 1,
      align: "center",
      headerAlign: "center",
      // sortable: false,
      filterable: false,
      renderCell: (params) => {
        const statusId = params.row.formstatus;
        const statusInfo = statusMap[statusId];
        return <div className={`post-status ${statusInfo.color}`}>{statusInfo.text}</div>;
      },
    },
    { field: "reportid", headerName: "ReportId", minWidth: 120, flex: 1, align: "center", headerAlign: "center", },
    { field: "hn", headerName: "HN", minWidth: 180, flex: 1, align: "center", headerAlign: "center" },
    {
      field: "createAt",
      headerName: "วันที่รายงาน",
      minWidth: 140,
      flex: 1,
      align: "center",
      headerAlign: "center",
      valueGetter: (params) => params ? formatDateTimeN7(params.value, "dmy") : '',
    },
    {
      field: "occurrencedate",
      headerName: "วันที่เกิดเหตุ",
      minWidth: 140,
      flex: 1,
      align: "center",
      headerAlign: "center",
      valueGetter: (params) => params ? formatDateTimeN7(params.value, "dmy") : '',
    },
    {
      field: "deptAffInfo",
      headerName: "แผนก",
      minWidth: 170,
      flex: 1,
      align: "center",
      headerAlign: "center",
      sortable: false,
      filterable: false,
      renderCell: renderDeptrelateCell,
    },
    { field: "reporttypename", headerName: "ประเภท", minWidth: 140, flex: 1, align: "center", headerAlign: "center" },
    {
      field: "level", headerName: "ความรุนแรง", minWidth: 100, flex: 1, align: "center", headerAlign: "center",
      renderCell: (params) => {
        const highLV = ["3", "4", "5", "D", "E", "F", "G", "H", "I"].includes(params.row.level);
        return <div className={`${highLV ? 'HighLV' : ''}`}>{params.row.level}</div>;
      },
    },
    {
      field: "description",
      headerName: "รายละเอียดเหตุการณ์",
      minWidth: 340,
      flex: 1,
      align: "center",
      headerAlign: "center",
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const { row } = params;
        const showDescription = isAdmin || (isEXEC && userData.affiliation === "งานคุณภาพ") || (row.createby === userData.userid);

        return showDescription ? <ExpandableCell {...params} /> : "-";
      },
    },
    {
      field: "actions",
      type: "actions",
      headerName: "จัดการ",
      minWidth: 140,
      flex: 1,
      cellClassName: "actions",
      align: "center",
      headerAlign: "center",
      renderCell: ({ id, row }) => (
        <>
          <Tooltip title="ดูบันทึกอุบัติการณ์">
            <GridActionsCellItem
              icon={<FileIcon />}
              label="ดูบันทึกอุบัติการณ์"
              onClick={() => handleViewClick(id, row)}
              color="primary"
            />
          </Tooltip>
          
          {shouldShowButton(row) && (
            <Tooltip title={row.formstatus === '1' || row.formstatus === '4' ? 'ส่งต่อรายงาน' : 'ดูรายงานส่งต่อ'}>
              <GridActionsCellItem
                icon={row.formstatus === '1' || row.formstatus === '4' ? <RotateIcon /> : <ViewIcon />}
                label={row.formstatus === '1' || row.formstatus === '4' ? 'ส่งต่อรายงาน' : 'ดูรายงานส่งต่อ'}
                onClick={() => handleTranfClick(id, row)}
                color="secondary"
              />
            </Tooltip>
          )}
          
          {shouldShowLowlvButton(row) && (
            <Tooltip title={row.formstatus === '1' || row.formstatus === '4' ? 'ส่งรายงาน' : 'ดูรายงาน'}>
              <GridActionsCellItem
                icon={row.formstatus === '1' || row.formstatus === '4' ? <SendIcon /> : <ViewIcon />}
                label={row.formstatus === '1' || row.formstatus === '4' ? 'ส่งรายงาน' : 'ดูรายงาน'}
                onClick={() => handleTranfClick(id, row, 1)}
                color="secondary"
              />
            </Tooltip>
          )}
          
          {isAdmin && (row.formstatus === '1' || row.formstatus === '4') && (
            <Tooltip title="Update">
              <GridActionsCellItem
                icon={<CloseIcon />}
                label="Update"
                className="rotate-icon"
                onClick={() => handleCloseClick(id, row)}
                color="success"
              />
            </Tooltip>
          )}

          {(userData.userid === row.createby || isAdmin) && row.deleteAt === null && (row.formstatus === '0' || row.formstatus === '1' || row.formstatus === '4') && (
            <>
              <Tooltip title="แก้ไขข้อมูลอุบัติการณ์">
                <GridActionsCellItem
                  icon={<EditIcon />}
                  label="แก้ไขข้อมูลอุบัติการณ์"
                  onClick={() => handleEditClick(id, row)}
                  color="warning"
                />
              </Tooltip>

              <Tooltip title="ยกเลิกรายการ">
                <GridActionsCellItem
                  icon={<DeleteIcon />}
                  label="ยกเลิกรายการ"
                  onClick={() => handleDeleteClick(id, row)}
                  color="error"
                />
              </Tooltip>
            </>
          )}
        </>
      ),
    },
  ];

  const filteredColumns = columns.filter(column => column !== null);

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [sortModel, setSortModel] = useState([]);

  // Load pagination and sort settings from localStorage on mount
  useEffect(() => {
    const savedPagination = localStorage.getItem('pagination');
    if (savedPagination) {
      setPaginationModel(JSON.parse(savedPagination));
    }

    const savedSort = localStorage.getItem('sortModel');
    if (savedSort) {
      setSortModel(JSON.parse(savedSort));
    }
  }, []);

  const handlePaginationChange = (model) => {
    setPaginationModel(model);
    localStorage.setItem('pagination', JSON.stringify(model));
  };

  const handleSortModelChange = (model) => {
    setSortModel(model);
    localStorage.setItem('sortModel', JSON.stringify(model));
  };

  return (
    <DataGrid
      autoHeight
      rows={data}
      getRowHeight={() => 'auto'}
      getEstimatedRowHeight={() => 200}
      columns={filteredColumns}
      disableRowSelectionOnClick
      hideFooterSelectedRowCount={true}
      initialState={{
        pagination: { paginationModel: { page: 0, pageSize: 10 } },
      }}
      pageSizeOptions={[10, 25, 50, 100]}
      // paginationModel={paginationModel}
      // onPaginationModelChange={handlePaginationChange}
      // sortModel={sortModel}
      // onSortModelChange={handleSortModelChange}
      getRowClassName={(params) => params.indexRelativeToCurrentPage % 2 === 0 ? "even-row" : "odd-row"}
      slots={{ toolbar: () => ( <EditToolbar handleAddItem={handleAddItem} loading={loading} /> ) }}
      localeText={{ toolbarColumns: "คอลัมน์", toolbarFilters: "ตัวกรอง", toolbarDensity: "ระยะห่าง", toolbarExport: "ส่งออก" }}
      loading={loading}
      sx={{
        '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': { py: 1 },
        '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': { py: '15px' },
        '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': { py: '22px' },
        '& .MuiDataGrid-cell': { alignItems: 'flex-start' },
      }}
    />
  );
};

export default DataTable;
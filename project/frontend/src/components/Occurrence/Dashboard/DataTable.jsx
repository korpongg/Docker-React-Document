import React, { useState, useEffect } from "react";
import { Button, Box, Tooltip } from "@mui/material";
import { DataGrid, GridToolbarContainer, GridToolbar, GridToolbarQuickFilter, GridActionsCellItem } from "@mui/x-data-grid";
import { Add as AddIcon, DescriptionRounded as FileIcon, SwapHorizRounded as RotateIcon, Edit as EditIcon } from "@mui/icons-material";
import { formatDateTimeN7 } from "../../Function";
import requestStatusData from "../../label.json";

function EditToolbar({ handleAddItem, loading }) {
  return (
    <GridToolbarContainer style={{ justifyContent: "space-between", padding: "10px 10px 0" }}>
      <div>
        <Button variant="contained" onClick={handleAddItem} startIcon={<AddIcon />} disabled={loading} style={{ marginRight: 10 }}>บันทึกอุบัติการณ์</Button>
      </div>
      {/* <GridToolbar /> */}
      <GridToolbarQuickFilter />
    </GridToolbarContainer>
  );
}

const DataTable = ({ data, isAdmin, handleAddItem, handleViewClick, handleTranfClick, handleEditClick, loading }) => {
  // console.log(data);
  const statusMap = {};
  requestStatusData.requestStatus.forEach(status => {
    statusMap[status.id] = { text: status.statusText, color: status.statusColor };
  });

  const renderDeptrelateCell = (params) => {
    const deptAffInfo = Array.isArray(params.row.deptAffInfo) ? params.row.deptAffInfo : [];
    return <div className="MuiDataGrid-cellContent" title={deptAffInfo.map(dept => dept.DepName).join(", ")} role="presentation">{deptAffInfo.map(dept => dept.DepName).join(", ")}</div>;
  };

  const columns = [
    {
      field: "formstatus",
      headerName: "สถานะ",
      width: 155,
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
    { field: "reportid", headerName: "ReportId", width: 120, align: "center", headerAlign: "center", },
    { field: "hn", headerName: "HN", width: 180, align: "center", headerAlign: "center" },
    {
      field: "occurrencedate",
      headerName: "วันที่เกิดเหตุ",
      width: 140,
      align: "center",
      headerAlign: "center",
      valueGetter: (params) => params ? formatDateTimeN7(params.value, "dmy") : '',
    },
    {
      field: "deptAffInfo",
      headerName: "แผนก",
      width: 160,
      align: "center",
      headerAlign: "center",
      sortable: false,
      filterable: false,
      renderCell: renderDeptrelateCell,
    },
    { field: "reporttypename", headerName: "ประเภท", width: 140, align: "center", headerAlign: "center" },
    { field: "level", headerName: "ความรุนแรง", width: 115, align: "center", headerAlign: "center" },
    {
      field: "description",
      headerName: "รายละเอียดเหตุการณ์",
      width: 300,
      align: "center",
      headerAlign: "center",
      sortable: false,
      filterable: false,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "จัดการ",
      width: 140,
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

          {isAdmin && (
            <Tooltip title="Tranfer">
              <GridActionsCellItem
                icon={<RotateIcon className="rotate-icon" />}
                label="Tranfer"
                onClick={() => handleTranfClick(id, row)}
                color="success"
              />
            </Tooltip>
          )}

          <Tooltip title="แก้ไขข้อมูลอุบัติการณ์">
            <GridActionsCellItem
              icon={<EditIcon />}
              label="แก้ไขข้อมูลอุบัติการณ์"
              onClick={() => handleEditClick(id, row)}
              color="warning"
            />
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <DataGrid
      autoHeight
      rows={data}
      columns={columns}
      disableRowSelectionOnClick
      hideFooterSelectedRowCount={true}
      initialState={{
        pagination: { paginationModel: { page: 0, pageSize: 10 } },
      }}
      pageSizeOptions={[10, 25, 50, 100]}
      getRowClassName={(params) => params.indexRelativeToCurrentPage % 2 === 0 ? "even-row" : "odd-row"}
      slots={{
        toolbar: () => (
          <EditToolbar handleAddItem={handleAddItem} loading={loading} />
        ),
      }}
      localeText={{
        toolbarColumns: "คอลัมน์",
        toolbarFilters: "ตัวกรอง",
        toolbarDensity: "ระยะห่าง",
        toolbarExport: "ส่งออก",
      }}
      loading={loading}
    />
  );
};

export default DataTable;
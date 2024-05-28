import React, { useState, useEffect } from "react";
import { Button, Box, Tooltip } from "@mui/material";
import { DataGrid, GridToolbarContainer, GridToolbar, GridToolbarQuickFilter, GridActionsCellItem } from "@mui/x-data-grid";
import { Add as AddIcon, FindInPageRounded as FileIcon, RestartAltRounded as RepeatIcon, Edit as EditIcon } from "@mui/icons-material";
import { formatDateTimeN7 } from "../../Function";
import requestStatusData from "../../label.json";

function EditToolbar({ reportData, handleAddItem }) {
  return (
    <GridToolbarContainer style={{ justifyContent: "space-between", padding: "10px 10px 0" }}>
      {reportData && (
        <div>
          <Button variant="contained" onClick={handleAddItem} startIcon={<AddIcon />} style={{ marginRight: 10 }} disabled={reportData?.formstatus !== '1'}>ส่งทบทวน</Button>
        </div>
      )}
      {/* <GridToolbar /> */}
      {/* <GridToolbarQuickFilter /> */}
    </GridToolbarContainer>
  );
}

const isWithinLast3Days = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const diffTime = Math.abs(today - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 3;
};

// const isOlderThan3Days = (dateString) => {
//   const date = new Date(dateString);
//   const today = new Date();
//   const diffTime = today - date;
//   const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
//   console.log(diffDays)
//   return diffDays > 3;
// };

const isWithinLast7Days = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const diffTime = Math.abs(today - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 7;
};

// const isOlderThan7Days = (dateString) => {
//   const date = new Date(dateString);
//   const today = new Date();
//   const diffTime = today - date;
//   const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
//   return diffDays > 7;
// };

const ActionButtons = ({ id, row, isAdmin, handleViewEvent, handleRepeatEvent, handleEditEvent }) => {
  return (
    <>
      <Tooltip title="ดูรายงาน">
        <GridActionsCellItem
          icon={<FileIcon />}
          label="ดูรายงาน"
          onClick={() => handleViewEvent(id, row)}
          color="primary"
        />
      </Tooltip>

      {row.status === '1' && isWithinLast7Days(row.createAt) && (
        <Tooltip title="แก้ไขรายงาน">
          <GridActionsCellItem
            icon={<EditIcon />}
            label="แก้ไขรายงาน"
            onClick={() => handleEditEvent(id, row, isAdmin)}
            color="warning"
          />
        </Tooltip>
      )}

      {row.status === '3' && isWithinLast3Days(row.repeatAt) && (
        <Tooltip title="แก้ไขรายงาน">
          <GridActionsCellItem
            icon={<EditIcon />}
            label="แก้ไขรายงาน"
            onClick={() => handleEditEvent(id, row, isAdmin)}
            color="warning"
          />
        </Tooltip>
      )}

      {isAdmin && row.status === '2' && (
        <Tooltip title="ส่งทบทวนซ้ำ">
          <GridActionsCellItem
            icon={<RepeatIcon />}
            label="ส่งทบทวนซ้ำ"
            onClick={() => handleRepeatEvent(id, row)}
            color="error"
          />
        </Tooltip>
      )}
    </>
  );
};

const TranferTable = ({ reportData, eventData, isAdmin, handleAddItem, handleViewEvent, handleRepeatEvent, handleEditEvent, loading }) => {
  // console.log(reportData);
  const statusMap = {};
  requestStatusData.subStatus.forEach(status => {
    statusMap[status.id] = { text: status.statusText, color: status.statusColor };
  });

  const columns = [
    { field: "code", headerName: "ใบที่", minWidth: 115, flex: 1, align: "center", headerAlign: "center", },
    {
      field: "status",
      headerName: "สถานะ",
      minWidth: 95,
      flex: 1,
      align: "center",
      headerAlign: "center",
      // sortable: false,
      filterable: false,
      renderCell: (params) => {
        const statusId = params.row.status;
        const statusInfo = statusMap[statusId];
        return <div className={`post-status ${statusInfo.color}`}>{statusInfo.text}</div>;
      },
    },
    { field: "hn", headerName: "HN", minWidth: 135, flex: 1, align: "center", headerAlign: "center" },
    {
      field: "occurrencedate",
      headerName: "วันที่เกิดเหตุ",
      minWidth: 115,
      flex: 1,
      align: "center",
      headerAlign: "center",
      valueGetter: (params) => params ? formatDateTimeN7(params.value, "dmy") : '',
    },
    {
      field: "depname",
      headerName: "แผนก",
      minWidth: 160,
      flex: 1,
      align: "center",
      headerAlign: "center",
      sortable: false,
      filterable: false,
    },
    { field: "reporttypename", headerName: "ประเภท", minWidth: 110, flex: 1, align: "center", headerAlign: "center" },
    { field: "level", headerName: "ความรุนแรง", minWidth: 90, flex: 1, align: "center", headerAlign: "center" },
    {
      field: "summarydetail",
      headerName: "รายละเอียดเหตุการณ์",
      minWidth: 300,
      flex: 1,
      align: "center",
      headerAlign: "center",
      sortable: false,
      filterable: false,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "จัดการ",
      minWidth: 140,
      cellClassName: "actions",
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <ActionButtons
          id={params.id}
          row={params.row}
          isAdmin={isAdmin}
          handleViewEvent={handleViewEvent}
          handleRepeatEvent={handleRepeatEvent}
          handleEditEvent={handleEditEvent}
        />
      ),
    },
  ];

  const getRowClassName = (params) => {
    const { status, createAt, repeatAt } = params.row;
    if (status === '1' && !isWithinLast7Days(createAt) || status === '3' && !isWithinLast3Days(repeatAt)) {
      return 'alert-row';
    }
    return params.indexRelativeToCurrentPage % 2 === 0 ? 'even-row' : 'odd-row';
  };

  return (
    <DataGrid
      autoHeight
      rows={eventData}
      columns={columns}
      disableRowSelectionOnClick
      hideFooterSelectedRowCount={true}
      initialState={{
        pagination: { paginationModel: { page: 0, pageSize: 10 } },
      }}
      pageSizeOptions={[10, 25, 50, 100]}
      getRowClassName={getRowClassName}
      slots={{
        toolbar: () => (
          <EditToolbar reportData={reportData} handleAddItem={handleAddItem} />
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

export default TranferTable;
import React, { useState, useEffect } from "react";
import { Button, Box, Tooltip } from "@mui/material";
import { DataGrid, GridToolbarContainer, GridToolbar, GridToolbarQuickFilter, GridActionsCellItem } from "@mui/x-data-grid";
import { Add as AddIcon, FindInPageRounded as FileIcon, RestartAltRounded as RepeatIcon, Edit as EditIcon } from "@mui/icons-material";
import { formatDateTimeN7 } from "../../Function";
import requestStatusData from "../../label.json";
import EventDialog from "../Event/EventDialog";

const EditToolbar = ({ reportData, handleAddEvent }) => (
  <GridToolbarContainer style={{ justifyContent: "space-between", padding: "10px 10px 0" }}>
    {reportData && (
      <Button
        variant="contained"
        onClick={handleAddEvent}
        startIcon={<AddIcon />}
        style={{ marginRight: 10 }}
        disabled={reportData?.formstatus !== '1'}
      >
        ส่งทบทวน
      </Button>
    )}
    {/* <GridToolbar /> */}
    {/* <GridToolbarQuickFilter /> */}
  </GridToolbarContainer>
);

const isWithinDays = (dateString, days) => {
  const date = new Date(dateString);
  const today = new Date();
  const diffTime = Math.abs(today - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= days;
};

const ActionButtons = ({ id, row, isAdmin, handleViewEvent, handleRepeatEvent, handleEditEvent }) => (
  <>
    <Tooltip title="ดูรายงาน">
      <GridActionsCellItem
        icon={<FileIcon />}
        label="ดูรายงาน"
        onClick={() => handleViewEvent(id, row)}
        color="primary"
      />
    </Tooltip>
    {row.status === '1' && isWithinDays(row.createAt, 7) && (
      <Tooltip title="แก้ไขรายงาน">
        <GridActionsCellItem
          icon={<EditIcon />}
          label="แก้ไขรายงาน"
          onClick={() => handleEditEvent(id, row, isAdmin)}
          color="warning"
        />
      </Tooltip>
    )}
    {row.status === '3' && isWithinDays(row.repeatAt, 3) && (
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

const TranferTable = ({ reportData, dataEvent, isAdmin, userData, config, handleViewEvent, handleRepeatEvent, loading, setLoading }) => {
  const [mode, setMode] = useState(null);
  const [isHA, setIsHA] = useState(false);
  const [eventData, setEventData] = useState([]);
  const [isDialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const filteredData = isAdmin ? dataEvent : dataEvent.filter(item => item.depname === userData.dep);
    setEventData(filteredData);
    setLoading(false);
  }, [dataEvent]);

  const statusMap = requestStatusData.subStatus.reduce((map, status) => {
    map[status.id] = { text: status.statusText, color: status.statusColor };
    return map;
  }, {});

  const columns = [
    { field: "code", headerName: "ใบที่", minWidth: 115, flex: 1, align: "center", headerAlign: "center" },
    {
      field: "status",
      headerName: "สถานะ",
      minWidth: 95, flex: 1, align: "center", headerAlign: "center",
      renderCell: (params) => {
        const statusInfo = statusMap[params.row.status];
        return <div className={`post-status ${statusInfo.color}`}>{statusInfo.text}</div>;
      },
    },
    // { field: "hn", headerName: "HN", minWidth: 135, flex: 1, align: "center", headerAlign: "center" },
    {
      field: "occurrencedate", headerName: "วันที่เกิดเหตุ", minWidth: 115, flex: 1, align: "center", headerAlign: "center",
      valueGetter: (params) => params.value ? formatDateTimeN7(params.value, "dmy") : ''
    },
    { field: "depname", headerName: "แผนก", minWidth: 160, flex: 1, align: "center", headerAlign: "center", sortable: false, filterable: false },
    { field: "reporttypename", headerName: "ประเภท", minWidth: 110, flex: 1, align: "center", headerAlign: "center" },
    { field: "level", headerName: "ความรุนแรง", minWidth: 90, flex: 1, align: "center", headerAlign: "center" },
    { field: "summarydetail", headerName: "รายละเอียดเหตุการณ์", minWidth: 300, flex: 1, align: "center", headerAlign: "center", sortable: false, filterable: false },
    {
      field: "actions", type: "actions", headerName: "จัดการ", minWidth: 140, cellClassName: "actions", align: "center", headerAlign: "center",
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
    if ((status === '1' && !isWithinDays(createAt, 7)) || (status === '3' && !isWithinDays(repeatAt, 3))) {
      return 'alert-row';
    }
    return params.indexRelativeToCurrentPage % 2 === 0 ? 'even-row' : 'odd-row';
  };

  const handleAddEvent = () => {
    setMode('Add');
    setIsHA(isAdmin);
    setDialogOpen(true);
  };

  const handleEditEvent = (id, data, role) => {
    setMode('Edit');
    setIsHA(role);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setMode(null);
    setIsHA(false);
    setDialogOpen(false);
  };

  return (
    <>
      <DataGrid
        autoHeight
        rows={eventData}
        columns={columns}
        disableRowSelectionOnClick
        hideFooterSelectedRowCount
        initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
        pageSizeOptions={[10, 25, 50, 100]}
        getRowClassName={getRowClassName}
        slots={{ toolbar: () => <EditToolbar reportData={reportData} handleAddEvent={handleAddEvent} /> }}
        localeText={{ toolbarColumns: "คอลัมน์", toolbarFilters: "ตัวกรอง", toolbarDensity: "ระยะห่าง", toolbarExport: "ส่งออก" }}
        loading={loading}
      />

      <EventDialog
        mode={mode}
        isHA={isHA}
        userData={userData}
        config={config}
        isDialogOpen={isDialogOpen}
        handleCloseDialog={handleCloseDialog}
        reportData={reportData}
      />
    </>
  );
};

export default TranferTable;
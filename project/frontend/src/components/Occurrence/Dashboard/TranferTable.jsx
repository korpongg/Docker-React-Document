import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Link, Tooltip } from "@mui/material";
import { DataGrid, GridToolbarContainer, GridToolbar, GridToolbarQuickFilter, GridActionsCellItem } from "@mui/x-data-grid";
import { Add as AddIcon, FindInPageRounded as FileIcon, RestartAltRounded as RepeatIcon, Edit as EditIcon, CheckCircleRounded as AcceptIcon } from "@mui/icons-material";
import Swal from 'sweetalert2';
import { formatDateTimeN7 } from "../../Function";
import requestStatusData from "../../label.json";
import EventDialog from "../Event/EventDialog";

const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

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

function ExpandableCell({ value }) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div>
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

const isWithinDays = (dateString, days) => {
  const date = new Date(dateString);
  const today = new Date();
  const diffTime = Math.abs(today - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= days;
};

const ActionButtons = ({ id, row, isAdmin, userData, handleViewEvent, handleRepeatEvent, handleEditEvent, handleAcceptEvent }) => (
  <>
    <Tooltip title="ดูรายงาน">
      <GridActionsCellItem
        icon={<FileIcon />}
        label="ดูรายงาน"
        onClick={() => handleViewEvent(id, row)}
        color="primary"
      />
    </Tooltip>

    {row.formstatus === '1' && (
      <>
        {row.status === '1' && isWithinDays(row.createAt, 7) && (
          <>
            {isAdmin && (
              <Tooltip title="แก้ไขรายงาน">
                <GridActionsCellItem
                  icon={<EditIcon />}
                  label="แก้ไขรายงาน"
                  onClick={() => handleEditEvent(id, row, isAdmin)}
                  color="warning"
                />
              </Tooltip>
            )}

            {row?.depname === userData?.dep && (
              <Tooltip title="ตอบกลับรายงาน">
                <GridActionsCellItem
                  icon={<AcceptIcon />}
                  label="ตอบกลับรายงาน"
                  onClick={() => handleAcceptEvent(id, row, isAdmin)}
                  color="success"
                />
              </Tooltip>
            )}
          </>
        )}

        {row.status === '3' && isWithinDays(row.repeatAt, 3) && (
          <>
            {isAdmin && (
              <Tooltip title="แก้ไขรายงาน">
                <GridActionsCellItem
                  icon={<EditIcon />}
                  label="แก้ไขรายงาน"
                  onClick={() => handleEditEvent(id, row, isAdmin)}
                  color="warning"
                />
              </Tooltip>
            )}

            {row?.depname === userData?.dep && (
              <Tooltip title="ตอบกลับรายงาน">
                <GridActionsCellItem
                  icon={<AcceptIcon />}
                  label="ตอบกลับรายงาน"
                  onClick={() => handleAcceptEvent(id, row, isAdmin)}
                  color="success"
                />
              </Tooltip>
            )}
          </>
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
    )}
  </>
);

const TranferTable = ({ reportData, dataEvent, isAdmin, userData, config, loading, setLoading }) => {
  const [mode, setMode] = useState(null);
  const [isHA, setIsHA] = useState(false);
  const [eventData, setEventData] = useState([]);
  const [rowData, setRowData] = useState(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    deptrelate: 0,
    urgenttype: "0",
    isnew: "0",
    summarydetail: ""
  });

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
      minWidth: 115, flex: 1, align: "center", headerAlign: "center",
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
    {
      field: "summarydetail", headerName: "รายละเอียดเหตุการณ์", minWidth: 300, flex: 1, align: "center", headerAlign: "center", sortable: false, filterable: false,
      renderCell: (params) => <ExpandableCell {...params} />,
    },
    {
      field: "actions", type: "actions", headerName: "จัดการ", minWidth: 140, cellClassName: "actions", align: "center", headerAlign: "center",
      renderCell: (params) => (
        <ActionButtons
          id={params.id}
          row={params.row}
          isAdmin={isAdmin}
          userData={userData}
          handleViewEvent={handleViewEvent}
          handleRepeatEvent={handleRepeatEvent}
          handleEditEvent={handleEditEvent}
          handleAcceptEvent={handleAcceptEvent}
        />
      ),
    },
  ];

  console.log(eventData)

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
    setRowData(data);
    setMode('Edit');
    setIsHA(role);
    setDialogOpen(true);
  };

  const handleAcceptEvent = (id, data, role) => {
    setRowData(data);
    setMode('Accept');
    setIsHA(role);
    setDialogOpen(true);
  };

  const handleViewEvent = (id, data, role) => {
    setRowData(data);
    setMode('View');
    setIsHA(isAdmin);
    setDialogOpen(true);
  };

  const handleRepeatEvent = async (id, data) => {
    const confirmed = await Swal.fire({
      title: 'ยืนยันการส่งทบทวนซ้ำ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก',
    });
    if (confirmed.isConfirmed) {
      try {
        const response = await axios.put(`${apiUrl}/events/${id}`, { status: '3' }, { ...config });
        console.log(response.data);
        Swal.fire('สำเร็จ', 'รายงานถูกส่งทบทวนซ้ำเรียบร้อยแล้ว', 'success');
      } catch (error) {
        console.error(error);
        Swal.fire('ผิดพลาด', 'เกิดข้อผิดพลาดในการส่งทบทวนซ้ำ', 'error');
      }
    }
  };

  const handleCloseDialog = () => {
    setRowData(null);
    setFormData({
      deptrelate: 0,
      urgenttype: "0",
      isnew: "0",
      summarydetail: ""
    })
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
        getRowHeight={() => 'auto'}
        getEstimatedRowHeight={() => 200}
        disableRowSelectionOnClick
        hideFooterSelectedRowCount
        initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
        pageSizeOptions={[10, 25, 50, 100]}
        getRowClassName={getRowClassName}
        slots={{ toolbar: () => <EditToolbar reportData={reportData} handleAddEvent={handleAddEvent} /> }}
        localeText={{ toolbarColumns: "คอลัมน์", toolbarFilters: "ตัวกรอง", toolbarDensity: "ระยะห่าง", toolbarExport: "ส่งออก" }}
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

      <EventDialog
        mode={mode}
        isHA={isHA}
        userData={userData}
        config={config}
        isDialogOpen={isDialogOpen}
        handleCloseDialog={handleCloseDialog}
        reportData={reportData}
        eventData={rowData}
        formData={formData}
        setFormData={setFormData}
      />
    </>
  );
};

export default TranferTable;
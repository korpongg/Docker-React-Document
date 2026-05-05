import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Button, Box, Tooltip, Link } from "@mui/material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbar,
  GridToolbarQuickFilter,
  GridActionsCellItem,
} from "@mui/x-data-grid";
import {
  TextField,
  InputAdornment,
} from "@mui/material";
import { GridToolbarExport } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import { Chip, Stack,Paper } from '@mui/material';
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import IconButton from "@mui/material/IconButton";
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';

import {
  Add as AddIcon,
  DescriptionRounded as FileIcon,
  SwapHorizRounded as RotateIcon,
  SendRounded as SendIcon,
  FindInPageRounded as ViewIcon,
  RefreshRounded as CloseIcon,
} from "@mui/icons-material";
import { formatDateTimeN7 } from "../../Function";
import requestStatusData from "../../label.json";
import DescriptionIcon from "@mui/icons-material/Description"; // บันทึก
import ReplyIcon from "@mui/icons-material/Reply"; // ตอบกลับ
import AssessmentIcon from "@mui/icons-material/Assessment";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
const ExpandableCell = React.memo(({ value }) => {
  const [expanded, setExpanded] = useState(false);
  if (!value) return null;

  return (
    <div style={{ wordBreak: "break-all" }}>
      {expanded ? value : value.slice(0, 200)}&nbsp;
      {value.length > 200 && (
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
});
const ActionMenu = ({ row, userData, isAdmin, onEdit, onDelete, onProcess }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
  <IconButton
  size="small"
  onClick={handleOpen}
  sx={{
    "&:hover": {
      bgcolor: "#eef2ff",
    },
  }}
>
  <MoreVertIcon />
</IconButton>

    <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
  
  {/* แก้ไข */}
  {row.createby === userData.userid && (
    <MenuItem
      onClick={() => {
        onEdit(row);
        handleClose();
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <EditIcon fontSize="small" color="warning" />
        <span>แก้ไข</span>
      </Stack>
    </MenuItem>
  )}

  {/* ดำเนินการ */}
  {/*isAdmin && (
    <MenuItem
      onClick={() => {
        onProcess(row);
        handleClose();
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <PublishedWithChangesIcon fontSize="small" color="success" />
        <span>
          {row.reply === "1" ? "แก้ไขเพิ่มเติม" : "ดำเนินการ"}
        </span>
      </Stack>
    </MenuItem>
  )*/}

  {/* ลบ */}
  {row.createby === userData.userid && (
    <MenuItem
      onClick={() => {
        onDelete(row);
        handleClose();
      }}
      sx={{ color: "error.main" }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <DeleteForeverIcon fontSize="small" />
        <span>ลบ</span>
      </Stack>
    </MenuItem>
  )}

</Menu>
    </>
  );
};
const DataTable = ({
  data,
  isAdmin,
  isEXEC,
  level,
  userData,
  handleAddItem,
  handleViewClick2,
  handleViewClick3,
  handleViewClick,
  handleTranfClick,
  handleCloseClick,
  handleEditClick,
  handleEditClick2,
  handleEditClick3,
  handleEditClick4,
  handleDeleteClick,
  loading,
}) => {

  const [searchText, setSearchText] = useState("");
const [startDate, setStartDate] = useState("");
const [endDate, setEndDate] = useState("");
const [statusFilter, setStatusFilter] = useState("");

const filteredRows = useMemo(() => {
  return data.filter((row) => {
    const search =
      !searchText ||
      row.id_document?.toLowerCase().includes(searchText.toLowerCase()) ||
       row.ordinal_number?.toLowerCase().includes(searchText.toLowerCase()) ||
      row.program_document?.toLowerCase().includes(searchText.toLowerCase());

    const start =
      !startDate ||
      new Date(row.date_document) >= new Date(startDate);

    const end =
      !endDate ||
      new Date(row.date_document) <= new Date(endDate);

    const status =
      !statusFilter ||
      String(row.reply) === statusFilter;

    return search && start && end && status;
  });
}, [data, searchText, startDate, endDate, statusFilter]);
const EditToolbar = React.memo(({ handleAddItem }) => (
  <GridToolbarContainer
    sx={{
      justifyContent: "space-between",
      p: 2,
      borderBottom: "1px solid #eee",
    }}
  >
    <Button
      variant="contained"
      size="large"
      startIcon={<AddIcon />}
      onClick={handleAddItem}
    >
      เพิ่มเอกสาร
    </Button>

    {/* 👉 export อย่างเดียว */}
   <GridToolbarExport
  csvOptions={{
    fileName: "document_export",
    utf8WithBom: true,
  }}

/>
  </GridToolbarContainer>
));

const DocumentChip = ({ value }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <Tooltip title={copied ? "คัดลอกแล้ว!" : "กดเพื่อคัดลอก"} arrow>
      <Chip
        onClick={handleCopy}
     
        label={value || "-"}
        size="small"
        clickable
        sx={{
          fontWeight: 700,
          borderRadius: "10px",
          px: 1,

          // 🔥 สไตล์เหมือน status
          bgcolor: copied ? "#dcfce7" : "#eef2ff",
          color: copied ? "#166534" : "#1e3a8a",
          border: copied
            ? "1px solid #22c55e"
            : "1px solid #c7d2fe",

          transition: "all 0.2s ease",

          "&:hover": {
            transform: "scale(1.05)",
            bgcolor: copied ? "#bbf7d0" : "#e0e7ff",
          },

          "& .MuiChip-label": {
            maxWidth: 120,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          },
        }}
      />
    </Tooltip>
  );
};

const severityLevels  = [
  { label: "อันตรายมาก", color: "#b91c1c", bg: "#fee2e2" }, // A
  { label: "สูงมาก", color: "#dc2626", bg: "#fee2e2" },      // B
  { label: "สูง", color: "#ea580c", bg: "#ffedd5" },         // C
  { label: "ค่อนข้างสูง", color: "#f97316", bg: "#ffedd5" },// D
  { label: "ปานกลาง", color: "#ca8a04", bg: "#fef9c3" },     // E
  { label: "ค่อนข้างต่ำ", color: "#65a30d", bg: "#ecfccb" }, // F
  { label: "ต่ำ", color: "#16a34a", bg: "#dcfce7" },          // G
  { label: "ต่ำมาก", color: "#0284c7", bg: "#e0f2fe" },      // H
  { label: "เล็กน้อย", color: "#6b7280", bg: "#f3f4f6" },    // I
];

  const renderDeptrelateCell = useCallback((params) => {
    const deptNames = (params.row.deptAffInfo || [])
      .map((dept) => dept.DepName)
      .join(", ");
    return (
      <Tooltip title={deptNames}>
        <div className="MuiDataGrid-cellContent" role="presentation">
          {deptNames}
        </div>
      </Tooltip>
    );
  }, []);

  const renderViolence =
    (() => {
      return "sdsd";
    },
    []);

  const shouldShowButton = useCallback(
    (row, isLowLevel = false) => {
      const isGeneralRisk = row.reporttypename === "General Risk";
      const levelCheck = isGeneralRisk
        ? parseInt(row.level, 10) > 2
        : ["D", "E", "F", "G", "H", "I"].includes(row.level);
      const formStatusCheck = ["1", "2", "4"].includes(row.formstatus);

      return (
        isAdmin &&
        row.renew &&
        (isLowLevel ? !levelCheck : levelCheck) &&
        formStatusCheck
      );
    },
    [isAdmin],
  );

   const columns = useMemo(() => [

{
  field: "ordinal_number",
  headerName: "#",
  minWidth: 70,
  flex: 1,
  align: "center",
  headerAlign: "center",
  renderCell: (params) => {
    const isUrgent = params.row.urgent == 0;

    return (
      <Stack alignItems="center" spacing={0.5}>
        <span>
          {params.row.ordinal_number}
          {isUrgent && (
            <Chip
              label="!"
              size="small"
              sx={{
                bgcolor: "#dc2626",
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.65rem",
                height: 20,
                animation: "pulseUrgent 1s infinite",
              }}
            />
          )}
        </span>
      </Stack>
    );
  },
},
     {
  field: "id_document",
  headerName: "เลขที่เอกสาร",
  minWidth: 150,
  flex: 1,
  align: "center",
  headerAlign: "center",
  renderCell: (params) => (
    <DocumentChip value={params.value} />
  ),
},
    {
      field: "date_document",
      headerName: "วันที่ส่งเอกสาร",
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
      valueGetter: (params) =>
        params ? formatDateTimeN7(params.value, "dmy") : "",
    },
    {
      field: "program_document",
      headerName: "รายการ(ชื่อเอกสาร)",
      minWidth: 150,
      flex: 1,
      align: "center",
      headerAlign: "center",
    
    },
    {
      field: "dep_name_send",
      headerName: "ผู้ส่งเอกสาร(แผนก)",
      minWidth: 150,
      flex: 1,
      align: "center",
      headerAlign: "center",
   renderCell: (params) => {
  if (!params.value) return null;

  return (
    <Box sx={{ width: "100%", overflow: "hidden" }}>
      <Stack
        direction="row"
        spacing={0.5}
        flexWrap="wrap"
        sx={{
          width: "100%",
          overflow: "hidden",
        }}
      >
        {params.value.split(",").map((item, index) => (
          <Tooltip key={index} title={item.trim()} arrow>
            <Chip
              label={item.trim()}
              size="small"
              variant="outlined"
              sx={{
                maxWidth: "100%",          // 🔥 ห้ามเกิน cell
                overflow: "hidden",

                "& .MuiChip-label": {
                  display: "block",
                  whiteSpace: "nowrap",    // 🔥 ไม่ให้ 2 บรรทัดแล้วล้น
                  overflow: "hidden",
                  textOverflow: "ellipsis", // 🔥 ตัด ... แทน
                },
              }}
            />
          </Tooltip>
        ))}
      </Stack>
    </Box>
  );
}
    },
     {
      field: "faction",
      headerName: "ผู้ที่ต้องรับเอกสาร",
      minWidth: 120,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
/* =========================
   ผู้รับเอกสาร (เวอร์ชันดูพรีเมียมกว่า)
========================= */
{
  field: "dep_name_received",
  headerName: "ผู้รับเอกสาร",
  minWidth: 170,
  flex: 1,
  align: "center",
  headerAlign: "center",
  cellClassName: (params) =>
    params.row.reply == 1 ? "ready-cell" : "locked-cell",
  renderCell: (params) => {
    const ready = params.row.reply == 1;

    if (ready) {
      return (
        <Tooltip title="ผู้รับเอกสาร" arrow>
          <Chip
            icon={<CheckCircleIcon sx={{ fontSize: 18 }} />}
            label={params.value || "-"}
            size="small"
            sx={{
              maxWidth: 150,
              fontWeight: 700,
              color: "#061e5fff",
              bgcolor: "#ecfdf5",
              border: "1px solid #102fb9ff",
              borderRadius: "10px",
              "& .MuiChip-icon": {
                color: "#102fb9ff",
              },
            }}
          />
        </Tooltip>
      );
    }

    return (
      <Tooltip title="ข้อมูลจะปรากฏหลังส่งเอกสารสำเร็จ" arrow>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 1.5,
            py: 0.8,
            borderRadius: "12px",
            bgcolor: "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)",
            border: "1px dashed #d1d5db",
            color: "#9ca3af",
            fontWeight: 600,
            fontSize: "0.75rem",
            whiteSpace: "nowrap",
          }}
        >
          <ErrorOutlineIcon sx={{ fontSize: 16, color: "#f59e0b" }} />
          รอดำเนินการ
        </Box>
      </Tooltip>
    );
  },
},

/* =========================
   วันที่รับเอกสาร (เวอร์ชันดูชัดกว่า)
========================= */
{
  field: "date_received",
  headerName: "วันที่รับเอกสาร",
  minWidth: 170,
  flex: 1,
  align: "center",
  headerAlign: "center",
  cellClassName: (params) =>
    params.row.reply == 1 ? "ready-cell" : "locked-cell",
  renderCell: (params) => {
    const ready = params.row.reply == 1;

    if (ready) {
      return (
        <Tooltip title="วันที่รับเอกสาร" arrow>
          <Chip
            label={formatDateTimeN7(params.value, "dmy")}
            size="small"
            variant="filled"
            sx={{
              fontWeight: 700,
              color: "#0f766e",
              bgcolor: "#eff6ff",
              border: "1px solid #93c5fd",
              borderRadius: "10px",
            }}
          />
        </Tooltip>
      );
    }

    return (
      <Tooltip title="รอผู้รับดำเนินการ" arrow >
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.8,
            px: 1.5,
            py: 0.8,
            borderRadius: "12px",
            background:
              "repeating-linear-gradient(45deg, #f9fafb, #f9fafb 6px, #f3f4f6 6px, #f3f4f6 12px)",
            border: "1px dashed #d1d5db",
            color: "#9ca3af",
            fontWeight: 600,
            fontSize: "0.75rem",
          }}
        >
          <ErrorOutlineIcon sx={{ fontSize: 15, color: "#f59e0b" }} />
          รอดำเนินการ
        </Box>
      </Tooltip>
    );
  },
},

/* =========================
   สถานะการส่งเอกสาร
========================= */
{
  field: "reply",
  headerName: "สถานะการส่งเอกสาร",
  minWidth: 160,
  flex: 1,
  align: "center",
  headerAlign: "center",

  // 👇 เพิ่มตรงนี้ (สำคัญมาก)
  valueFormatter: (params) => {
    return params.value == 1 ? "ส่งเอกสารแล้ว" : "รอดำเนินการ";
  },

  renderCell: (params) => {
    const done = params.value == 1;

    return (
      <Tooltip
        title={
          done
            ? "ส่งเอกสารแล้ว / ขั้นตอนถัดไปพร้อมใช้งาน"
            : "ยังไม่ส่งเอกสาร / ข้อมูลส่วนถัดไปยังไม่แสดง"
        }
        arrow
      >
        <Chip
          icon={
            done ? (
              <CheckCircleIcon sx={{ fontSize: 18 }} />
            ) : (
              <ErrorOutlineIcon sx={{ fontSize: 18 }} />
            )
          }
          label={done ? "ส่งเอกสารแล้ว" : "รอดำเนินการ"}
          size="small"
          variant={done ? "filled" : "outlined"}
          sx={{
            minWidth: 130,
            fontWeight: 700,
            color: done ? "#ffffff" : "#b45309",
            borderColor: done ? "#0f766e" : "#f59e0b",
            bgcolor: done ? "#0f766e" : "#fffbeb",
            boxShadow: done
              ? "0 4px 10px rgba(15,118,110,0.25)"
              : "none",
            animation: done ? "none" : "pulseWarning 1.8s infinite",
            "& .MuiChip-icon": {
              color: done ? "#ffffff" : "#f59e0b",
            },
          }}
        />
      </Tooltip>
    );
  },
},
{
  field: "urgent",
  headerName: "ระดับความด่วน",
  minWidth: 140,
  flex: 1,
  align: "center",
  headerAlign: "center",

  // 👇 ใช้อันนี้สำหรับ export + display text
  valueFormatter: (params) => {
    return params.value == 0 ? "ด่วน" : "ไม่ด่วน";
  },

  renderCell: (params) => {
    const isUrgent = params.value == 0;

    return (
      <Tooltip title={isUrgent ? "ผู้ส่งต้องการด่วน" : "ผู้ส่งต้องการไม่ด่วน"} arrow>
        <Chip
          label={isUrgent ? "ด่วน" : "ไม่ด่วน"}
          color={isUrgent ? "error" : "default"}
          size="small"
        />
      </Tooltip>
    );
  },
},
    {
      field: "actions",
      type: "actions",
      headerName: "จัดการ",
      minWidth: 100,
      flex: 1,
      cellClassName: "actions",
      align: "center",
      headerAlign: "center",
     renderCell: ({ id, row }) => {
  return (
    <Stack direction="row" spacing={1}>
      
     {row.createby === userData.userid && (
 <Tooltip title="แก้ไข">
        <GridActionsCellItem
          icon={<EditIcon />}
          onClick={() => handleEditClick2(row.id, row)}
          color="warning"
          label="แก้ไข"
        />
      </Tooltip>
    ) }
     

      {/* ดำเนินการ */}

      {/* isAdmin && <>
        {row.reply === '1' ? (
        <Tooltip title="แก้ไขเพิ่มเติม">
          <GridActionsCellItem
            icon={<PublishedWithChangesIcon />}
            label="แก้ไข"
            onClick={() => handleEditClick(id, row)}
            color="success"
          />
        </Tooltip>
      ) : (
         <Tooltip title="ดำเนินการ">
        <GridActionsCellItem
          icon={<PublishedWithChangesIcon />}
          label="ดำเนินการ"
          onClick={() => handleViewClick(id, row)}
          color="success"
        />
      </Tooltip>
      )}
      </>*/}

      
    
  {row.createby === userData.userid && (
  <Tooltip title="ลบ">
        
        <GridActionsCellItem
          icon={<DeleteForeverIcon />}
          onClick={() => handleDeleteClick(row.id, row)}
          color="error"
          label="ลบ"
        />
      </Tooltip>
    ) }
     
      {/* ลบ */}
    

    </Stack>
  );
},
    },
  // ... คอลัมน์อื่น ๆ
], [
  isAdmin,
  userData,
  handleViewClick,
  handleViewClick2,
  handleViewClick3,
  handleEditClick,
  handleDeleteClick,
]);
const hiddenByRole = {
  ADMIN: [],
  //EXEC: ["requestby"],
//  USER: ["requestby", "reply", "risk"],
EXEC: [],
  USER: [],
};
const role = isAdmin ? "ADMIN" : isEXEC ? "EXEC" : "USER";

const filteredColumns = useMemo(() => {
  const hiddenFields = hiddenByRole[role];
  return columns.filter(col => !hiddenFields.includes(col.field));
}, [role, columns]);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [sortModel, setSortModel] = useState([]);

  // Load pagination and sort settings from localStorage on mount
  useEffect(() => {
    const savedPagination = localStorage.getItem("pagination");
    if (savedPagination) {
      setPaginationModel(JSON.parse(savedPagination));
    }

    const savedSort = localStorage.getItem("sortModel");
    if (savedSort) {
      setSortModel(JSON.parse(savedSort));
    }
  }, []);

  const handlePaginationChange = (model) => {
    setPaginationModel(model);
    localStorage.setItem("pagination", JSON.stringify(model));
  };

  const handleSortModelChange = (model) => {
    setSortModel(model);
    localStorage.setItem("sortModel", JSON.stringify(model));
  };


  return (

    <> 
    <Box sx={{ width: "100%" }}>
      {/* =====================================================
          TOP SEARCH BAR
      ===================================================== */}
      <Box
        sx={{
          display: "grid",
          
          gridTemplateColumns: {
            xs: "1fr",
            md: "2fr 1fr 1fr 1fr auto",
          },
          gap: 2,
          mb: 3,
          p: 2,
          borderRadius: "16px",
          bgcolor: "#f8fafc",
          border: "1px solid #e5e7eb",
        }}
      >
        {/* Search */}
        {/* Search */}
<TextField
  fullWidth
  label="เลขที่เอกสาร / รายการ"
  variant="standard"
  value={searchText}
  onChange={(e) => setSearchText(e.target.value)}
  InputLabelProps={{
    shrink: true,
  }}
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <SearchIcon
          sx={{
            color: "#3b82f6",
            fontSize: 22,
            mr: 0.5,
            mb:3,
          }}
        />
      </InputAdornment>
    ),
  }}
  sx={{
    minWidth: 0,

    "& .MuiInputBase-root": {
      height: "32px",
      display: "flex",
      alignItems: "flex-end",
    },

    "& .MuiInputBase-input": {
      paddingBottom: "0px",
      fontSize: "0.95rem",
    },

    "& .MuiInputLabel-root": {
      fontSize: "0.95rem",
    },

    "& .MuiInputLabel-shrink": {
      transform: "translate(0, -1.5px) scale(0.75)",
    },
  }}
/>

        {/* Start Date */}
        <TextField
          type="date"
          label="วันที่เริ่มต้น"
          variant="standard"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />

        {/* End Date */}
        <TextField
          type="date"
          label="วันที่สิ้นสุด"
          variant="standard"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />

        {/* Status */}
        <TextField
          select
          label="สถานะการส่งเอกสาร"
          variant="standard"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <MenuItem value="">ทั้งหมด</MenuItem>
          <MenuItem value="1">ส่งเอกสารแล้ว</MenuItem>
          <MenuItem value="0">รอดำเนินการ</MenuItem>
        </TextField>

        {/* Search Button */}
        <Button
        hidden={true}
          variant="contained"
          startIcon={<SearchIcon />}
          sx={{
            bgcolor: "#2563eb",
            borderRadius: "12px",
            px: 3,
            "&:hover": {
              bgcolor: "#1d4ed8",
            },
          }}
        >
          ค้นหา
        </Button>
      </Box>

      {/* =====================================================
          ADD BUTTON
      ===================================================== */}

    
     <DataGrid
      autoHeight
      rows={filteredRows}
      getRowId={(row) => row.reportid}

      
      getRowHeight={() => "auto"}
      getEstimatedRowHeight={() => 200}
      columns={filteredColumns}
      disableRowSelectionOnClick
      hideFooterSelectedRowCount={true}
      // initialState={{
      //   pagination: { paginationModel: { page: 0, pageSize: 10 } },
      // }}
      pageSizeOptions={[10, 25, 50, 100]}
      paginationModel={paginationModel}
      onPaginationModelChange={handlePaginationChange}
      sortModel={sortModel}
      onSortModelChange={handleSortModelChange}
      getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? "even-row" : "odd-row"
      }
      slots={{
        toolbar: () => (
       <EditToolbar handleAddItem={handleAddItem} loading={loading} />
         
        ),
      }}
      slotProps={{
    toolbar: {
      csvOptions: {
        fileName: "document_export",
        utf8WithBom: true, // 🔥 กันภาษาไทยพัง
        
      },
    },
  }}

                
      localeText={{
        toolbarColumns: "คอลัมน์",
        toolbarFilters: "ตัวกรอง",
        toolbarDensity: "ระยะห่าง",
        toolbarExport: "ส่งออก",
         noRowsLabel: "ไม่พบข้อมูล",
         olbarExport: "Export Excel",
         MuiTablePagination: {
      labelRowsPerPage: "จำนวนแถวต่อหน้า",
      labelDisplayedRows: ({ from, to, count }) =>
        `${from}–${to} จาก ${count !== -1 ? count : `มากกว่า ${to}`}`,

    },
    toolbarQuickFilterPlaceholder: "ค้นหา..."
      }}
      loading={loading}
      sx={{
        "&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell": { py: 1 },
        "&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell": { py: "15px" },
        "&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell": {
          py: "22px",
        },
        "& .MuiDataGrid-cell": { alignItems: "flex-start" },
         border: "none",
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: "#FAFAFA",
    fontWeight: 600,
  },
  "& .MuiDataGrid-row:hover": {
    backgroundColor: "#F5F7FA",
  },
  "& .MuiDataGrid-cell": {
    alignItems: "flex-start",
    py: 1.5,
    minWidth: 0,   
  },
      "& .MuiTablePagination-root": {
      display: "flex",
      alignItems: "center",
    },
    "& .MuiTablePagination-toolbar": {
      alignItems: "center",
    },
    "& .MuiTablePagination-selectLabel": {
      marginBottom: 0,
    },
    "& .MuiTablePagination-displayedRows": {
      marginBottom: 0,
    },
 "& .MuiInput-underline:after": {
      borderBottomColor: "#162f65ff", // ตอน focus
    },
    "& .MuiInput-underline:before": {
      borderBottomColor: "#d1d5db", // ตอนปกติ
    },
    "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
      borderBottomColor: "#162f65ff", // ตอน hover
    },
    "& .locked-cell": {
  backgroundColor: "#fcfcfd",
  opacity: 0.92,
  transition: "all 0.2s ease",
},

"& .locked-cell:hover": {
  backgroundColor: "#f9fafb",
},

"& .ready-cell": {
  background:
    "linear-gradient(90deg, rgba(236,253,245,0.65) 0%, rgba(255,255,255,1) 100%)",
},
 "@keyframes pulseUrgent": {
    "0%": {
      transform: "scale(1)",
      boxShadow: "0 0 0 0 rgba(220,38,38,0.7)",
    },
    "70%": {
      transform: "scale(1.08)",
      boxShadow: "0 0 0 6px rgba(220,38,38,0)",
    },
    "100%": {
      transform: "scale(1)",
      boxShadow: "0 0 0 0 rgba(220,38,38,0)",
    },
  },
      }}

      
    />  </Box></>
  
  );
};

export default DataTable;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { DataGrid, GridToolbarContainer, GridActionsCellItem, GridRowModes, GridRowEditStopReasons, GridToolbar, } from "@mui/x-data-grid";

function EditToolbar() {
  return (
    <GridToolbarContainer style={{ marginLeft: "auto" }}>
      <GridToolbar />
    </GridToolbarContainer>
  );
}

import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  .BtnInfo {
    cursor: pointer;
    position: fixed;
    bottom: 10px;
    left: 10px;
  }

  .RoleLimit {
    position: fixed;
    bottom: 34px;
    left: 10px;
    padding: 10px;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    border-radius: 5px;
    z-index: 999;
  }

  .UserDataTable button {
    width: auto;
}
`;

export default function UserManager() {
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
  const navigate = useNavigate();
  const storedAuth = JSON.parse(localStorage.getItem("auth"));
  const config = { headers: { Authorization: `Bearer ${storedAuth.accessToken}` } };
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [showRoleInfo, setShowRoleInfo] = useState(true);
  const [loading, setLoading] = useState(true);
  const toggleRoleInfo = () => { setShowRoleInfo(!showRoleInfo); };
  const [error, setError] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccessMessage("");
    setError(false);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`${apiUrl}/users`, { ...config });
        setRows(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error("Unauthorized: Please check your authentication token.");
          navigate("/logout", { replace: true });
        } else {
          console.error("Error fetching data:", error);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [apiUrl]);

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = async (newRow) => {
    try {
      const response = await axios.put(`${apiUrl}/users`, newRow,  { ...config});
      if (response.status === 200 || response.status === 201) {
        console.log("Update data Success:",response);
      }
    } catch (error) {
      console.error("Error updating data:", error);
    }

    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));

    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    { field: "userid", headerName: "รหัส", width: 160, editable: false },
    { field: "name", headerName: "Name", width: 200, editable: false },
    { field: "lastname", headerName: "LastName", width: 220, editable: false },
    {
      field: "role",
      headerName: "สิทธิ์",
      width: 90,
      editable: true,
      type: "singleSelect",
      valueOptions: ["1", "2", "3"],
    },
    {
      field: "level",
      headerName: "ระดับ",
      width: 90,
      editable: true,
      type: "singleSelect",
      valueOptions: ["1", "2", "3", "4"],
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 140,
      cellClassName: "actions",
      getActions: ({ id, row }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <Tooltip title="บันทึก">
              <GridActionsCellItem
                icon={<SaveIcon />}
                label="Save"
                sx={{ color: "primary.main" }}
                onClick={handleSaveClick(id)}
              />
            </Tooltip>,
            <Tooltip title="ยกเลิก">
              <GridActionsCellItem
                icon={<CancelIcon />}
                label="Cancel"
                className="textPrimary"
                onClick={handleCancelClick(id)}
                color="inherit"
              />
            </Tooltip> ,
          ];
        }

        return [
          <Tooltip title="แก้ไขสิทธิ์">
            <GridActionsCellItem
              icon={<EditIcon />}
              label="Edit"
              className="textPrimary"
              onClick={handleEditClick(id)}
              color="inherit"
            />
          </Tooltip>
        ];
      },
    },
  ];

  return (
    <>
      <UserBox className="ResponsiveCon" maxWidth="md" sx={{ padding: "20px !important", marginTop: "50px", }}>
        <GlobalStyle />
        {loading && <p>Loading...</p>}
        {!loading && (
          <Box
            sx={{
              height: "60%",
              width: "100%",
              backgroundColor: "#fff",
              borderRadius: "16px",
              "& .actions": { color: "text.secondary", },
              "& .textPrimary": { color: "text.primary", },
            }}
          >
            <DataGrid
              className="UserDataTable"
              rows={rows}
              columns={columns}
              hideFooterSelectedRowCount={true}
              initialState={{ ...columns.initialState, pagination: { paginationModel: { pageSize: 10 } }, }}
              pageSizeOptions={[10, 25, 50]}
              editMode="row"
              rowModesModel={rowModesModel}
              onRowModesModelChange={handleRowModesModelChange}
              onRowEditStop={handleRowEditStop}
              processRowUpdate={processRowUpdate}
              sx={{ border: "none", fontSize: "18px", fontFamily: "inherit", }}
              slots={{ toolbar: EditToolbar, }}
              slotProps={{ toolbar: { setRows, setRowModesModel }, }}
            />
          </Box>
        )}

        {showRoleInfo && (
          <div className="RoleLimit">
            การจำกัดสิทธิ์(Role)<br />
            1 คือ User <br />
            2 คือ Editer<br />
            3 คือ Admin<br />
            Level(level)<br />
            1 คือ User เห็นเฉพาะงาน<br />
            ในแผนกตัวเอง<br />
            2-4 คือ เห็นทั้งหมด<br />
          </div>
        )}
        <InfoIcon className="BtnInfo" onClick={toggleRoleInfo} />

        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "left" }}
          open={successMessage !== ""}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            severity={error ? "error" : "success"}
            onClose={handleCloseSnackbar}
          >
            {successMessage}
          </MuiAlert>
        </Snackbar>
      </UserBox>
    </>
  );
}

const UserBox = styled(Box)`
  display: block;
  justify-content: center;
  background-color: #fff;
  border-radius: 14px;
  padding: 30px;
  width: 55vw;

  @media screen and (max-width: 680px){
    .BtnInfo {
      bottom: 70px;
    }
    .RoleLimit {
      bottom: 94px;
    }
  }

  @media screen and (max-width: 1200px) {
    width: 90vw;
  }
`;
import React, { useState, useMemo, useCallback, useEffect } from "react";
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Tooltip } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import EditSup from "./EditSup";
import DeleteSup from "./DeleteSup";

export default function SupTable({ data, depData, fetch, loading }) {
  const renderDeptrelateCell = useCallback((deptAffInfo) => {
    const deptNames = (deptAffInfo || []).map((dept) => dept.DepName).join(", ");
    return (
      <Tooltip title={deptNames}>
        <div className="MuiDataGrid-cellContent" role="presentation">
          {deptNames}
        </div>
      </Tooltip>
    );
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
        <p style={{ marginTop: 2 }}>Loading...</p>
      </Box>
    );
  }
  return (
    <TableContainer className="SupTable" component={Paper}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>ชื่อ</TableCell>
            <TableCell width="35%">แผนก/หน่วยงาน</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length > 0 ? (
            data.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.supName}</TableCell>
                <TableCell>{renderDeptrelateCell(row.deptAffInfo)}</TableCell>
                <TableCell>{row.typename}</TableCell>
                <TableCell>
                  <EditSup id={row.id} depData={depData} fetch={fetch} />
                  <DeleteSup id={row.id} fetch={fetch} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell sx={{ textAlign: "center" }} colSpan={5}>ไม่พบข้อมูล</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

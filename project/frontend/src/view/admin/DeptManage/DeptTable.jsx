import React from "react";
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import EditDepart from "./EditDept";
import DeleteDepart from "./DeleteDept";

export default function DepartTable({ data, affs, fetch, loading }) {
  if (loading) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
        <p style={{ marginTop: 2 }}>Loading...</p>
      </Box>
    );
  }

  return (
    <TableContainer className="DeptTable" component={Paper}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.DepName}</TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>
                <EditDepart id={row.id} affs={affs} fetch={fetch} />
                {/* <DeleteDepart id={row.id} fetch={fetch} /> */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

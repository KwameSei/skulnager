import React, { useState } from "react";
import { StyledTableCell, StyledTableRow } from "./styles";
import { Table, TableBody, TableContainer, TableHead, TablePagination, TableRow, Paper } from "@mui/material";

const CustomTable = ({ buttonHaver: ButtonHaver, columns, rows }) => {
    console.log("Rows in CustomTable:", rows);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    if (!columns || !Array.isArray(columns) || columns.length === 0) {
        return <h2>No data available</h2>;
    }

    if (!rows || !Array.isArray(rows) || rows.length === 0) {
        return <h2>No data available</h2>;
    }

    return (
        <>
            <TableContainer>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <StyledTableRow>
                            {columns.map((column) => (
                                <StyledTableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                >
                                    {column.label}
                                </StyledTableCell>
                            ))}
                            <StyledTableCell align="center">
                                Actions
                            </StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {Array.isArray(rows) && rows.length > 0 && rows
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => {
                                return (
                                    <StyledTableRow hover role="checkbox" tabIndex={-1} key={row.id || index}>
                                        {columns.map((column) => {
                                            const value = row[column.id];
                                            return (
                                                <StyledTableCell key={column.id} align={column.align}>
                                                    {
                                                        column.format && typeof value === 'number'
                                                            ? column.format(value)
                                                            : value
                                                    }
                                                </StyledTableCell>
                                            );
                                        })}
                                        <StyledTableCell align="center">
                                            <ButtonHaver row={row} />
                                        </StyledTableCell>
                                    </StyledTableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(event, newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) => {
                    setRowsPerPage(parseInt(event.target.value, 5));
                    setPage(0);
                }}
            />
        </>
    )
}

export default CustomTable;
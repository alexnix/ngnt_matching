import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from "@material-ui/core/TablePagination";
import Paper from "@material-ui/core/Paper";

function TableDisplay({
  data,
  visibleColumns,
  rowsPerPage,
  setRowsPerPage,
  page,
  setPage,
  noPagination = false,
}) {
  return (
    <div>
      <Paper style={{ overflowX: "auto", zIndex: 0 }}>
        <Table>
          <TableHead>
            <TableRow>
              {Object.keys(visibleColumns).map((c) => (
                <TableCell key={c}>{c}</TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {data.res.map((d) => (
              <TableRow key={d.id || d._id}>
                {Object.keys(visibleColumns).map((c) => {
                  return (
                    <TableCell className="editableCell" key={c}>
                      <div className="editableCell">{d[visibleColumns[c]]}</div>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}

export default TableDisplay;

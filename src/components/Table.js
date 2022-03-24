import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableContainer from "@material-ui/core/TableContainer";

const StyledTableContainer = withStyles((theme) => ({
  root: {
    // borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.secondary.main,
  },
}))(TableContainer);

const StyledTable = withStyles((theme) => ({
  root: {
    // borderSpacing: "5px",
    // borderCollapse: "separate",
    backgroundColor: theme.palette.secondary.main,
  },
}))(Table);

const StyledTableRow = withStyles((theme) => ({
  root: {
    height: 20,
    backgroundColor: theme.palette.common.white,
    borderTop: `15px solid ${theme.palette.secondary.main}`,
  },
  head: {
    borderTop: 0,
  },
}))(TableRow);

const StyledTableCell = withStyles((theme) => ({
  root: {
    padding: 6,
    border: "none",
  },
  head: {
    fontSize: 16,
    fontWeight: "bold",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    backgroundColor: "transparent",
    color: theme.palette.primary.contrastText,
  },
  body: {
    fontSize: 15,
    overflow: "hidden",
    fontWeight: "normal",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    backgroundColor: "transparent",
    color: theme.palette.primary.contrastText,
  },
}))(TableCell);

export default function DataTable(props) {
  return (
    <StyledTableContainer>
      <StyledTable>
        <TableHead>
          <StyledTableRow>
            {props.headers.map((header, index) => (
              <StyledTableCell align="center" key={index}>
                {header}
              </StyledTableCell>
            ))}
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {props.rows.map((row, i) => (
            <StyledTableRow
              key={i}
              onClick={() => {
                props.onClick && props.onClick(i);
                props.modalHandler && props.modalHandler(true);
              }}
              style={
                props.onClick
                  ? {
                      cursor: "pointer",
                    }
                  : {}
              }
            >
              {row.map((cell, index) => (
                <StyledTableCell
                  component="th"
                  scope="row"
                  key={index}
                  align="center"
                >
                  {cell}
                </StyledTableCell>
              ))}
            </StyledTableRow>
          ))}
        </TableBody>
      </StyledTable>
    </StyledTableContainer>
  );
}

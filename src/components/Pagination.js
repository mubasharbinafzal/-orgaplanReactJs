import React from "react";
import Pagination from "@material-ui/lab/Pagination";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    display: "grid",
    placeItems: "center",
    marginTop: theme.spacing(4),
  },
  item: {
    "& .Mui-selected": {
      color: "#fff",
    },
  },
}));

export default function PaginationRounded(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Pagination
        count={props.count}
        color="primary"
        shape="rounded"
        // siblingCount={0}
        page={props.page}
        className={classes.item}
        defaultPage={props.page}
        onChange={props.onChange}
      />
    </div>
  );
}

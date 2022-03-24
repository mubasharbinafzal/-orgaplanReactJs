import React from "react";
import Skeleton from "@material-ui/lab/Skeleton";
import { makeStyles } from "@material-ui/core/styles";

import Form from "./Form";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  container: {
    display: "grid",
    gridColumnGap: "20px",
  },
  header: {
    height: 80,
    width: "100%",
    backgroundColor: theme.palette.primary.main,
  },
  body: {
    height: 100,
    width: "calc(100% / 2.8)",
  },
}));

export default function TableSkeleton() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Form.Row noMargin className={classes.container}>
        <Skeleton className={classes.header} />
        <Skeleton className={classes.header} />
        <Skeleton className={classes.header} />
      </Form.Row>
      <Form.Row noMargin className={classes.container}>
        <Skeleton className={classes.body} />
        <Skeleton className={classes.body} />
        <Skeleton className={classes.body} />
      </Form.Row>
      <Form.Row noMargin className={classes.container}>
        <Skeleton className={classes.body} />
        <Skeleton className={classes.body} />
        <Skeleton className={classes.body} />
      </Form.Row>
    </div>
  );
}

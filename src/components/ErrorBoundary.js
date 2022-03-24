import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const styles = (theme) => {
  const borderColor = "#f5f5f5";
  const black = theme.palette.common.black;

  return {
    ErrorBoundary: {
      width: "100vw",
      height: "100vh",
      display: "flex",
      alignItems: "center",
      backgroundSize: "cover",
      flexDirection: "column",
      justifyContent: "center",
      backgroundColor: borderColor,
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    },
    Text404: {
      margin: "0",
      color: black,
      fontSize: "4em",
      textAlign: "center",
      letterSpacing: ".2px",
      fontFamily: "Roboto Mono, monospace",
    },
    button: {
      width: 300,
      marginTop: "15em",
      borderColor: "#fff",
      color: theme.palette.common.white,
    },
  };
};

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }
  //   static getDerivedStateFromError(error) {
  //     // Update state so the next render will show the fallback UI.
  //     return { hasError: true };
  //   }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
    // You can also log error messages to an error reporting service here
  }

  render() {
    const { classes } = this.props;
    if (this.state.errorInfo) {
      // Error path
      return (
        <div className={classes.ErrorBoundary}>
          <p className={classes.Text404}>404, page not found.</p>
          <Button
            color="primary"
            variant="contained"
            className={classes.button}
            onClick={() => (window.location = "/")}
          >
            Home
          </Button>
        </div>
      );
    }
    // Normally, just render children
    return this.props.children;
  }
}

export default withStyles(styles, { withTheme: true })(ErrorBoundary);

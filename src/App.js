import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Provider } from "react-redux";
import { SnackbarProvider } from "notistack";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";

import store from "./redux/store";
import Main from "./container/Main";
import Notifier from "./redux/Notifier";
import ErrorBoundary from "./components/ErrorBoundary";

// React Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";

const theme = createMuiTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 480,
      md: 768,
      lg: 1024,
      xl: 1650,
    },
  },
  palette: {
    primary: {
      main: "#DBB20A",
      contrastText: "#7E7878",
    },
    secondary: {
      main: "#F8F8F8",
      contrastText: "#000",
    },
    error: {
      main: "#FD000A",
    },
    blue: "#140772",
    grey: {
      100: "#707070",
    },
    custom: {
      disabled: "#707070",
    },
  },
  shape: {
    borderRadius: 10,
  },
});
theme.shadows[25] = "0px 3px 6px rgba(0, 0, 0, 0.16)";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <ErrorBoundary>
        <Provider store={store}>
          <SnackbarProvider
            dense={false}
            hideIconVariant={false}
            preventDuplicate={false}
            autoHideDuration={2000}
            // persist={true}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
          >
            <CssBaseline />
            <Notifier />
            <BrowserRouter>
              <Main />
            </BrowserRouter>
          </SnackbarProvider>
        </Provider>
      </ErrorBoundary>
    </ThemeProvider>
  );
};

export default App;

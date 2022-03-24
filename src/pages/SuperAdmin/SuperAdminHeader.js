import React, { useState } from "react";
import clsx from "clsx";
import Fab from "@material-ui/core/Fab";
import List from "@material-ui/core/List";
import Drawer from "@material-ui/core/Drawer";
import MenuIcon from "@material-ui/icons/Menu";
import ListItem from "@material-ui/core/ListItem";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { NavLink, useLocation } from "react-router-dom";

import Actions from "../../redux/actions";
import Logo from "../../assets/icons/Logo.svg";
// import { ReactComponent as Logs } from "../../assets/icons/Logs.svg";
import { ReactComponent as Sites } from "../../assets/icons/Sites.svg";
import { ReactComponent as HomeIcon } from "../../assets/icons/Home.svg";
import { ReactComponent as Admins } from "../../assets/icons/Admins.svg";
import { ReactComponent as Clients } from "../../assets/icons/Clients.svg";
import { ReactComponent as Invoices } from "../../assets/icons/invoices.svg";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: { maxWidth: "100vw", overflow: "hidden" },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    border: "none",
  },
  drawerContainer: {
    height: "100%",
    overflow: "auto",
    backgroundColor: theme.palette.secondary.main,
  },
  logoContainer: {
    width: "100%",
    height: "140px",
    display: "grid",
    placeItems: "center",
  },
  logo: {
    width: "126px",
    height: "121px",
  },
  listItemSelected: {
    color: theme.palette.primary.main,
  },
  listItemIcon: {
    justifyContent: "center",
    marginRight: 15,
  },
  content: {
    width: "100vw",
    paddingLeft: 0,
    paddingTop: 50,
    backgroundColor: "#fff",
    transition: theme.transitions.create("padding", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    position: "relative",
  },
  contentShift: {
    width: "100vw",
    transition: theme.transitions.create("padding", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    paddingLeft: drawerWidth,
  },
  menuButton: {
    position: "absolute",
    margin: "10px 14px",
    top: 0,
  },
}));

const userItems = [
  {
    name: "Home",
    path: ["/", "/home"],
    icon: <HomeIcon />,
  },
  {
    name: "Clients",
    path: "/clients",
    icon: <Clients />,
  },
  {
    name: "Admins",
    path: "/admins",
    icon: <Admins />,
  },
  {
    name: "Sites",
    path: "/sites",
    icon: <Sites />,
  },
  {
    name: "Invoices",
    path: "/invoices",
    icon: <Invoices />,
  },
];

export default function Header(props) {
  const classes = useStyles();
  const location = useLocation();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(true);

  const handleDrawer = () => {
    setOpen((st) => !st);
  };

  return (
    <div className={classes.root}>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerContainer}>
          <div className={classes.logoContainer}>
            <img src={Logo} alt="Orgaplan-Logo" className={classes.logo} />
          </div>
          <List>
            {userItems.map((item) => (
              <ListItem
                button
                key={item.name}
                component={NavLink}
                to={Array.isArray(item.path) ? item.path[0] : item.path}
                className={clsx({
                  [classes.listItemSelected]: Array.isArray(item.path)
                    ? item.path.some((it) => it === location.pathname)
                    : location.pathname.startsWith(item.path),
                })}
              >
                <ListItemIcon
                  className={clsx(classes.listItemIcon, {
                    [classes.listItemSelected]: Array.isArray(item.path)
                      ? item.path.some((it) => it === location.pathname)
                      : location.pathname.startsWith(item.path),
                  })}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItem>
            ))}
            <ListItem
              button
              key={"logout"}
              onClick={() => dispatch(Actions.auth.do_logout())}
            >
              <ListItemIcon className={classes.listItemIcon}>
                {<ExitToAppIcon />}
              </ListItemIcon>
              <ListItemText primary={"Logout"} />
            </ListItem>
          </List>
        </div>
      </Drawer>

      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <Fab
          color="inherit"
          aria-label="handle-drawer"
          onClick={handleDrawer}
          className={classes.menuButton}
        >
          <MenuIcon color="primary" />
        </Fab>
        {props.children}
      </main>
    </div>
  );
}

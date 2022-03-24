import React, { useState } from "react";
import clsx from "clsx";
import Fab from "@material-ui/core/Fab";
import List from "@material-ui/core/List";
import Drawer from "@material-ui/core/Drawer";
import MenuIcon from "@material-ui/icons/Menu";
import ListItem from "@material-ui/core/ListItem";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import GLOBALS from "../../globals";
import Actions from "../../redux/actions";
import Logo from "../../assets/icons/Logo.svg";
import SiteImage from "../../assets/images/Site.png";
import { ReactComponent as Pic } from "../../assets/icons/pic.svg";
import { ReactComponent as Means } from "../../assets/icons/means.svg";
import { ReactComponent as Calender } from "../../assets/icons/calender.svg";
// import { ReactComponent as Invoices } from "../../assets/icons/invoices.svg";
import { ReactComponent as Incidents } from "../../assets/icons/incidents.svg";
import { ReactComponent as Companies } from "../../assets/icons/companies.svg";
import { ReactComponent as Organigramme } from "../../assets/icons/organigramme.svg";

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
  imageContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "1.5rem",
    marginBottom: "1rem",
  },
  profileImage: {
    position: "absolute",
    top: "1rem",
    right: "3rem",
    textAlign: "center",
    color: "#454545",
  },
  siteImage: {
    width: 200,
    height: 125,
    backgroundSize: "contain",
    borderRadius: theme.shape.borderRadius,
  },
  avatarImg: {
    width: 60,
    height: 60,
    borderRadius: "100%",
    backgroundSize: "contain",
  },
}));

const userItems = [
  {
    name: "Calendar",
    path: ["/", "/calendar"],
    icon: <Calender />,
  },
  {
    name: "Means",
    path: "/means",
    icon: <Means />,
  },
  {
    name: "P.I.C intéractif",
    path: "/pic-interactive",
    icon: <Pic />,
  },
  {
    name: "Incidents",
    path: "/incidents",
    icon: <Incidents />,
  },
  // {
  //   name: "Invoices",
  //   path: "/invoices",
  //   icon: <Invoices />,
  // },
  {
    name: "Companies",
    path: "/companies",
    icon: <Companies />,
  },
  {
    name: "Organigramme",
    path: "/organigramme",
    icon: <Organigramme />,
  },
];

export default function AdminHeader(props) {
  const classes = useStyles();
  const location = useLocation();
  const dispatch = useDispatch();
  const storeAuth = useSelector((state) => state.auth);
  const storeAdmin = useSelector((state) => state.admin);

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
          <div className={classes.imageContainer}>
            <div
              style={{
                color: "#7E7878",
                fontWeight: "bold",
                fontSize: "16px",
                marginBottom: "5px",
              }}
            >
              {storeAdmin.site.siteId.name}
            </div>
            <img
              src={
                storeAdmin.site?.siteId?.logo
                  ? GLOBALS.Constants.BASE_URL + storeAdmin.site?.siteId?.logo
                  : SiteImage
              }
              alt="siteImage"
              className={classes.siteImage}
            />
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
        <div className="d-flex">
          <Fab
            color="inherit"
            aria-label="handle-drawer"
            onClick={handleDrawer}
            className={classes.menuButton}
          >
            <MenuIcon color="primary" />
          </Fab>
          <div
            className={classes.profileImage}
            onClick={() => dispatch(Actions.admin.reset_state())}
          >
            <img
              src={
                storeAuth.user.image
                  ? GLOBALS.Constants.BASE_URL + storeAuth.user.image
                  : SiteImage
              }
              alt="adminProfile"
              className={classes.avatarImg}
              onClick={() => dispatch(Actions.admin.reset_state())}
            />
            <div>{`${storeAuth.user.firstName} ${storeAuth.user.lastName}`}</div>
          </div>
        </div>
        {props.children}
      </main>
    </div>
  );
}

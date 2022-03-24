import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import IconButton from "@material-ui/core/IconButton";
import _ from "lodash";

import GLOBALS from "../../globals";
import Actions from "../../redux/actions";

import Form from "../../components/Form";
import Card from "../../components/Card";
import Modal from "../../components/Modal";
import Loader from "../../components/Loader";
import Button from "../../components/Button";
import Heading from "../../components/Heading";
import FormInput from "../../components/FormInput";
import SmallText from "../../components/SmallText";
import FormLabel from "../../components/FormLabel";
import PhoneBox from "../../components/PhoneBox";
import SubHeading from "../../components/SubHeading";
import AvatarUpload from "../../components/AvatarUpload";
import OutlinedCapsuledButton from "../../components/OutlinedCapsuledButton";

import Logo from "../../assets/icons/Logo.svg";
import SiteImage from "../../assets/images/Site.png";
import { ReactComponent as Pencil } from "../../assets/icons/Pencil.svg";
import { ReactComponent as PlusCircle } from "../../assets/icons/PlusCircle.svg";

const useStyles = makeStyles((theme) => ({
  page: {
    height: "100vh",
  },
  root: {
    height: "100%",
    width: "calc(100% - 384px)",
    padding: GLOBALS.Styles.pagePaddingNormal,
    backgroundColor: theme.palette.common.white,
  },
  content: {
    overflow: "hidden",
    borderRadius: theme.shape.borderRadius,
    marginTop: GLOBALS.Styles.pageContentMargin,
    backgroundColor: theme.palette.secondary.main,
    padding: GLOBALS.Styles.pageContentNormalPadding,
  },
  // Header
  logo: {
    width: "126px",
    height: "121px",
  },
  // Sites
  sitesGrid: {
    display: "grid",
    gridGap: "30px",
    gridTemplateRows: "repeat(auto-fit, minmax(300px, 300px))",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 300px))",
  },
  image: {
    width: 260,
    height: 175,
    backgroundSize: "contain",
    borderRadius: theme.shape.borderRadius,
  },
  // Add Site Card
  addSiteCardImageContainer: {
    position: "relative",
  },
  addSiteCardImage: {
    width: 260,
    height: 175,
    opacity: 0.5,
    backgroundSize: "contain",
    borderRadius: theme.shape.borderRadius,
  },
  addSitePlusContainer: {
    zIndex: 10,
    width: "100%",
    height: "100%",
    display: "grid",
    position: "absolute",
    placeItems: "center",
  },
  addSitePlus: {
    width: "80%",
    height: "80%",
    color: theme.palette.grey[100],
  },
  // Profile Card
  profile: {
    width: 384,
    height: "100%",
    display: "grid",
    placeItems: "center",
    padding: GLOBALS.Styles.pagePaddingNormal,
    backgroundColor: theme.palette.secondary.main,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: "100%",
    backgroundSize: "contain",
  },
  profileEditButton: {
    padding: 6,
    borderRadius: "100%",
    border: `1px solid ${theme.palette.grey[200]}`,
  },
}));

function generatePhone(phone) {
  var str = String(phone);
  // str = "+" + str;
  var parts = str.match(/.{1,2}/g);
  var new_value = parts.join(".");
  return new_value;
}

function SiteCard({ site, role, onClick }) {
  const classes = useStyles();
  return (
    <Card onClick={onClick} padding="20px">
      <Form.Row noMargin justifyContent="center">
        <SmallText primary={site.name} bold noWrap />
      </Form.Row>
      <Form.Row>
        <img
          alt={`site:${site.name}`}
          className={classes.image}
          src={site.logo ? GLOBALS.Constants.BASE_URL + site.logo : SiteImage}
        />
      </Form.Row>
      <Form.Row justifyContent="center" noMargin>
        <SmallText primary={`Rôle: ${role}`} />
      </Form.Row>
    </Card>
  );
}

function SiteAddCard({ onClick }) {
  const classes = useStyles();
  return (
    <Card padding="20px" onClick={onClick}>
      <Form.Row noMargin justifyContent="center">
        <SmallText primary="Créer un nouveau projet" bold noWrap />
      </Form.Row>
      <Form.Row className={classes.addSiteCardImageContainer}>
        <img
          src={SiteImage}
          alt={`create-site`}
          className={classes.addSiteCardImage}
        />
        <div className={classes.addSitePlusContainer}>
          <PlusCircle className={classes.addSitePlus} />
        </div>
      </Form.Row>
      <Form.Row justifyContent="center" noMargin>
        <SmallText primary={""} />
      </Form.Row>
    </Card>
  );
}

function ProfileCard({ user, company, onClick, onPasswordChange, onLogout }) {
  const classes = useStyles();
  return (
    <Card disableHeight>
      <Form.Row justifyContent="flex-end" noMargin>
        <IconButton className={classes.profileEditButton} onClick={onClick}>
          <Pencil style={{ width: 20, height: 20 }} />
        </IconButton>
      </Form.Row>
      <Form.Row justifyContent="center" noMargin>
        <img
          alt="avatar"
          className={classes.avatar}
          src={user.image ? GLOBALS.Constants.BASE_URL + user.image : SiteImage}
        />
      </Form.Row>
      <Form.Row justifyContent="center">
        <SubHeading bold primary={`${user.firstName} ${user.lastName}`} />
      </Form.Row>
      <Form.Item />
      <Form.Column>
        <SmallText bold primary="ADRESSE E-MAIL :" noMargin />
        <SmallText primary={user.email} />
      </Form.Column>
      <Form.Column>
        <SmallText bold primary="TELEPHONE :" noMargin />
        <SmallText primary={generatePhone(user.phone)} />
      </Form.Column>
      <Form.Column>
        <SmallText bold primary="ENTREPRISE :" noMargin />
        <SmallText primary={company?.name} />
      </Form.Column>
      <Form.Row></Form.Row>
      <Form.Row justifyContent="center">
        <OutlinedCapsuledButton
          onClick={onPasswordChange}
          text="MODIFIER MON MOT DE PASSE"
        />
      </Form.Row>
      <Form.Row justifyContent="center">
        <OutlinedCapsuledButton text="ME DECONNECTER" onClick={onLogout} />
      </Form.Row>
    </Card>
  );
}

export default function Sites(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);

  const [items, setItems] = useState([]);
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(true);

  const [actionLoading, setActionLoading] = useState(false);

  const [passwordModal, setPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [profileModal, setProfileModal] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState("");
  const [phone, setPhone] = useState("");
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    fetchData();
    setFirstName(store.user.firstName);
    setLastName(store.user.lastName);
    setImage({
      uri: GLOBALS.Constants.BASE_URL + store.user.image,
    });
    let s = store.user.phone.substring(1);
    setPhone(s);
    // eslint-disable-next-line
  }, []);

  async function fetchData() {
    try {
      const result = await GLOBALS.API({
        uri: `${GLOBALS.Constants.GET_USER_SITES}/${store.user._id}`,
      });
      try {
        const adminCompany = await GLOBALS.API({
          uri: `${GLOBALS.Constants.GET_ADMIN_COMPANY}/${store.user._id}`,
        });
        dispatch(Actions.admin.set_company(adminCompany.data));
        setCompany(adminCompany.data);
      } catch (e) {
        console.log("e");
      }
      setItems(result.data.sites);
      setLoading(false);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  async function onPasswordChange(e) {
    try {
      e.preventDefault();
      setActionLoading(true);
      const formdata = JSON.stringify({
        oldPassword,
        newPassword,
      });

      const data = await GLOBALS.API({
        method: "PUT",
        uri: `${GLOBALS.Constants.UPDATE_PASSWORD}/${store.user._id}`,
        body: formdata,
      });
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(data.message, "success"),
        ),
      );
      setPasswordModal(false);
      setActionLoading(false);
      resetState();
    } catch (err) {
      setActionLoading(false);
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  async function onProfileUpdate(e) {
    try {
      e.preventDefault();
      setActionLoading(true);
      const formdata = new FormData();
      formdata.append("firstName", firstName);
      formdata.append("lastName", lastName);
      formdata.append("phone", "+" + phone);
      image.file && formdata.append("image", image.file);

      const response = await GLOBALS.API({
        method: "PUT",
        uri: `${GLOBALS.Constants.UPDATE_USER}/${store.user._id}`,
        body: formdata,
        headers: {
          Authorization: `Bearer ${store.token}`,
        },
      });
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(response.message, "success"),
        ),
      );
      const user = _.cloneDeep(store.user);
      user.firstName = firstName;
      user.lastName = lastName;
      user.phone = "+" + phone;
      user.image = response.data.image;
      dispatch(Actions.auth.set_user(user));
      setProfileModal(false);
      setActionLoading(false);
    } catch (err) {
      setActionLoading(false);
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  function handleChange(name, value) {
    if (name === "oldPassword") setOldPassword(value);
    else if (name === "newPassword") setNewPassword(value);
    else if (name === "confirmPassword") setConfirmPassword(value);
    else if (name === "firstName") setFirstName(value);
    else if (name === "lastName") setLastName(value);
    else if (name === "phone") setPhone(value);
    else if (name === "image") {
      setUpdate((st) => !st);
      setImage(value);
    }
  }

  function resetState() {
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setFirstName("");
    setLastName("");
    setImage("");
    setPhone("");
  }

  return (
    <>
      <Form.Row className={classes.page} noMargin>
        <div className={classes.root}>
          <Form.Row
            margin="0 0 20px 0"
            alignItems="center"
            justifyContent="space-between"
          >
            <img src={Logo} alt="Orgaplan-Logo" className={classes.logo} />
            <SmallText primary="Go To Home Page" to="/" underline noMargin />
          </Form.Row>
          <Heading primary="BIENVENUE SUR ORGAPLAN ! " noWrap noMargin />
          <SmallText
            primary="Cliquez sur un projet existant ou bien créez un nouveau projet : "
            noWrap
          />
          <div className={classes.content}>
            {loading ? (
              <Loader.Progress />
            ) : (
              <div className={classes.sitesGrid}>
                {items.map((site) => (
                  <SiteCard
                    role={site.role}
                    site={site.siteId}
                    key={site.siteId._id}
                    onClick={() =>
                      site.role === "ADMIN" &&
                      dispatch(Actions.admin.set_site(site))
                    }
                  />
                ))}
                {store.user.adminType === "MASTERADMIN" && (
                  <SiteAddCard
                    onClick={() => props.history.push("/add-site")}
                  />
                )}
              </div>
            )}
          </div>
        </div>
        <div className={classes.profile}>
          <ProfileCard
            user={store.user}
            company={company}
            onClick={() => setProfileModal(true)}
            onLogout={() => dispatch(Actions.auth.do_logout())}
            onPasswordChange={() => setPasswordModal(true)}
          />
        </div>
      </Form.Row>
      <Modal
        title="EDIT PASSWORD"
        open={passwordModal}
        onClose={() => {
          setPasswordModal(false);
        }}
        body={
          <Form.Form onSubmit={onPasswordChange}>
            <Form.Row>
              <FormLabel bold primary="OLD PASSWORD *: " />
              <Form.Row noMargin width="48%">
                <FormInput
                  type="password"
                  name="oldPassword"
                  value={oldPassword}
                  placeholder="Old Password"
                  onChange={({ target: { name, value } }) =>
                    handleChange(name, value)
                  }
                />
              </Form.Row>
            </Form.Row>
            <Form.Row>
              <FormLabel bold primary="NEW PASSWORD *: " />
              <Form.Row noMargin width="48%">
                <FormInput
                  type="password"
                  name="newPassword"
                  value={newPassword}
                  placeholder="New Password"
                  onChange={({ target: { name, value } }) =>
                    handleChange(name, value)
                  }
                />
              </Form.Row>
            </Form.Row>
            <Form.Row>
              <FormLabel bold primary="CONFIRM PASSWORD *: " />
              <Form.Row noMargin width="48%">
                <FormInput
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  placeholder="Confirm Password"
                  onChange={({ target: { name, value } }) =>
                    handleChange(name, value)
                  }
                />
              </Form.Row>
            </Form.Row>
            <Form.Row justifyContent="center">
              <Button
                type="submit"
                text="VALIDATE"
                minWidth="30%"
                fullWidth={false}
                loading={actionLoading}
                disabled={
                  actionLoading ||
                  !oldPassword ||
                  !newPassword ||
                  confirmPassword !== newPassword
                }
              />
            </Form.Row>
          </Form.Form>
        }
      />
      {update && ""}
      <Modal
        title="EDIT PROFILE"
        open={profileModal}
        onClose={() => {
          setProfileModal(false);
        }}
        body={
          <Form.Form onSubmit={onProfileUpdate}>
            <Form.Row justifyContent="center">
              <AvatarUpload
                value={image}
                onChange={(file) => {
                  const uri = URL.createObjectURL(file);
                  handleChange("image", { file, uri });
                }}
              />
            </Form.Row>
            <Form.Row />
            <Form.Row>
              <FormLabel bold primary="FIRST NAME *: " />
              <Form.Row noMargin width="48%">
                <FormInput
                  name="firstName"
                  value={firstName}
                  placeholder="First Name"
                  style={{ width: "100%" }}
                  onChange={({ target: { name, value } }) =>
                    handleChange(name, value)
                  }
                />
              </Form.Row>
            </Form.Row>
            <Form.Row>
              <FormLabel bold primary="LAST NAME *: " />
              <Form.Row noMargin width="48%">
                <FormInput
                  name="lastName"
                  value={lastName}
                  placeholder="Last Name"
                  onChange={({ target: { name, value } }) =>
                    handleChange(name, value)
                  }
                />
              </Form.Row>
            </Form.Row>
            <Form.Row>
              <FormLabel bold primary="PHONE *: " />
              <Form.Row noMargin width="48%">
                <PhoneBox
                  type="number"
                  name="phone"
                  value={phone}
                  placeholder="Phone"
                  onChange={({ target: { name, value } }) =>
                    value.length < 26 ? handleChange(name, value) : ""
                  }
                />
              </Form.Row>
            </Form.Row>
            <Form.Row justifyContent="center">
              <Button
                type="submit"
                text="VALIDATE"
                minWidth="30%"
                fullWidth={false}
                loading={actionLoading}
                disabled={
                  actionLoading || !image || !firstName || !lastName || !phone
                }
              />
            </Form.Row>
          </Form.Form>
        }
      />
    </>
  );
}

import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import GLOBALS from "../../../globals";
import Actions from "../../../redux/actions";

import Form from "../../../components/Form";
import Modal from "../../../components/Modal";
import SmallButton from "../../../components/SmallButton";
import { Images } from "../../../assets/Assets";
import Table from "../../../components/Table";
import Button from "../../../components/Button";
import Heading from "../../../components/Heading";
import PhoneBox from "../../../components/PhoneBox";
import FormInput from "../../../components/FormInput";
import FormSelect from "../../../components/FormSelect";
import SubHeading from "../../../components/SubHeading";
import SearchInput from "../../../components/SearchInput";
import AvatarUpload from "../../../components/AvatarUpload";
import uploadIcon from "../../../assets/images/upload.png";
import IconButton from "@material-ui/core/IconButton";
const useStyles = makeStyles((theme) => ({
  root: {
    padding: GLOBALS.Styles.pagePadding,
  },
  content: {
    overflow: "hidden",
    borderRadius: theme.shape.borderRadius,
    padding: GLOBALS.Styles.pageContentPadding,
    marginTop: GLOBALS.Styles.pageContentMargin,
    backgroundColor: theme.palette.secondary.main,
  },
}));

export default function UserList(props) {
  const theme = useTheme();
  const classes = useStyles();
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);
  const adminStore = useSelector((state) => state.admin);
  // const [companies, setCompanies] = useState([]);
  const [userList, setUserList] = useState([]);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [filterCompanyId, setFilterCompanyId] = useState("");
  const [filterUserName, setFilterUserName] = useState("");
  // const [editModel, setEditModel] = useState("");
  const [dropdownCompanies, setDropdownCompanies] = useState([]);
  const [dropdownRoles, setDropdownRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [userId, setUserId] = useState("");
  const [siteName, setSiteName] = useState("");
  const [fullName, setFullName] = useState("");
  const [uploadFlag, setUploadFlag] = useState(false);

  const DonwloadFile = async () => {
    var fileName = "uploads/company/template.xlsx";
    var url = GLOBALS.Constants.BASE_URL + fileName;
    var req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.responseType = "blob";
    req.onload = function () {
      var blob = new Blob([req.response], {
        type: "application/octetstream",
      });
      var isIE = false || !!document.documentMode;
      if (isIE) {
        window.navigator.msSaveBlob(blob, fileName);
      } else {
        var url = window.URL || window.webkitURL;
        let link = url.createObjectURL(blob);
        var a = document.createElement("a");
        a.setAttribute("download", fileName);
        a.setAttribute("href", link);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    };
    req.send();
  };
  const uploadCsvFile = async (file) => {
    const formData = new FormData();
    formData.append("companiesdata", file);
    try {
      const response = await GLOBALS.API({
        method: "POST",
        uri: `${GLOBALS.Constants.ADDCOMPANYDATA}/${filterCompanyId}`,
        headers: {
          Authorization: store.token,
        },
        body: formData,
      });
      response.data.shift();
      response.data.map(async (key, index) => {
        try {
          var formdata = new FormData();
          // logo[0]?.file && formdata.append("image", logo[0].file);
          formdata.append("firstName", key[2]);
          formdata.append("lastName", key[3]);
          formdata.append("email", key[0]);
          formdata.append("phone", key[1]);
          formdata.append("siteId", adminStore.site.siteId._id);
          formdata.append("companyId", filterCompanyId);
          formdata.append("role", key[4]);

          await GLOBALS.API({
            method: "POST",
            uri: GLOBALS.Constants.ADD_COMPANY_USER,
            headers: {
              Authorization: store.token,
            },
            body: formdata,
          });
          setLoading(false);
        } catch (err) {
          setLoading(false);
          dispatch(
            Actions.notistack.enqueueSnackbar(
              Actions.notistack.snackbar(err.message, "error"),
            ),
          );
        }
        setUploadFlag(true);
      });

      setLoading(false);
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar("File Uploaded successfully ", "success"),
        ),
      );
    } catch (err) {
      setLoading(false);
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };
  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    filteredUser();
    setUploadFlag(false);
    // eslint-disable-next-line
  }, [filterCompanyId, filterUserName, uploadFlag]);

  async function filteredUser() {
    try {
      const params = { siteId: adminStore.site.siteId._id };
      if (filterCompanyId.length !== 0) params["companyId"] = filterCompanyId;
      if (filterUserName.length !== 0) params["name"] = filterUserName;
      const response = await GLOBALS.API({
        uri: `${GLOBALS.Constants.FILTER_USER}`,
        token: store.token,
        method: "POST",
        body: JSON.stringify(params),
      });
      if (response.success) {
        if (response.data.users) {
          const data = response.data.users.filter((x) => {
            return x.companyId._id === filterCompanyId && x.userId !== null;
          });
          const callculateData = data.filter((x) => x.role !== "ADMIN");
          setUserList(callculateData);
        } else {
          setUserList([]);
        }
      } else {
        setUserList([]);
      }
    } catch (err) {
      setUserList([]);
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  const getData = async () => {
    try {
      setSiteName(adminStore.site.siteId.name);

      const userResponse = await GLOBALS.API({
        uri: `${GLOBALS.Constants.GET_ADD_USER}/${adminStore.site.siteId._id}/${store.user._id}`,
        token: store.token,
      });
      if (userResponse.success) {
        if (userResponse.data.roles != null) {
          const rolesTemp = [];
          userResponse.data.roles.map((item, index) => {
            return rolesTemp.push({ label: item, value: item });
          });
          setDropdownRoles(rolesTemp);
        }
        if (userResponse.data.site_companies.companies) {
          const companyTemp = [];
          userResponse.data.site_companies.companies.map((item, index) => {
            return companyTemp.push({
              label: item.companyId.name,
              value: item.companyId._id,
            });
          });
          setDropdownCompanies(companyTemp);
        }
      }
      setFilterCompanyId(props?.match?.params?.id);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };

  const onUpdate = async (e) => {
    try {
      e.preventDefault();

      var formdata = new FormData();
      formdata.append("role", selectedRole);
      formdata.append("siteId", adminStore.site.siteId._id);
      formdata.append("email", email);
      formdata.append("companyId", companyId);
      formdata.append("userId", userId);
      formdata.append("phone", "+" + phone);
      image.file && formdata.append("image", image.file);

      await GLOBALS.API({
        method: "PUT",
        uri: GLOBALS.Constants.UPDATE_COMPANY_USER,
        headers: {
          Authorization: store.token,
        },
        body: formdata,
      });
      filteredUser();
      setOpen(false);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const resendMail = async (email) => {
    try {
      await GLOBALS.API({
        uri: `${GLOBALS.Constants.RESEND_EMAIL_VERIFICATION}?email=${email}`,
        token: store.token,
        method: "POST",
      });
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(
            GLOBALS.I18n.t("emailSentSuccess"),
            "success",
          ),
        ),
      );
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };
  let rows = userList.map(
    (item) =>
      ((item.companyId && item.userId) || item.role !== "ADMIN") && [
        item.userId.firstName + " " + item.userId.lastName,
        item.companyId.name,
        item.role,
        item.userId.isVerified ? "Inscrit" : "En attente",
        item.userId.email,
        <SmallButton
          text={item.userId.isVerified ? "Edit" : "Re-Send"}
          onClick={(e) => {
            updateEditModel(item);
          }}
          color={theme.palette.primary.contrastText}
          to={"/companies"}
          style={{
            marginLeft: 10,
            borderRadius: 4,
          }}
        />,
      ],
  );
  async function updateEditModel(editModel) {
    if (editModel) {
      if (editModel.userId.isVerified) {
        handleClickOpen();
        setFullName(
          editModel.userId.firstName + " " + editModel.userId.lastName,
        );
        setEmail(editModel.userId.email);
        setSelectedRole(editModel.role);
        setPhone(editModel.userId.phone.substring(1));
        setCompanyId(editModel.companyId._id);
        setImage({
          uri: GLOBALS.Constants.BASE_URL + editModel.userId.image,
        });
        setUserId(editModel.userId._id);
      } else {
        resendMail(editModel.userId.email);
      }
    }
  }
  return (
    <>
      <div className={classes.root}>
        <Form.Row alignItems="center" className="pr-3">
          <Heading primary="LIST OF USERS" noWrap />
          <div>
            <Form.Row alignItems="center" noMargin>
              <SubHeading
                disableMargin
                primary={`Total : ${userList.length} Users`}
                bold
              />
              <Button
                fullWidth={false}
                component={NavLink}
                text="ADD A USER"
                style={{ marginLeft: "20px" }}
                to={"/companies/add-user"}
              />
            </Form.Row>
          </div>
        </Form.Row>

        <Form.Row noMargin>
          <Form.Row style={{ justifyContent: "flex-start" }} noMargin>
            <SearchInput
              placeholder="Name OF USER"
              value={filterUserName}
              onClick={filteredUser}
              onChange={(e) => {
                setFilterUserName(e.target.value);
              }}
            />
            <FormSelect
              placeholder="Company"
              name="color"
              value={filterCompanyId}
              style={{ marginLeft: "20px", maxWidth: 250 }}
              values={dropdownCompanies}
              onChange={(e) => {
                const index = e.target.selectedIndex - 1;
                if (index !== -1) {
                  const item = e.target.value;
                  setFilterCompanyId(item);
                }
              }}
            />

            <input
              className={classes.input}
              id="uploadPicture"
              type="file"
              style={{ display: "none" }}
              onChange={(e) => {
                uploadCsvFile(e.target.files[0]);
              }}
            />

            <label htmlFor="uploadPicture">
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="span"
              >
                <img
                  src={Images.uploadIcon}
                  style={{ width: 18, height: 17 }}
                  alt="Icon"
                />
              </IconButton>
            </label>
            <label style={{ "padding-top": "8px" }}>
              <IconButton
                style={{ padding: "6px", color: "#1890ff" }}
                onClick={() => {
                  DonwloadFile();
                }}
              >
                <img
                  src={Images.downloadIcon}
                  style={{ width: 18, height: 17 }}
                  alt="Icon"
                />
              </IconButton>
            </label>
          </Form.Row>
        </Form.Row>
        <div className={classes.content}>
          <Table headers={GLOBALS.Data.userList.headings} rows={rows} />
        </div>
      </div>
      <Modal
        title={fullName}
        open={open}
        onClose={() => setOpen(false)}
        body={
          <Form.Form onSubmit={onUpdate}>
            <Form.Row justifyContent="center">
              <AvatarUpload
                value={image}
                onChange={(file) => {
                  const uri = URL.createObjectURL(file);
                  setImage({ file, uri });
                }}
              />
            </Form.Row>
            <Form.Row justifyContent="center">
              <FormInput
                name="email"
                value={email}
                // error={firstName}
                disabled
                placeholder="Email"
                style={GLOBALS.Styles.inputWidth}
              />
            </Form.Row>
            <Form.Row justifyContent="center">
              <PhoneBox
                name="phone"
                type="number"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                }}
                placeholder="Phone"
                style={GLOBALS.Styles.inputWidth}
              />
            </Form.Row>

            <Form.Row justifyContent="center">
              <FormInput
                name="company"
                value={siteName}
                disabled
                // error={lastName}
                placeholder="Company"
                style={GLOBALS.Styles.inputWidth}
              />
            </Form.Row>

            <Form.Row justifyContent="center">
              <FormSelect
                placeholder="RÔLE : "
                name="color"
                style={GLOBALS.Styles.inputWidth}
                values={dropdownRoles}
                value={selectedRole}
                onChange={(event) => {
                  const index = event.target.selectedIndex - 1;

                  if (index !== -1) {
                    const item = event.target.value;

                    setSelectedRole(item);
                  } else {
                    setSelectedRole("");
                  }
                }}
              />
            </Form.Row>

            <Form.ButtonContainer>
              <Button
                type="submit"
                minWidth={200}
                text="VALIDATE"
                fullWidth={false}
              />
            </Form.ButtonContainer>
          </Form.Form>
        }
      />
    </>
  );
}

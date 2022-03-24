import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";

import "./Login.css";
import GLOBALS from "../../globals";
import Actions from "../../redux/actions";

import Modal from "../../components/Modal";
import { Images } from "../../assets/Assets";
import Loader from "../../components/Loader";
import Button from "../../components/Button";

const loginYup = Yup.object().shape({
  email: Yup.string()
    .email(GLOBALS.I18n.t("emailInvalid"))
    .required(GLOBALS.I18n.t("required")),
  password: Yup.string()
    .min(1, GLOBALS.I18n.t("passwordInvalid"))
    .required(GLOBALS.I18n.t("required")),
});

const forgetYup = Yup.object().shape({
  email: Yup.string()
    .email(GLOBALS.I18n.t("emailInvalid"))
    .required(GLOBALS.I18n.t("required")),
});

const passwordYup = Yup.object().shape({
  email: Yup.string()
    .email(GLOBALS.I18n.t("emailInvalid"))
    .required(GLOBALS.I18n.t("required")),
  password: Yup.string()
    .min(1, GLOBALS.I18n.t("passwordInvalid"))
    .required(GLOBALS.I18n.t("required")),
  confirmPassword: Yup.string()
    .min(1, GLOBALS.I18n.t("passwordInvalid"))
    .required(GLOBALS.I18n.t("required")),
});

const completeProfileYup = Yup.object().shape({
  company: Yup.string().required(GLOBALS.I18n.t("required")),
  email: Yup.string()
    .email(GLOBALS.I18n.t("emailInvalid"))
    .required(GLOBALS.I18n.t("required")),
  phone: Yup.string().required(GLOBALS.I18n.t("required")),
  firstName: Yup.string().required(GLOBALS.I18n.t("required")),
  lastName: Yup.string().required(GLOBALS.I18n.t("required")),
  password: Yup.string()
    .min(1, GLOBALS.I18n.t("passwordInvalid"))
    .required(GLOBALS.I18n.t("required")),
  confirmPassword: Yup.string()
    .min(1, GLOBALS.I18n.t("passwordInvalid"))
    .required(GLOBALS.I18n.t("required")),
});

export default function Login(props) {
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);

  const [showForgetModal, setShowForgetModal] = useState(false);

  const onLogin = (values) => {
    dispatch(Actions.auth.do_login(values.email, values.password));
  };

  const onForget = async (values, { setSubmitting }) => {
    try {
      await GLOBALS.API({
        method: "GET",
        uri: `${GLOBALS.Constants.REQUEST_PASSWORD_RESET}?email=${values.email}`,
      });

      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(
            GLOBALS.I18n.t("emailSentSuccess"),
            "success",
          ),
        ),
      );
      setSubmitting(false);
      setShowForgetModal((st) => !st);
    } catch (err) {
      setSubmitting(false);
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  };

  // Reset Password
  const [user, setUser] = useState("");
  const [expired, setExpired] = useState(true);
  const [verifyToken, setVerifyToken] = useState("");
  const [showResetModal, setShowResetModal] = useState(false);
  const [validateLoading, setValidateLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Complete Profile
  const [admin, setAdmin] = useState("");

  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    validateToken();
    // eslint-disable-next-line
  }, []);

  async function validateToken() {
    try {
      const {
        location: { search },
      } = props;
      const query = new URLSearchParams(search);
      const request = query.get("request");
      const uid = query.get("uid");
      const verifyToken = query.get("verifyToken");

      setVerifyToken(verifyToken);

      if (request === "password") {
        setValidateLoading(true);
        setShowResetModal((st) => !st);
        await GLOBALS.API({
          uri: `${GLOBALS.Constants.VALIDATE_TOKEN}/${uid}/${verifyToken}`,
        });
        setExpired(false);
        fetchResetData();
      } else if (request === "profile") {
        setValidateLoading(true);
        setShowProfileModal((st) => !st);
        await GLOBALS.API({
          uri: `${GLOBALS.Constants.VALIDATE_TOKEN}/${uid}/${verifyToken}`,
        });
        setExpired(false);
        fetchProfileData();
      }
    } catch (err) {
      props.history.replace("/login");
      setValidateLoading(false);
      setExpired(true);
    }
  }

  async function fetchResetData() {
    try {
      const {
        location: { search },
      } = props;
      const query = new URLSearchParams(search);
      const uid = query.get("uid");

      const result = await GLOBALS.API({
        uri: `${GLOBALS.Constants.ADMIN_GET}/${uid}`,
      });

      setUser(result.data);
      setEmail(result.data.email);
      setExpired(false);
      setValidateLoading(false);
    } catch (err) {
      setValidateLoading(false);
      setExpired(true);
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  async function onResetPassword(values, { setSubmitting }) {
    try {
      const formdata = JSON.stringify({
        userId: user._id,
        verifyToken,
        password: values.password,
      });

      const data = await GLOBALS.API({
        method: "POST",
        uri: GLOBALS.Constants.RESET_PASSWORD,
        body: formdata,
      });
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(data.message, "success"),
        ),
      );
      props.history.replace("/login");
      setSubmitting(false);
      setShowResetModal((st) => !st);
    } catch (err) {
      setSubmitting(false);
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  async function fetchProfileData() {
    try {
      const {
        location: { search },
      } = props;
      const query = new URLSearchParams(search);
      const uid = query.get("uid");

      const result = await GLOBALS.API({
        uri: `${GLOBALS.Constants.USER_GET}/${uid}`,
      });
      setAdmin(result.data);
      setCompany(result.data.company.name);
      setEmail(result.data.email);
      setPhone(`0${result.data.phone}`);
      setFirstName(result.data.firstName);
      setLastName(result.data.lastName);
      setExpired(false);
      setValidateLoading(false);
    } catch (err) {
      setValidateLoading(false);
      setExpired(true);
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  async function onProfileSubmit(values, { setSubmitting }) {
    try {
      const formdata = JSON.stringify({
        phone: "+" + values.phone,
        firstName: values.firstName,
        lastName: values.lastName,
        password: values.password,
        adminId: admin._id,
        companyId: admin.company._id,
        verifyToken,
      });

      const data = await GLOBALS.API({
        method: "POST",
        uri: GLOBALS.Constants.ADMIN_REGISTRATION,
        body: formdata,
      });
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(data.message, "success"),
        ),
      );
      props.history.replace("/login");
      setSubmitting(false);
      setShowProfileModal((st) => !st);
    } catch (err) {
      setSubmitting(false);
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  return (
    <>
      <div className="login-container">
        <div className="left-login-container">
          <Link to="/">
            <img src={Images.logo} alt="OrgaPlan" className="hero-logo" />
          </Link>
        </div>
        <Formik
          initialValues={
            process.env.NODE_ENV === "development"
              ? {
                  email: "",
                  // email: "talha28.falcon@gmail.com",
                  // email: "superadmin@orgaplan.fr",
                  password: "",
                }
              : {
                  email: "",
                  password: "",
                }
          }
          validationSchema={loginYup}
          onSubmit={onLogin}
        >
          {({ values, errors, handleChange, handleBlur, handleSubmit }) => (
            <form onSubmit={handleSubmit} className="right-login-container">
              <h1>PAGE DE CONNEXION</h1>
              <div className="w-75">
                <input
                  required
                  type="email"
                  name="email"
                  onBlur={handleBlur}
                  value={values.email}
                  className="login-input my-2"
                  onChange={handleChange}
                  placeholder={GLOBALS.I18n.t("emailPlaceholder")}
                />
                <input
                  required
                  name="password"
                  type="password"
                  onBlur={handleBlur}
                  value={values.password}
                  onChange={handleChange}
                  error={errors.password}
                  className="login-input my-2"
                  placeholder={GLOBALS.I18n.t("passwordPlaceholder")}
                />
              </div>
              <div className="text-center mg-top-20">
                <Button
                  type="submit"
                  fullWidth={false}
                  loading={store.loading}
                  disabled={store.loading}
                  text={GLOBALS.I18n.t("login")}
                />
              </div>
              <span
                style={{ cursor: "pointer", color: "#8B8989", marginTop: 20 }}
                onClick={() => setShowForgetModal((st) => !st)}
              >
                Mot de passe oublié ?
              </span>
            </form>
          )}
        </Formik>
      </div>
      <Modal
        maxWidth="sm"
        title="MOT DE PASSE OUBLIÉ ?"
        open={showForgetModal}
        onClose={() => {
          setShowForgetModal(false);
        }}
        body={
          <Formik
            initialValues={{ email: "" }}
            validationSchema={forgetYup}
            onSubmit={onForget}
          >
            {({
              values,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
              <form onSubmit={handleSubmit}>
                <div className="w-100 m-auto">
                  <input
                    type="email"
                    name="email"
                    onBlur={handleBlur}
                    value={values.email}
                    onChange={handleChange}
                    className="login-input"
                    placeholder={GLOBALS.I18n.t("emailPlaceholder")}
                  />
                </div>
                <div className="text-center mg-top-20">
                  <Button
                    type="submit"
                    fullWidth={false}
                    disabled={isSubmitting || !values.email}
                    text={
                      isSubmitting ? (
                        <Loader.Progress />
                      ) : (
                        GLOBALS.I18n.t("submit")
                      )
                    }
                  />
                </div>
              </form>
            )}
          </Formik>
        }
      />
      <Modal
        maxWidth="sm"
        title="RESET PASSWORD"
        open={showResetModal}
        onClose={() => setShowResetModal(false)}
        body={
          validateLoading ? (
            <Loader.Progress />
          ) : expired ? (
            <p>Invalid or expired verification token</p>
          ) : (
            <Formik
              initialValues={{
                email: email,
                password: "",
                confirmPassword: "",
              }}
              validationSchema={passwordYup}
              onSubmit={onResetPassword}
            >
              {({
                values,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
              }) => (
                <form onSubmit={handleSubmit}>
                  <p style={{ textAlign: "center" }}>
                    Entrez les informations suivantes pour réinitialiser votre
                    mot de passe
                  </p>
                  <div className="w-100 mx-auto my-2">
                    <input
                      type="email"
                      name="email"
                      disabled={true}
                      onBlur={handleBlur}
                      value={values.email}
                      onChange={handleChange}
                      className="login-input"
                      placeholder={GLOBALS.I18n.t("emailPlaceholder")}
                    />
                  </div>
                  <div className="w-100 mx-auto my-3">
                    <input
                      required
                      name="password"
                      type="password"
                      onBlur={handleBlur}
                      value={values.password}
                      onChange={handleChange}
                      className="login-input"
                      placeholder={GLOBALS.I18n.t("passwordPlaceholder")}
                    />
                  </div>
                  <div className="w-100 mx-auto mt-2">
                    <input
                      required
                      type="password"
                      onBlur={handleBlur}
                      name="confirmPassword"
                      onChange={handleChange}
                      className="login-input"
                      value={values.confirmPassword}
                      placeholder={GLOBALS.I18n.t("confirmPasswordPlaceholder")}
                    />
                  </div>
                  <div className="text-center mg-top-20">
                    <Button
                      type="submit"
                      fullWidth={false}
                      loading={isSubmitting}
                      disabled={
                        isSubmitting ||
                        !values.password ||
                        values.password !== values.confirmPassword
                      }
                      text={GLOBALS.I18n.t("submit")}
                    />
                  </div>
                </form>
              )}
            </Formik>
          )
        }
      />
      <Modal
        title="REGISTRATION"
        open={showProfileModal}
        onClose={() => {
          setShowProfileModal(false);
        }}
        body={
          <>
            {!expired && <p>Complete your profile</p>}
            {validateLoading ? (
              <Loader.Progress />
            ) : expired ? (
              <p>Invalid or expired verification token</p>
            ) : (
              <Formik
                initialValues={{
                  company: company,
                  email: email,
                  phone: phone.substring(1),
                  firstName: firstName,
                  lastName: lastName,
                  password: "",
                  confirmPassword: "",
                }}
                validationSchema={completeProfileYup}
                onSubmit={onProfileSubmit}
              >
                {({
                  values,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  isSubmitting,
                }) => (
                  <form onSubmit={handleSubmit}>
                    <div className="w-100 mx-auto my-2">
                      <input
                        type="text"
                        name="company"
                        disabled={true}
                        onBlur={handleBlur}
                        value={values.company}
                        onChange={handleChange}
                        className="login-input"
                        placeholder={GLOBALS.I18n.t("companyPlaceholder")}
                      />
                    </div>
                    <div className="w-100 mx-auto my-2">
                      <input
                        type="email"
                        name="email"
                        disabled={true}
                        onBlur={handleBlur}
                        value={values.email}
                        onChange={handleChange}
                        className="login-input"
                        placeholder={GLOBALS.I18n.t("emailPlaceholder")}
                      />
                    </div>
                    <div className="w-100 mx-auto my-2">
                      <input
                        type="number"
                        name="phone"
                        onBlur={handleBlur}
                        value={values.phone}
                        onChange={handleChange}
                        className="login-input"
                        placeholder={GLOBALS.I18n.t("phonePlaceholder")}
                      />
                    </div>
                    <div className="w-100 mx-auto my-2">
                      <input
                        type="text"
                        name="firstName"
                        onBlur={handleBlur}
                        value={values.firstName}
                        onChange={handleChange}
                        className="login-input"
                        placeholder={GLOBALS.I18n.t("firstNamePlaceholder")}
                      />
                    </div>
                    <div className="w-100 mx-auto my-2">
                      <input
                        type="text"
                        name="lastName"
                        onBlur={handleBlur}
                        value={values.lastName}
                        onChange={handleChange}
                        className="login-input"
                        placeholder={GLOBALS.I18n.t("lastNamePlaceholder")}
                      />
                    </div>
                    <div className="w-100 mx-auto my-3">
                      <input
                        required
                        name="password"
                        type="password"
                        onBlur={handleBlur}
                        value={values.password}
                        onChange={handleChange}
                        className="login-input"
                        placeholder={GLOBALS.I18n.t("passwordPlaceholder")}
                      />
                    </div>
                    <div className="w-100 mx-auto mt-2">
                      <input
                        required
                        type="password"
                        onBlur={handleBlur}
                        name="confirmPassword"
                        onChange={handleChange}
                        className="login-input"
                        value={values.confirmPassword}
                        placeholder={GLOBALS.I18n.t(
                          "confirmPasswordPlaceholder",
                        )}
                      />
                    </div>
                    <div className="text-center mg-top-20">
                      <Button
                        type="submit"
                        fullWidth={false}
                        loading={isSubmitting}
                        disabled={isSubmitting}
                        text={GLOBALS.I18n.t("submit")}
                      />
                    </div>
                  </form>
                )}
              </Formik>
            )}
          </>
        }
      />
    </>
  );
}

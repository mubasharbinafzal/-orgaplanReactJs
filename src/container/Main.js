import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import Actions from "../redux/actions";
import Loader from "../components/Loader";

import User from "../pages/Admin";
import UnAuth from "../pages/UnAuth";
import SuperAdmin from "../pages/SuperAdmin";

export default function Main() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const store = useSelector((state) => state.auth);

  React.useEffect(() => {
    dispatch(Actions.auth.checkLogin()).then(() => {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    });
    // eslint-disable-next-line
  }, []);

  return (
    <>
      {store.loading && <Loader.AbsoluteLinear />}
      
      {loading ? (
        <Loader.CenterProgress />
      ) : store.auth ? (
        store.user.role === "SUPERADMIN" ? (
          <SuperAdmin />
        ) : (
          <User />
        )
      ) : (
        <UnAuth />
      )}
    </>
  );
}

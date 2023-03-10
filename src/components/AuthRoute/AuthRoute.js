import React from "react";
import { Route, Redirect } from "react-router-dom";
import isLogin from "../../utils/authorization/isLogin";

export default function AuthRoute({component: Component, ...rest }) {
    return (
      <Route
        {...rest}
        render={(props) =>
          isLogin() ? <Component {...props} /> : <Redirect to="/auth/login" />
        }
      />
    );
  }
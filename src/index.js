import React from "react";
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";

import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";
import OnboardingLayout from "layouts/Onboarding"
import setAuthorizationToken from "./utils/authorization/SetAuthorizationToken.js"
import AuthRoute from "./components/AuthRoute/AuthRoute"

setAuthorizationToken(localStorage.getItem("bearer"))
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Switch>
        <AuthRoute path="/admin" component={AdminLayout}/>
        <Route path="/auth" render={(props) => <AuthLayout {...props} />} />
        <Route path="/onboarding" render={(props) => <OnboardingLayout {...props} />} />
        <Redirect from="/" to="/onboarding/index" />
      </Switch>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

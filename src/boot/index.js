import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import * as ROUTES from "../constants/routes";
import SignUpPage from "../screens/SignUp";
import SignInPage from "../screens/SignIn";

const App = () => (
  <Router>
    <div>
      <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
      <Route path={ROUTES.SIGN_IN} component={SignInPage} />
    </div>
  </Router>
);

export default App;

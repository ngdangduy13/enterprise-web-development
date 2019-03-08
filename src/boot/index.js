import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import * as ROUTES from "../constants/routes";
import SignUpPage from "../screens/SignUp";


const App = () => (
  <Router>
    <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
  </Router>
);

export default App;

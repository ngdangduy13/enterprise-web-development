import * as React from "react";
import { connect } from 'react-redux'
import AdminLayout from "../components/AdminLayout";


class LoginPage extends React.Component {
  static getInitialProps({ store, isServer, pathname, query }) {
    const t = store.getState(); // component will be able to read from store's state when rendered
    console.log(t)
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <AdminLayout userEmail={this.props.userProfile.email} logOut={this.props.logoutFirebase}>

      </AdminLayout>
    );
  }
}

const mapState = state => ({
  userProfile: state.userProfile
})

const mapDispatch = ({ userProfile }) => ({
  logoutFirebase: () => userProfile.logoutFirebase(),
})

export default connect(state => state)(LoginPage);


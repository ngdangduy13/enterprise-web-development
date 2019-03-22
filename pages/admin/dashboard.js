import * as React from "react";
import AdminLayout from "../../components/AdminLayout";
import withRematch from "../../rematch/withRematch";
import initStore from "../../rematch/store";

class LoginPage extends React.Component {
  static getInitialProps({ store, isServer, pathname, query }) {}

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <AdminLayout
        userEmail={this.props.userProfile.email}
        logOut={this.props.logoutFirebase}
        role={this.props.userProfile.role}
        breadcrumb={["Admin", "Dashboard"]}
      >
        <div className="container" />
      </AdminLayout>
    );
  }
}

const mapState = state => ({
  userProfile: state.userProfile
});

const mapDispatch = ({ userProfile }) => ({
  logoutFirebase: () => userProfile.logoutFirebase()
});

export default withRematch(initStore, mapState, mapDispatch)(LoginPage);

import * as React from 'react';
import { Layout } from 'antd';
import Sidebar from './Sidebar';
import Header from './Header';
import './AdminLayout.css';
import Router from 'next/router';

class AdminLayout extends React.Component{
  logOut = () => {
    this.props.logOut();
    // Redirect
    Router.push('/login');
  }

  render() {
    return (
      <div className="admin-layout">
        <Layout>
          <Layout.Sider
            trigger={null}
            collapsible={true}
            breakpoint="lg"
            width={288}
            className="sider"
          >
            <Sidebar {...this.props} />
          </Layout.Sider>

          <Layout>
            <Layout.Header style={{ padding: 0 }}>
              <Header userEmail={this.props.userEmail} logOut={this.logOut} />
            </Layout.Header>

            <Layout.Content>
              {this.props.children}
            </Layout.Content>

          </Layout>
        </Layout>
      </div>
    );
  }
}

export default AdminLayout;


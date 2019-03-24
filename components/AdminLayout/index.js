import * as React from 'react';
import { Layout, Breadcrumb } from 'antd';
import Sidebar from './Sidebar';
import Header from './Header';
import './AdminLayout.css';
import Router from 'next/router';

class AdminLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false
    };
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  logOut = () => {
    this.props.logOut();
    // Redirect
  }

  render() {
    return (
      <div className="admin-layout">
        <Layout>
          <Layout.Sider
            collapsed={this.state.collapsed}
            trigger={null}
            collapsible={true}
            breakpoint="lg"
            width={288}
            className="sider"
            
          >
            <div className="logo" />

            <Sidebar {...this.props} />
          </Layout.Sider>

          <Layout>
            <Layout.Header style={{ padding: 0 }}>
              <Header userEmail={this.props.userEmail} logOut={this.logOut} collapsed={this.state.collapsed} toggle={this.toggle}/>
            </Layout.Header>

            <Layout.Content style={{ margin: '0 16px' }}>
              <Breadcrumb style={{ margin: '16px 0' }}>
                {this.props.breadcrumb.map(item => <Breadcrumb.Item key={item}>{item}</Breadcrumb.Item>)}
              </Breadcrumb>
              
              {this.props.children}
            </Layout.Content>
            <Layout.Footer style={{ textAlign: 'center' }}>
              Developed by G7 - Enterprise Web Software Development
            </Layout.Footer>
          </Layout>
        </Layout>
      </div>
    );
  }
}

export default AdminLayout;


import * as React from 'react';
import { Menu, Icon } from 'antd';
import Link from 'next/link';
import './Sidebar.css';
import sidebarItems from '../../../nextjs/constants/sidebar-items';

class Sidebar extends React.Component {
  renderSubmenu = (submenu) => {
    return (
      <Menu.SubMenu
        key={submenu.key}
        title={
          <span>
            <Icon type={submenu.icon} />
            <span>{submenu.title}</span>
          </span>
        }
        className="submenu"
      >
        {submenu.items.map(item => this.renderMenuItem(item))}
      </Menu.SubMenu>
    );
  };

  renderMenuItem = (menuitem) => {
    return (
      <Menu.Item key={`${menuitem.key}`} className="submenu-item">
        <Link href={menuitem.path}>
          <span>{menuitem.title}</span>
        </Link>
      </Menu.Item>
    );
  };

  render() {
    return (
      <div className="sidebar-menu">
        <Menu
          key="Menu"
          theme="dark"
          mode="inline"
          openKeys={sidebarItems.map((item) => item.key)}
          selectedKeys={[]}
          style={{ padding: '16px 0', width: '100%' }}
        >
          {sidebarItems.map(submenu => this.renderSubmenu(submenu))}
        </Menu>
      </div>
    );
  }
}

export default Sidebar;
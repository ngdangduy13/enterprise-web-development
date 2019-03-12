import * as React from 'react';
import { Menu, Icon, Dropdown, Avatar } from 'antd';
import './Header.css';
import Link from 'next/link';

const Header = (props) => {
  const menu = (
    <Menu className="user-menu" selectedKeys={[]}>
      <Menu.Item>
        <Link href=''>
          <a><Icon type="user" className="user-menu-item-icon" /> Profile</a>
        </Link>
      </Menu.Item>

      <Menu.Item>
        <Link href=''>
          <a><Icon type="setting" className="user-menu-item-icon" /> Settings</a>
        </Link>
      </Menu.Item>

      <Menu.Divider />

      <Menu.Item>
        <a onClick={props.logOut}>
          <Icon type="logout" className="user-menu-item-icon" /> Log Out
          </a>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="header">
      <div className="header-left">
        <Icon
          className="trigger"
          type={props.collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={props.toggle}
        />
      </div>

      <div className="header-right">
        <Dropdown overlay={menu}>
          <span className="avatar">
            <Avatar className="avatar-image" style={{ backgroundColor: '#87d068' }} icon="user" />
            <span className="avatar-name">{props.userEmail}</span>
          </span>
        </Dropdown>
      </div>
    </div>
  );
};


export default Header;
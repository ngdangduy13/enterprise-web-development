import * as React from "react";
import AdminLayout from "../../components/AdminLayout";
import {
  Row,
  Col,
  Input,
  Select,
  Button,
  Icon,
  Tooltip,
  Table,
  Modal,
  Form,
  Tag,
  Checkbox,
  message,
  DatePicker
} from "antd";
import "../../static/css/coord/view-student.css";
import withRematch from "../../rematch/withRematch";
import initStore from "../../rematch/store";
import Router from "next/router";
import firebase from "../../firebase";
import moment from "moment";

class UploadArticle extends React.Component {
  static async getInitialProps({ store, isServer, pathname, query }) {
    const querySnapshot = await firebase
      .firestore()
      .collection("users")
      .get();
    const users = [];
    querySnapshot.forEach(doc => {
      users.push({ ...doc.data(), id: doc.id });
    });
    store.dispatch.user.fetchUsersSuccessfully(users);

    const querySnapshotFaculty = await firebase
      .firestore()
      .collection("faculties")
      .get();
    const faculties = [];
    querySnapshotFaculty.forEach(doc => {
      faculties.push({ ...doc.data(), id: doc.id });
    });
    store.dispatch.faculty.fetchFacultiesSuccessfully(faculties);
  }

  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      currentUser: {},
      isUpdating: false
    };
  }

  toggleAddUser = (currentUser, isVisible, isUpdating) => {
    this.setState({
      isVisible,
      currentUser,
      isUpdating
    });
  };

  addUser = e => {
    e.preventDefault();
    this.props.form.validateFields(async (error, _values) => {
      if (!error) {
        const email = this.props.form.getFieldValue("email");
        const password = this.props.form.getFieldValue("password");
        const dob = moment(this.props.form.getFieldValue("dob")).format("LL");
        const address = this.props.form.getFieldValue("address");
        const fullname = this.props.form.getFieldValue("fullname");
        const role = this.props.form.getFieldValue("role");
        const facultyId = this.props.form.getFieldValue("facultyId");

        this.props.addUser(
          email,
          password,
          address,
          dob,
          fullname,
          role,
          facultyId
        );
        this.props.form.resetFields();
      }
    });
  };

  updateUser = e => {
    e.preventDefault();
    this.props.form.validateFields(async (error, _values) => {
      if (!error) {
        const dob = moment(this.props.form.getFieldValue("dob")).valueOf();
        const address = this.props.form.getFieldValue("address");
        const fullname = this.props.form.getFieldValue("fullname");
        const role = this.props.form.getFieldValue("role");
        const facultyId = this.props.form.getFieldValue("facultyId");
        this.props.updateUser(
          address,
          dob,
          fullname,
          role,
          facultyId,
          this.state.currentUser.id
        );
        this.props.form.resetFields();
      }
    });
  };

  hasErrors = fieldsError => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  };

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue("password")) {
      callback("Two passwords that you enter is inconsistent!");
    } else {
      callback();
    }
  };

  actionButtons = (text, record, index) => {
    return (
      <div className="action-buttons">
        <Tooltip title="Edit user info">
          <Button
            type="primary"
            icon="edit"
            className="button"
            onClick={() => this.toggleAddUser(record, true, true)}
            style={{ marginRight: "12px" }}
          />
        </Tooltip>

        <Tooltip title="Actice/Deactive user">
          <Button
            type="danger"
            icon={record.isActive ? "lock" : "unlock"}
            className="button"
            onClick={() => this.props.toggleActiveUser(record.id)}
            style={{ marginRight: "12px" }}
          />
        </Tooltip>
      </div>
    );
  };

  renderRole = (role, index) => {
    let color;
    let name;
    if (role === "ADMIN") {
      name = "Admin";
      color = "#FFA422";
    } else if (role === "COORD") {
      name = "Coordinator";
      color = "#2db7f5";
    } else if (role === "STUDENT") {
      name = "Student";
      color = "#87d068";
    }
    return (
      <span>
        <Tag color={color} key={index}>
          {name}
        </Tag>
      </span>
    );
  };

  renderDob = (text, record, index) => {
    return <span>{moment(record.dob).format("LL")}</span>;
  };

  render() {
    const { getFieldDecorator, getFieldsError } = this.props.form;
    const role = this.props.form.getFieldValue("role")
      ? this.props.form.getFieldValue("role")
      : this.state.currentUser.role;
    const roles = [
      {
        id: "ADMIN",
        name: "Admin"
      },
      {
        id: "COORD",
        name: "Coordinator"
      },
      {
        id: "STUDENT",
        name: "Student"
      }
    ];
    const columns = [
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
        sorter: true
      },
      {
        title: "Full name",
        dataIndex: "fullname",
        key: "fullname",
        width: "20%"
        // sorter: true,
      },
      {
        title: "Date of birth",
        dataIndex: "dob",
        key: "dob",
        render: this.renderDob
      },
      {
        title: "Address",
        dataIndex: "address",
        key: "address"
      },
      {
        title: "Role",
        dataIndex: "role",
        key: "role",
        width: "10%",
        render: this.renderRole

        // sorter: true,
      },
      {
        title: "Status",
        dataIndex: "isActive",
        key: "isActive",
        render: (isActive, index) => (
          <span>
            <Tag color={isActive ? "green" : "red"} key={index}>
              {isActive ? "Active" : "Deactive"}
            </Tag>
          </span>
        )
      },
      {
        title: "Actions",
        dataIndex: "isActive",
        key: "actions",
        width: "11%",
        render: this.actionButtons
      }
    ];
    return (
      <AdminLayout
        userEmail={this.props.userProfile.email}
        logOut={this.props.logoutFirebase}
        role={this.props.userProfile.role}
        breadcrumb={["Admin", "Users"]}
        selectedKey="/admin/view-user"
      >
        <div className="container">
          <Row>
            <Col span={24} className="button-flex">
              <div className="add">
                <Button
                  type="primary"
                  onClick={() => this.toggleAddUser({}, true, false)}
                >
                  <Icon type="plus" /> Add New Users
                </Button>
              </div>
              <div className="refresh">
                <Button
                  type="primary"
                  icon="sync"
                  onClick={this.props.fetchUsers}
                  loading={this.props.user.isBusy}
                >
                  Refresh
                </Button>
              </div>
            </Col>
          </Row>
          <div className="users-table">
            <Table
              size="middle"
              loading={this.props.user.isBusy}
              columns={columns}
              dataSource={this.props.user.all}
              rowKey={record => record.id}
            />
          </div>
          <Modal
            title="Add/Update User"
            visible={this.state.isVisible}
            confirmLoading={this.props.user.isBusy}
            okText="Save"
            cancelText="Cancel"
            onOk={this.state.isUpdating ? this.updateUser : this.addUser}
            onCancel={() => this.toggleAddUser({}, false, false)}
            okButtonProps={{
              disabled: this.hasErrors(getFieldsError())
            }}
          >
            <div className="input-user-info">
              <Form>
                {!this.state.isUpdating && (
                  <div>
                    <Form.Item label="Email" hasFeedback>
                      {getFieldDecorator("email", {
                        rules: [
                          {
                            required: true,
                            message: "Please fill the email before submitting"
                          },
                          {
                            type: "email",
                            message: "The input is not valid E-mail!"
                          }
                        ]
                      })(
                        <Input
                          name="email"
                          prefix={<Icon type="mail" />}
                          placeholder="Email"
                          // onChange={e => this.setState({ title: e.target.value })}
                          // disabled={this.props.currentUser._id ? true : false}
                        />
                      )}
                    </Form.Item>

                    <Form.Item label="Password" hasFeedback>
                      {getFieldDecorator("password", {
                        rules: [
                          {
                            required: true,
                            message:
                              "Please fill the password before submitting"
                          }
                        ]
                      })(
                        <Input
                          prefix={<Icon type="lock" />}
                          name="password"
                          type="password"
                          placeholder="Password"
                          // onChange={e => this.setState({ description: e.target.value })}
                        />
                      )}
                    </Form.Item>
                    <Form.Item label="Confirm Password" hasFeedback>
                      {getFieldDecorator("confirmPassword", {
                        rules: [
                          {
                            required: true,
                            message:
                              "Please fill the confirm password before submitting"
                          },
                          {
                            validator: this.compareToFirstPassword
                          }
                        ]
                      })(
                        <Input
                          prefix={<Icon type="lock" />}
                          name="confirmPassword"
                          type="password"
                          placeholder="Confirm Password"
                          // onChange={e => this.setState({ description: e.target.value })}
                        />
                      )}
                    </Form.Item>
                  </div>
                )}

                <Form.Item label="Role">
                  {getFieldDecorator("role", {
                    rules: [
                      {
                        required: true,
                        message: "Please choose role before submitting"
                      }
                    ],
                    validateTrigger: "onBlur",
                    validateFirst: true,
                    initialValue: this.state.currentUser.role
                  })(
                    <Select
                      prefix={<Icon type="lock" />}
                      placeholder="Role"
                      style={{ width: "100%" }}
                      // onSelect={value => {
                      //   if (value === "COORD" || value === "STUDENT") {
                      //     if (this.props.faculty.all.length === 0) {
                      //       this.props.fetchFaculties();
                      //     }
                      //   }
                      // }}
                    >
                      {roles.map(item => {
                        return (
                          <Select.Option value={item.id}>
                            {item.name}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  )}
                </Form.Item>
                {(role === "COORD" || role === "STUDENT") && (
                  <Form.Item label="Faculty">
                    {getFieldDecorator("facultyId", {
                      rules: [
                        {
                          required: true,
                          message: "Please choose faculty before submitting"
                        }
                      ],
                      validateTrigger: "onBlur",
                      validateFirst: true,
                      initialValue: this.state.currentUser.facultyId
                    })(
                      <Select
                        prefix={<Icon type="lock" />}
                        placeholder="Role"
                        style={{ width: "100%" }}
                        disabled={this.props.faculty.isBusy}
                      >
                        {this.props.faculty.all.map(item => {
                          return (
                            <Select.Option value={item.id}>
                              {item.name}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    )}
                  </Form.Item>
                )}
                <Form.Item label="Full name" hasFeedback>
                  {getFieldDecorator("fullname", {
                    rules: [
                      {
                        required: true,
                        message: "Please fill the full name before submitting"
                      }
                    ],
                    initialValue: this.state.currentUser.fullname
                  })(
                    <Input
                      prefix={<Icon type="profile" />}
                      name="fullname"
                      placeholder="Full name"
                      // onChange={e => this.setState({ description: e.target.value })}
                    />
                  )}
                </Form.Item>
                <Form.Item label="Date of birth" hasFeedback>
                  {getFieldDecorator("dob", {
                    rules: [
                      {
                        required: true,
                        message:
                          "Please fill the date of birth before submitting"
                      }
                    ],
                    initialValue: moment(this.state.currentUser.dob)
                  })(
                    <DatePicker
                      style={{ width: "100%" }}
                      //   prefix={<Icon type="lock" />}
                      //   name="dob"
                      //   placeholder="Date of birth"
                      // onChange={e => this.setState({ description: e.target.value })}
                    />
                  )}
                </Form.Item>
                <Form.Item label="Address" hasFeedback>
                  {getFieldDecorator("address", {
                    rules: [
                      {
                        required: true,
                        message: "Please fill the address before submitting"
                      }
                    ],
                    initialValue: this.state.currentUser.address
                  })(
                    <Input
                      prefix={<Icon type="shop" />}
                      name="address"
                      placeholder="Address"
                      // onChange={e => this.setState({ description: e.target.value })}
                    />
                  )}
                </Form.Item>
              </Form>
            </div>
          </Modal>
        </div>
      </AdminLayout>
    );
  }
}

const mapState = state => ({
  userProfile: state.userProfile,
  user: state.user,
  faculty: state.faculty
});

const mapDispatch = ({ userProfile, user, faculty }) => ({
  loginFirebase: (email, password) =>
    userProfile.loginFirebase({ email, password }),
  logoutFirebase: () => userProfile.logoutFirebase(),
  fetchUsers: () => user.fetchUsers(),
  fetchFaculties: () => faculty.fetchFaculties(),
  toggleActiveUser: id => user.toggleActiveUser({ id }),
  addUser: (email, password, address, dob, fullname, role, facultyId) =>
    user.addUser({ email, password, address, dob, fullname, role, facultyId }),
  updateUser: (address, dob, fullname, role, facultyId, id) =>
    user.updateUser({ address, dob, fullname, role, facultyId, id })
});

export default withRematch(initStore, mapState, mapDispatch)(
  Form.create()(UploadArticle)
);

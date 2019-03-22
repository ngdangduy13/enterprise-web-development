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
      .collection("faculties")
      .get();
    const faculties = [];
    querySnapshot.forEach(doc => {
      faculties.push({ ...doc.data(), id: doc.id });
    });
    store.dispatch.faculty.fetchFacultiesSuccessfully(faculties);
  }

  constructor(props) {
    super(props);
    this.state = {
      isVisible: false
    };
  }

  toggleAddUser = () => {
    this.setState({
      isVisible: !this.state.isVisible
    });
  };

  addUser = e => {
    e.preventDefault();
    this.props.form.validateFields(async (error, _values) => {
      if (!error) {
        const name = this.props.form.getFieldValue("name");
        const address = this.props.form.getFieldValue("address");
        this.props.addFaculty(name, address);
        this.props.form.resetFields();
      }
    });
  };

  hasErrors = fieldsError => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  };

  actionButtons = (text, record) => {
    return (
      <div className="action-buttons">
        <Tooltip title="Edit user info">
          <Button
            type="primary"
            icon="edit"
            className="button"
            // onClick={(_event) => this.props.openAddUserModal({currentUser: record})}
            style={{ marginRight: "12px" }}
          />
        </Tooltip>
      </div>
    );
  };

  render() {
    const { getFieldDecorator, getFieldsError } = this.props.form;
    const columns = [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        sorter: true
      },
      {
        title: "Address",
        dataIndex: "address",
        key: "address"
        // width: "20%"
        // sorter: true,
      },
      {
        title: "Created at",
        dataIndex: "createdDate",
        key: "createdDate"
        // width: "10%"
        // sorter: true,
      },
      {
        title: "Actions",
        dataIndex: "isActive",
        key: "actions",
        render: this.actionButtons,
        width: "11%",

      }
    ];
    return (
      <AdminLayout
        userEmail={this.props.userProfile.email}
        logOut={this.props.logoutFirebase}
        role={this.props.userProfile.role}
        breadcrumb={["Admin", "Faculty", "View"]}
      >
        <div className="container">
          <Row>
            <Col span={24} className="button-flex">
              <div className="add">
                <Button type="primary" onClick={this.toggleAddUser}>
                  <Icon type="plus" /> Add New Faculty
                </Button>
              </div>
              <div className="refresh">
                <Button
                  type="primary"
                  icon="sync"
                  onClick={this.props.fetchFaculties}
                  loading={this.props.faculty.isBusy}
                >
                  Refresh
                </Button>
              </div>
            </Col>
          </Row>
          <div className="users-table">
            <Table
              size="middle"
              loading={this.props.faculty.isBusy}
              columns={columns}
              dataSource={this.props.faculty.all}
              rowKey={record => record.id}
            />
          </div>
          <Modal
            title="Add Faculty"
            visible={this.state.isVisible}
            confirmLoading={this.props.faculty.isBusy}
            okText="Save"
            cancelText="Cancel"
            onOk={this.addUser}
            onCancel={this.toggleAddUser}
            okButtonProps={{
              disabled: this.hasErrors(getFieldsError())
            }}
          >
            <div className="input-user-info">
              <Form>
                <Form.Item label="Name" hasFeedback>
                  {getFieldDecorator("name", {
                    rules: [
                      {
                        required: true,
                        message: "Please fill the name before submitting"
                      }
                    ]
                  })(
                    <Input
                      name="name"
                      prefix={<Icon type="mail" />}
                      placeholder="Name"
                      // onChange={e => this.setState({ title: e.target.value })}
                      // disabled={this.props.currentUser._id ? true : false}
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
                    ]
                  })(
                    <Input
                      prefix={<Icon type="lock" />}
                      name="address"
                      type="address"
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

const mapDispatch = ({ userProfile, faculty }) => ({
  loginFirebase: (email, password) =>
    userProfile.loginFirebase({ email, password }),
  logoutFirebase: () => userProfile.logoutFirebase(),
  fetchFaculties: () => faculty.fetchFaculties(),
  addFaculty: (name, address) => faculty.addFaculty({ name, address })
});

export default withRematch(initStore, mapState, mapDispatch)(
  Form.create()(UploadArticle)
);

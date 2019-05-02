import * as React from "react";
import AdminLayout from "../../components/AdminLayout";
import {
  Row,
  Col,
  Input,
  Upload,
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
      .where("facultyId", "==", store.getState().userProfile.facultyId)
      .where("role", "==", "STUDENT")
      .get();
    const students = [];
    querySnapshot.forEach(doc => {
      students.push({ ...doc.data(), id: doc.id });
    });
    store.dispatch.student.fetchStudentsSuccessfully(students);
  }

  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      isUpdating: false,
      currentStudent: {}
    };
  }

  toggleAddStudent = (currentStudent, isVisible, isUpdating) => {
    this.setState({
      isVisible,
      currentStudent,
      isUpdating
    });
  };

  addStudent = e => {
    e.preventDefault();
    this.props.form.validateFields(async (error, _values) => {
      if (!error) {
        const email = this.props.form.getFieldValue("email");
        const password = this.props.form.getFieldValue("password");
        const dob = moment(this.props.form.getFieldValue("dob")).valueOf();
        const address = this.props.form.getFieldValue("address");
        const fullname = this.props.form.getFieldValue("fullname");
        this.props.addStudent(email, password, address, dob, fullname);
        this.props.form.resetFields();
      }
    });
  };

  updateStudent = e => {
    e.preventDefault();
    this.props.form.validateFields(async (error, _values) => {
      if (!error) {
        const dob = moment(this.props.form.getFieldValue("dob")).valueOf();
        const address = this.props.form.getFieldValue("address");
        const fullname = this.props.form.getFieldValue("fullname");
        this.props.updateStudent(
          address,
          dob,
          fullname,
          this.state.currentStudent.id
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

  actionButtons = (text, record) => {
    return (
      <div className="action-buttons">
        <Tooltip title="Edit user info">
          <Button
            type="primary"
            icon="edit"
            className="button"
            onClick={() => this.toggleAddStudent(record, true, true)}
            style={{ marginRight: "12px" }}
          />
        </Tooltip>

        <Tooltip title="Actice/Deactive user">
          <Button
            type="danger"
            icon={record.isActive ? "lock" : "unlock"}
            className="button"
            onClick={() => this.props.toggleActiveStudent(record.id)}
            style={{ marginRight: "12px" }}
          />
        </Tooltip>
      </div>
    );
  };

  renderDob = (text, record, index) => {
    return <span>{moment(record.dob).format("LL")}</span>;
  };

  render() {
    console.log(this.state.currentStudent);
    const { getFieldDecorator, getFieldsError } = this.props.form;
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
        title: "Status",
        dataIndex: "isActive",
        key: "isActive",
        width: "12%",
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
        render: this.actionButtons
      }
    ];
    return (
      <AdminLayout
        userEmail={this.props.userProfile.email}
        logOut={this.props.logoutFirebase}
        role={this.props.userProfile.role}
        breadcrumb={["Coordinator", "Student"]}
        selectedKey="/coordinator/view-student"
      >
        <div className="container">
          <Row>
            <Col span={24} className="button-flex">
              <div className="add">
                <Button
                  type="primary"
                  onClick={() => this.toggleAddStudent({}, true, false)}
                >
                  <Icon type="plus" /> Add New Student
                </Button>
              </div>
              <div className="refresh">
                <Button
                  type="primary"
                  icon="sync"
                  onClick={this.props.fetchStudents}
                  loading={this.props.student.isBusy}
                >
                  Refresh
                </Button>
              </div>
            </Col>
          </Row>
          <div className="users-table">
            <Table
              size="middle"
              loading={this.props.student.isBusy}
              columns={columns}
              dataSource={this.props.student.all}
              rowKey={record => record.id}
            />
          </div>
          <Modal
            title="Add/Update Student"
            visible={this.state.isVisible}
            confirmLoading={this.props.student.isBusy}
            okText="Save"
            cancelText="Cancel"
            onOk={this.state.isUpdating ? this.updateStudent : this.addStudent}
            onCancel={() => this.toggleAddStudent({}, false, false)}
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
                        initialValue: this.state.currentStudent.email,
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
                <Form.Item label="Full name" hasFeedback>
                  {getFieldDecorator("fullname", {
                    initialValue: this.state.currentStudent.fullname,
                    rules: [
                      {
                        required: true,
                        message: "Please fill the full name before submitting"
                      }
                    ]
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
                    initialValue: moment(this.state.currentStudent.dob),
                    rules: [
                      {
                        required: true,
                        message:
                          "Please fill the date of birth before submitting"
                      }
                    ]
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
                    initialValue: this.state.currentStudent.address,
                    rules: [
                      {
                        required: true,
                        message: "Please fill the address before submitting"
                      }
                    ]
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
  student: state.student
});

const mapDispatch = ({ userProfile, student }) => ({
  loginFirebase: (email, password) =>
    userProfile.loginFirebase({ email, password }),
  logoutFirebase: () => userProfile.logoutFirebase(),
  fetchStudents: () => student.fetchStudents(),
  toggleActiveStudent: id => student.toggleActiveStudent({ id }),
  addStudent: (email, password, address, dob, fullname) =>
    student.addStudent({ email, password, address, dob, fullname }),
  updateStudent: (address, dob, fullname, id) =>
    student.updateStudent({ address, dob, fullname, id })
});

export default withRematch(initStore, mapState, mapDispatch)(
  Form.create()(UploadArticle)
);

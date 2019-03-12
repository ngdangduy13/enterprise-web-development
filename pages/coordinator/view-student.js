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
import "../../static/css/view-article.css";
import withRematch from "../../rematch/withRematch";
import initStore from "../../rematch/store";
import Router from "next/router";
import firebase from "../../firebase";

class UploadArticle extends React.Component {
  static async getInitialProps({ store, isServer, pathname, query }) {
    // if (query.articles === undefined) {
    //     const querySnapshot = await firebase.firestore().collection('articles').where("studentId", "==", req.query.profile.uid).get();
    //     const articles = []
    //     querySnapshot.forEach(doc => {
    //         articles.push({ ...doc.data(), id: doc.id })
    //     })
    //     store.dispatch.article.fetchArticleSuccessfully(articles)
    // } else {
    //     store.dispatch.article.fetchArticleSuccessfully(query.articles)
    // }
  }

  constructor(props) {
    super(props);
    this.state = {
      isVisible: false
    };
  }

  toggleAddStudent = () => {
    this.setState({
      isVisible: !this.state.isVisible
    });
  };

  addStudent = (e) => {
      
  }

  hasErrors = fieldsError => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  };

  render() {
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
        key: "dob"
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
            <Tag color={isActive ? "#87d068" : "#f50"} key={index}>
              {isActive ? "Active" : "Deactive"}
            </Tag>
          </span>
        )
      }
    ];
    return (
      <AdminLayout
        userEmail={this.props.userProfile.email}
        logOut={this.props.logoutFirebase}
        role={this.props.userProfile.role}
      >
        <div className="container">
          <Row>
            <Col span={24} className="button-flex">
              <div className="add">
                <Button type="primary" onClick={this.toggleAddStudent}>
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
              rowKey={record => record._id}
            />
          </div>
          <Modal
            title="Add Student"
            visible={this.state.isVisible}
            confirmLoading={this.props.student.isBusy}
            okText="Save"
            cancelText="Cancel"
            // onOk={this.uploadArticle}
            onCancel={this.toggleAddStudent}
            okButtonProps={{
              disabled: this.hasErrors(getFieldsError())
            }}
          >
            <div className="input-user-info">
              <Form>
                <Form.Item label="Username" hasFeedback>
                  {getFieldDecorator("username", {
                    rules: [
                      {
                        required: true,
                        message: "Please fill the username before submitting"
                      }
                    ]
                  })(
                    <Input
                      name="username"
                      prefix={<Icon type="mail" />}
                      placeholder="Username"
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
                        message: "Please fill the password before submitting"
                      }
                    ]
                  })(
                    <Input
                      prefix={<Icon type="lock" />}
                      name="password"
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
                      }
                    ]
                  })(
                    <Input
                      prefix={<Icon type="lock" />}
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      // onChange={e => this.setState({ description: e.target.value })}
                    />
                  )}
                </Form.Item>
                <Form.Item label="Full name" hasFeedback>
                  {getFieldDecorator("fullname", {
                    rules: [
                      {
                        required: true,
                        message: "Please fill the full name before submitting"
                      }
                    ]
                  })(
                    <Input
                      prefix={<Icon type="lock" />}
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
  addStudent: (email, password, address, dob, fullname) => student.addStudent({email, password, address, dob, fullname}),
});

export default withRematch(initStore, mapState, mapDispatch)(
  Form.create()(UploadArticle)
);

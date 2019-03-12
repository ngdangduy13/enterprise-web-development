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
import moment from "moment";

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

  toggleAddEvent = () => {
    this.setState({
      isVisible: !this.state.isVisible
    });
  };

  addEvent = e => {
    e.preventDefault();
    this.props.form.validateFields(async (error, _values) => {
      if (!error) {
        const email = this.props.form.getFieldValue("email");
        const password = this.props.form.getFieldValue("password");
        const dob = moment(this.props.form.getFieldValue("dob")).format("LL");
        const address = this.props.form.getFieldValue("address");
        const fullname = this.props.form.getFieldValue("fullname");
        this.props.addStudent(email, password, address, dob, fullname);
        this.props.form.resetFields();
      }
    });
  };

  hasErrors = fieldsError => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  };

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  }

  render() {
    const { getFieldDecorator, getFieldsError } = this.props.form;
    const columns = [
      {
        title: "Event Name",
        dataIndex: "name",
        key: "name",
        sorter: true
      },
      {
        title: "Description",
        dataIndex: "description",
        key: "description",
        width: "20%"
        // sorter: true,
      },
      {
        title: "Closure Date",
        dataIndex: "closureDate",
        key: "closureDate"
      },
      {
        title: "Final Closure Date",
        dataIndex: "finalClosureDate",
        key: "finalClosureDate"
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
                <Button type="primary" onClick={this.toggleAddEvent}>
                  <Icon type="plus" /> Add New Event
                </Button>
              </div>
              <div className="refresh">
                <Button
                  type="primary"
                  icon="sync"
                  onClick={this.props.fetchEvents}
                  loading={this.props.event.isBusy}
                >
                  Refresh
                </Button>
              </div>
            </Col>
          </Row>
          <div className="users-table">
            <Table
              size="middle"
              loading={this.props.event.isBusy}
              columns={columns}
              dataSource={this.props.event.all}
              rowKey={record => record._id}
            />
          </div>
          <Modal
            title="Add Student"
            visible={this.state.isVisible}
            confirmLoading={this.props.event.isBusy}
            okText="Save"
            cancelText="Cancel"
            onOk={this.addEvent}
            onCancel={this.toggleAddEvent}
            okButtonProps={{
              disabled: this.hasErrors(getFieldsError())
            }}
          >
            <div className="input-user-info">
              <Form>
                <Form.Item label="Email" hasFeedback>
                  {getFieldDecorator("email", {
                    rules: [
                      {
                        required: true,
                        message: "Please fill the email before submitting"
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
                        message: "Please fill the password before submitting"
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
                      }, {
                        validator: this.compareToFirstPassword,
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
  event: state.event
});

const mapDispatch = ({ userProfile, event }) => ({
  logoutFirebase: () => userProfile.logoutFirebase(),
  fetchEvents: () => event.fetchEvents(),
});

export default withRematch(initStore, mapState, mapDispatch)(
  Form.create()(UploadArticle)
);

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
    if (query.events === undefined) {
      const querySnapshot = await firebase
        .firestore()
        .collection("events")
        .where("facultyId", "==", store.getState().userProfile.facultyId)
        .get();
      const events = [];
      querySnapshot.forEach(doc => {
        events.push({ ...doc.data(), id: doc.id });
      });
      store.dispatch.event.fetchEventsSuccessfully(events);
    } else {
      store.dispatch.event.fetchEventsSuccessfully(query.events);
    }
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
        const closureDate = moment(
          this.props.form.getFieldValue("closureDate")
        ).format("LL");
        const finalClosureDate = moment(
          this.props.form.getFieldValue("finalClosureDate")
        ).format("LL");
        const name = this.props.form.getFieldValue("name");
        const description = this.props.form.getFieldValue("description");
        this.props.addEvent(closureDate, finalClosureDate, name, description);
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

  renderStatus = (text, record, index) => {
    let status;
    let color;
    if (moment() < moment(record.closureDate)) {
      status = "Active";
      color = "green";
    } else if (
      moment() >= moment(record.closureDate) &&
      moment() < moment(record.finalClosureDate)
    ) {
      status = "Processing";
      color = "orange";
    } else if (moment() >= moment(record.finalClosureDate)) {
      status = "Finished";
      color = "red";
    }
    return (
      <span>
        <Tag color={color} key={index}>
          {status}
        </Tag>
      </span>
    );
  };

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
        render: this.renderStatus
      }
    ];
    return (
      <AdminLayout
        userEmail={this.props.userProfile.email}
        logOut={this.props.logoutFirebase}
        role={this.props.userProfile.role}
        breadcrumb={["Coordinator", "Event", "View"]}
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
            title="Add Event"
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
                <Form.Item label="Event name" hasFeedback>
                  {getFieldDecorator("name", {
                    rules: [
                      {
                        required: true,
                        message: "Please fill event name before submitting"
                      }
                    ]
                  })(
                    <Input
                      name="name"
                      prefix={<Icon type="mail" />}
                      placeholder="Name"
                    />
                  )}
                </Form.Item>

                <Form.Item label="Description" hasFeedback>
                  {getFieldDecorator("description", {})(
                    <Input
                      prefix={<Icon type="lock" />}
                      name="description"
                      placeholder="Description"
                    />
                  )}
                </Form.Item>

                <Form.Item label="Closure date" hasFeedback>
                  {getFieldDecorator("closureDate", {
                    rules: [
                      {
                        required: true,
                        message:
                          "Please fill the closure date before submitting"
                      }
                    ]
                  })(<DatePicker style={{ width: "100%" }} />)}
                </Form.Item>
                <Form.Item label="Final closure date" hasFeedback>
                  {getFieldDecorator("finalClosureDate", {
                    rules: [
                      {
                        required: true,
                        message:
                          "Please fill the final closure date before submitting"
                      }
                    ]
                  })(<DatePicker style={{ width: "100%" }} />)}
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
  addEvent: (closureDate, finalClosureDate, name, description) =>
    event.addEvent({ closureDate, finalClosureDate, name, description })
});

export default withRematch(initStore, mapState, mapDispatch)(
  Form.create()(UploadArticle)
);

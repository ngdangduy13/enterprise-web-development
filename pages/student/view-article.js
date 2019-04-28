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
  Select
} from "antd";
import "../../static/css/student/view-article.css";
import withRematch from "../../rematch/withRematch";
import initStore from "../../rematch/store";
import Router from "next/router";
import firebase from "../../firebase";
import moment from "moment";
import _ from "lodash";

class UploadArticle extends React.Component {
  static async getInitialProps({ store, isServer, pathname, query }) {
    const querySnapshotArticles = await firebase
      .firestore()
      .collection("articles")
      .where("studentId", "==", store.getState().userProfile.uid)
      .orderBy("timestamp", "desc")
      .get();
    const articles = [];
    querySnapshotArticles.forEach(doc => {
      articles.push({ ...doc.data(), id: doc.id });
    });
    store.dispatch.article.fetchArticleSuccessfully(articles);
  }

  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      isUpdating: false,
      fileList: [],
      currentArticle: {}
    };
  }

  toggleUploadArticle = (currentArticle, isUpdating, pathsForDownload) => {
    if (!this.state.isVisible && this.props.event.all.length === 0) {
      this.props.fetchEvents();
    }
    let fileList = [];
    if (pathsForDownload.length !== 0) {
      fileList = pathsForDownload.map(item => {
        return {
          uid: item.uid,
          name: item.name,
          status: "done",
          type: item.type,
          url: `/${item.path}`,
          thumbUrl: `/${item.path}`,
          path: item.path
        };
      });
    }
    this.setState({
      isVisible: !this.state.isVisible,
      currentArticle,
      isUpdating,
      fileList
    });
  };

  closeUploadArticle = () => {
    this.setState(
      {
        isVisible: false,
        currentArticle: {},
        isUpdating: false,
        fileList: []
      },
      this.props.fetchArticles
    );
  };

  uploadArticle = e => {
    e.preventDefault();
    this.props.form.validateFields(async (error, _values) => {
      if (!error) {
        const title = this.props.form.getFieldValue("title");
        const description = this.props.form.getFieldValue("description");
        const event = this.props.form.getFieldValue("event");
        const eventIndex = _.findIndex(this.props.event.all, o => {
          return o.id == event;
        });
        if (
          moment().valueOf() > this.props.event.all[eventIndex].closureDate
        ) {
          Modal.error({
            title: "Submmit Error",
            content: `This magazine was closed in ${
              this.props.event.all[eventIndex].closureDate
            }`
          });
        } else {
          this.props.uploadArticle(
            title,
            description,
            this.state.fileList,
            event
          );
          this.setState({
            fileList: []
          });
          this.props.form.resetFields();
        }
      }
    });
  };

  updateArticle = async e => {
    e.preventDefault();
    this.props.form.validateFields(async (error, _values) => {
      if (!error) {
        const title = this.props.form.getFieldValue("title");
        const description = this.props.form.getFieldValue("description");
        const event = this.props.form.getFieldValue("event");
        const eventIndex = _.findIndex(this.props.event.all, o => {
          return o.id == event;
        });

        if (
          moment().valueOf() >
          this.props.event.all[eventIndex].finalClosureDate
        ) {
          Modal.error({
            title: "Update Error",
            content: `This magazine was closed for updating in ${
              this.props.event.all[eventIndex].finalClosureDate
            }`
          });
        } else {
          await this.props.updateArticle(
            title,
            description,
            this.state.fileList,
            this.state.currentArticle.id
          );
          this.setState({
            fileList: []
          });
          this.props.form.resetFields();
          this.closeUploadArticle();
        }
      }
    });
  };
  hasErrors = fieldsError => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  };

  actionButtons = (text, record) => {
    return (
      <div className="action-buttons">
        <Tooltip title={"View article details"}>
          <Button
            type="primary"
            icon="info-circle"
            className="button"
            onClick={() =>
              Router.push(`/student/detail-article?articleId=${record.id}`)
            }
            style={{ marginRight: "12px" }}
          />
        </Tooltip>
        <Tooltip title={"Update article"}>
          <Button
            type="primary"
            icon="edit"
            className="button"
            onClick={() =>
              this.toggleUploadArticle(record, true, record.pathsForDownload)
            }
            style={{ marginRight: "12px" }}
          />
        </Tooltip>
      </div>
    );
  };

  renderStatus = (text, record, index) => {
    let color;
    if (record.status === "Unpublish") {
      color = "red";
    } else if (record.status === "Processing") {
      color = "orange";
    } else if (record.status === "Published") {
      color = "green";
    }
    return (
      <span>
        <Tag color={color} key={index}>
          {record.status}
        </Tag>
      </span>
    );
  };

  renderUploadedDate = (text, record, index) => {
    return (
      <span>
          {moment(record.timestamp).format("LL")}
      </span>
    );
  };

  render() {
    const { getFieldDecorator, getFieldsError } = this.props.form;
    const { fileList } = this.state;
    const eventAvailable = this.props.event.all;
    const propsUpload = {
      onRemove: file => {
        this.setState(state => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList
          };
        });
      },
      beforeUpload: file => {
        const isCorrectFileTypeDoc =
          file.type === "application/msword" ||
          file.type ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        const isCorrectFileTypeImage =
          file.type === "image/jpeg" ||
          file.type === "image/png" ||
          file.type === "image/jpg";

        if (isCorrectFileTypeDoc || isCorrectFileTypeImage) {
          if (isCorrectFileTypeDoc) {
            const newFileList = this.state.fileList.slice();
            const index = _.findIndex(newFileList, i => i.type === file.type);
            if (index !== -1) {
              message.error("Only 1 file document is accepted");

              // newFileList.splice(index, 1);
            } else {
              this.setState(state => ({
                fileList: [...newFileList, file]
              }));
            }
          } else {
            this.setState(state => ({
              fileList: [...state.fileList, file]
            }));
          }
        } else {
          message.error(
            "You can only upload file with .PNG, .JPEG, .JPG and Microsoft Word"
          );
        }

        return false;
      },
      fileList,
      accept: ".doc,.docx,.jpg,.png,.jpeg ",
      listType: "picture",
      className: "upload-list-inline",
      multiple: true
    };
    const columns = [
      {
        title: "Title",
        dataIndex: "title",
        key: "title",
        sorter: true
      },
      {
        title: "Uploaded Date",
        dataIndex: "timestamp",
        key: "timestamp",
        width: "20%",
        render: this.renderUploadedDate
        // sorter: true,
      },
      {
        title: "Description",
        dataIndex: "description",
        key: "description"
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        width: "12%",
        render: this.renderStatus
      },
      {
        title: "Actions",
        dataIndex: "actions",
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
        breadcrumb={["Student", "Article"]}
        selectedKey="/student/view-article"
      >
        <div className="container">
          <Row>
            <Col span={24} className="button-flex">
              <div className="add">
                <Button
                  type="primary"
                  onClick={() => this.toggleUploadArticle({}, false, [])}
                >
                  <Icon type="plus" /> Upload Article
                </Button>
              </div>
              <div className="refresh">
                <Button
                  type="primary"
                  onClick={this.props.fetchArticles}
                  loading={this.props.article.isBusy}
                  icon="sync"
                >
                  Refresh
                </Button>
              </div>
            </Col>
          </Row>
          <div className="users-table">
            <Table
              size="middle"
              loading={this.props.article.isBusy}
              columns={columns}
              dataSource={this.props.article.all}
              rowKey={record => record.id}
            />
          </div>
          <Modal
            title="Upload/Update Article"
            visible={this.state.isVisible}
            confirmLoading={this.props.article.isBusy}
            okText="Save"
            cancelText="Cancel"
            onOk={
              this.state.isUpdating ? this.updateArticle : this.uploadArticle
            }
            onCancel={this.closeUploadArticle}
            okButtonProps={{
              disabled: this.hasErrors(getFieldsError())
            }}
          >
            <div className="modal-loading" />
            <div className="input-user-info">
              <Form>
                <Form.Item label="Title" hasFeedback>
                  {getFieldDecorator("title", {
                    rules: [
                      {
                        required: true,
                        message: "Please fill the title before submitting"
                      }
                    ],
                    initialValue: this.state.currentArticle.title
                  })(
                    <Input
                      name="title"
                      prefix={<Icon type="mail" />}
                      placeholder="Title"
                      // onChange={e => this.setState({ title: e.target.value })}
                      // disabled={this.props.currentUser._id ? true : false}
                    />
                  )}
                </Form.Item>

                <Form.Item label="Description">
                  {getFieldDecorator("description", {
                    validateTrigger: "onBlur",
                    validateFirst: true,
                    initialValue: this.state.currentArticle.description
                  })(
                    <Input
                      prefix={<Icon type="lock" />}
                      name="description"
                      placeholder="Description"
                      // onChange={e => this.setState({ description: e.target.value })}
                    />
                  )}
                </Form.Item>
                <Form.Item label="Magazine">
                  {getFieldDecorator("event", {
                    rules: [
                      {
                        required: true,
                        message: "Please choose event before submitting"
                      }
                    ],
                    validateTrigger: "onBlur",
                    validateFirst: true,
                    initialValue: this.state.currentArticle.eventId
                  })(
                    <Select
                      showSearch
                      prefix={<Icon type="lock" />}
                      placeholder="Event"
                      disabled={
                        this.props.event.isBusy || this.state.isUpdating
                      }
                      style={{ width: "100%" }}
                    >
                      {eventAvailable.map(item => {
                        return (
                          <Select.Option value={item.id} key={item.id}>
                            {item.name}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  )}
                </Form.Item>

                <Form.Item label="Article">
                  <div className="dropbox">
                    {getFieldDecorator("dragger", {
                      rules: [
                        {
                          required: true,
                          message: "Please choose data before submitting"
                        }
                      ],
                      initialValue: this.state.fileList
                    })(
                      <Upload.Dragger {...propsUpload}>
                        <p className="ant-upload-drag-icon">
                          <Icon type="inbox" />
                        </p>
                        <p className="ant-upload-text">
                          Click or drag file to this area to choose file to
                          upload
                        </p>
                        <p className="ant-upload-hint">
                          Only support Word documents and images.
                        </p>
                      </Upload.Dragger>
                    )}
                  </div>
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator("agreement", {
                    valuePropName: "checked",
                    rules: [
                      {
                        required: true,
                        message:
                          "Please accept the terms of service before submitting"
                      }
                    ]
                  })(
                    <Checkbox>
                      I have read and agree the <a href=""> terms of service</a>
                    </Checkbox>
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
  article: state.article,
  event: state.event
});

const mapDispatch = ({ userProfile, article, event }) => ({
  loginFirebase: (email, password) =>
    userProfile.loginFirebase({ email, password }),
  logoutFirebase: () => userProfile.logoutFirebase(),
  fetchArticles: () => article.fetchArticles(),
  uploadArticle: (title, description, files, eventId) =>
    article.uploadArticle({ title, description, files, eventId }),
  updateArticle: (title, description, files, id) =>
    article.updateArticle({ title, description, files, id }),
  deleteArticle: id => article.deleteArticle({ id }),
  fetchEvents: () => event.fetchEvents()
});

export default withRematch(initStore, mapState, mapDispatch)(
  Form.create()(UploadArticle)
);

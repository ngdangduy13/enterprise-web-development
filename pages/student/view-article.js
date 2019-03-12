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
  message
} from "antd";
import "../../static/css/view-article.css";
import withRematch from "../../rematch/withRematch";
import initStore from "../../rematch/store";
import Router from "next/router";
import firebase from "../../firebase";

class UploadArticle extends React.Component {
  static async getInitialProps({ store, isServer, pathname, query }) {
    // if (query.articles === undefined) {
    //   const querySnapshot = await firebase
    //     .firestore()
    //     .collection("articles")
    //     .where("studentId", "==", query.profile.uid)
    //     .get();
    //   const articles = [];
    //   querySnapshot.forEach(doc => {
    //     articles.push({ ...doc.data(), id: doc.id });
    //   });
    //   store.dispatch.article.fetchArticleSuccessfully(articles);
    // } else {
    //   store.dispatch.article.fetchArticleSuccessfully(query.articles);
    // }
  }

  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      fileList: []
    };
  }

  // componentDidMount = () => {
  //     this.props.fetchArticles();
  // }

  toggleUploadArticle = () => {
    this.setState({
      isVisible: !this.state.isVisible
    });
  };

  uploadArticle = e => {
    e.preventDefault();
    this.props.form.validateFields(async (error, _values) => {
      if (!error) {
        const title = this.props.form.getFieldValue("title");
        const description = this.props.form.getFieldValue("description");
        this.props.uploadArticle(title, description, this.state.fileList);
        this.setState({
          fileList: []
        });
        this.props.form.resetFields();
      }
    });
  };
  hasErrors = fieldsError => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  };

  render() {
    const { getFieldDecorator, getFieldsError } = this.props.form;
    const { fileList } = this.state;
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
        const isCorrectFileType =
          file.type === "image/jpeg" ||
          file.type === "image/png" ||
          file.type === "image/jpg" ||
          file.type === "application/msword" ||
          file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        if (isCorrectFileType) {
          this.setState(state => ({
            fileList: [...state.fileList, file]
          }));
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
        width: "20%"
        // sorter: true,
      },
      {
        title: "Description",
        dataIndex: "description",
        key: "description"
      },
      {
        title: "Status",
        dataIndex: "isPublish",
        key: "isPublish",
        width: "12%",
        render: (isPublish, index) => (
          <span>
            <Tag color={isPublish ? "green" : "orange"} key={index}>
              {isPublish ? "Published" : "Unpublish"}
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
        breadcrumb={['Student', 'Article', 'View']}

      >
        <div className="container">
          <Row>
            <Col span={24} className="button-flex">
              <div className="add">
                <Button type="primary" onClick={this.toggleUploadArticle}>
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
              rowKey={record => record._id}
              onRow={(record, rowIndex) => {
                return {
                  onClick: event => {
                    Router.push(
                      `/student/detail-article?articleId=${record.id}`
                    );
                  } // click row
                };
              }}
            />
          </div>
          <Modal
            title="Upload Article"
            visible={this.state.isVisible}
            confirmLoading={this.props.article.isBusy}
            okText="Save"
            cancelText="Cancel"
            onOk={this.uploadArticle}
            onCancel={this.toggleUploadArticle}
            okButtonProps={{
              disabled: this.hasErrors(getFieldsError())
            }}
          >
            <div className="input-user-info">
              <Form>
                <Form.Item label="Title" hasFeedback>
                  {getFieldDecorator("title", {
                    rules: [
                      {
                        required: true,
                        message: "Please fill the title before submitting"
                      }
                    ]
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
                    validateFirst: true
                  })(
                    <Input
                      prefix={<Icon type="lock" />}
                      name="description"
                      placeholder="Description"
                    // onChange={e => this.setState({ description: e.target.value })}
                    />
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
                      ]
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
                          Only support Word documents.
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
  article: state.article
});

const mapDispatch = ({ userProfile, article }) => ({
  loginFirebase: (email, password) =>
    userProfile.loginFirebase({ email, password }),
  logoutFirebase: () => userProfile.logoutFirebase(),
  fetchArticles: () => article.fetchArticles(),
  uploadArticle: (title, description, files) =>
    article.uploadArticle({ title, description, files }),
  deleteArticle: id => article.deleteArticle({ id })
});

export default withRematch(initStore, mapState, mapDispatch)(
  Form.create()(UploadArticle)
);

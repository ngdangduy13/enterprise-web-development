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

class UploadArticle extends React.Component {
  static async getInitialProps({ store, isServer, pathname, query }) {
    const querySnapshotArticles = await firebase
      .firestore()
      .collection("articles")
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
      fileList: []
    };
  }

  toggleUploadArticle = () => {
    if (!this.state.isVisible) {
      this.props.fetchEvents();
    }
    this.setState({
      isVisible: !this.state.isVisible
    });
  };

  actionButtons = (text, record, index) => {
    return (
      <div className="action-buttons">
        <Tooltip title={"View details"}>
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
        <Tooltip title={"Download article"}>
          <Button
            type="primary"
            icon="download"
            className="button"
            onClick={() => {
              this.props.downloadArticle(record.id);
            }}
            style={{ marginRight: "12px" }}
          />
        </Tooltip>
      </div>
    );
  };

  render() {
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
      },
      {
        title: "Actions",
        dataIndex: "actions",
        key: "actions",
        render: this.actionButtons,
        width: "11%"
      }
    ];
    return (
      <AdminLayout
        userEmail={this.props.userProfile.email}
        logOut={this.props.logoutFirebase}
        role={this.props.userProfile.role}
        breadcrumb={["Admin", "Article"]}
      >
        <div className="container">
          <Row>
            <Col span={24} className="button-flex">
              <div className="refresh">
                <Button
                  type="primary"
                  onClick={this.props.fetchAllArticles}
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
  fetchAllArticles: () => article.fetchAllArticles(),
  downloadArticle: (id) => article.downloadArticle({id}),
  uploadArticle: (title, description, files, eventId) =>
    article.uploadArticle({ title, description, files, eventId }),
  deleteArticle: id => article.deleteArticle({ id }),
  fetchEvents: () => event.fetchEvents()
});

export default withRematch(initStore, mapState, mapDispatch)(
  Form.create()(UploadArticle)
);

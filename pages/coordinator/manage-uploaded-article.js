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
import withRematch from "../../rematch/withRematch";
import initStore from "../../rematch/store";
import Router from "next/router";
import firebase from "../../firebase";

class UploadArticle extends React.Component {
  static async getInitialProps({ store, isServer, pathname, query }) {
    if (query.articles) {
      store.dispatch.article.fetchUploadedArticleSuccessfully(query.articles);
    } else {
      const querySnapshotArticles = await firebase
        .firestore()
        .collection("articles")
        .where("facultyId", "==", store.getState().userProfile.facultyId)
        .get();
      const articles = [];
      querySnapshotArticles.forEach(doc => {
        articles.push({ ...doc.data(), id: doc.id });
      });
      store.dispatch.article.fetchUploadedArticleSuccessfully(articles);
    }
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  actionButtons = (text, record) => {
    return (
      <div className="action-buttons">
        <Tooltip title={"View details and make comment"}>
          <Button
            type="primary"
            icon="info-circle"
            className="button"
            onClick={() =>
              Router.push(`/coord/detail-uploaded-article?articleId=${record.id}`)
            }
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
        render: this.actionButtons
      }
    ];
    return (
      <AdminLayout
        userEmail={this.props.userProfile.email}
        logOut={this.props.logoutFirebase}
        role={this.props.userProfile.role}
        breadcrumb={["Coordinator", "Event", "Manage uploaded articles"]}
      >
        <div className="container">
          <Row>
            <Col span={24} className="button-flex">
              <div className="refresh">
                <Button
                  type="primary"
                  onClick={this.props.fetchUploadedArticles}
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
              dataSource={this.props.article.uploadedArticles}
              rowKey={record => record._id}
              //   onRow={(record, rowIndex) => {
              //     return {
              //       onClick: event => {
              //         Router.push(
              //           `/student/detail-article?articleId=${record.id}`
              //         );
              //       } // click row
              //     };
              //   }}
            />
          </div>
        </div>
      </AdminLayout>
    );
  }
}

const mapState = state => ({
  userProfile: state.userProfile,
  article: state.article
});

const mapDispatch = ({ userProfile, article, event }) => ({
  logoutFirebase: () => userProfile.logoutFirebase(),
  fetchUploadedArticles: () => article.fetchUploadedArticles()
});

export default withRematch(initStore, mapState, mapDispatch)(
  Form.create()(UploadArticle)
);

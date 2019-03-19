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
  message,
  Select
} from "antd";
import withRematch from "../../rematch/withRematch";
import initStore from "../../rematch/store";
import Router from "next/router";
import firebase from "../../firebase";

class UploadArticle extends React.Component {
  static async getInitialProps({ store, isServer, pathname, query }) {

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

    const querySnapshotEvents = await firebase
      .firestore()
      .collection("events")
      .where("facultyId", "==", store.getState().userProfile.facultyId)
      .get();
    const events = [];
    querySnapshotEvents.forEach(doc => {
      events.push({ ...doc.data(), id: doc.id });
    });
    store.dispatch.event.fetchEventsSuccessfully(events);
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
        <Tooltip title={"Publish the article"}>
          <Button
            type="primary"
            icon="global"
            className="button"
            onClick={() =>
              Modal.confirm({
                title: 'Do you want to publish this article?',
                content: 'Warning: This action cannot be taken back, please consider before submitting',
                onOk: () => {
                  this.props.publishArticle(record.id)
                }
              })
            }
            style={{ marginRight: "12px" }}
          />
        </Tooltip>
      </div>
    );
  };

  renderEvent = (text, record) => {
    const event = this.props.event.all.filter(i => i.id === record.eventId)
    return (
      <span>{event[0].name}</span>
    )
  }

  renderStatus = (text, record, index) => {
    let color;
    if (record.status === 'Unpublish') {
      color = 'red'
    } else if (record.status === 'Processing') {
      color = 'cyan'
    } else if (record.status === 'Published') {
      color = 'green'
    }
    return (
      <span>
        <Tag color={color} key={index}>
          {record.status}
        </Tag>
      </span>
    )
  }

  render() {
    console.log(this.props.article)
    const columns = [
      {
        title: "Title",
        dataIndex: "title",
        key: "title",
        sorter: true
      },
      {
        title: "Event",
        dataIndex: "event",
        key: "event",
        sorter: true,
        render: this.renderEvent
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
        dataIndex: "status",
        key: "tstus",
        width: "12%",
        render: this.renderStatus
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
  logoutFirebase: () => userProfile.logoutFirebase(),
  fetchUploadedArticles: () => article.fetchUploadedArticles(),
  publishArticle: (id) => article.publishArticle({id})
});

export default withRematch(initStore, mapState, mapDispatch)(
  Form.create()(UploadArticle)
);

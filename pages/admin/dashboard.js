import * as React from "react";
import AdminLayout from "../../components/AdminLayout";
import withRematch from "../../rematch/withRematch";
import initStore from "../../rematch/store";
import "../../static/css/admin/dashboard.css";
import firebase from "../../firebase";
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
  Statistic,
  Select
} from "antd";
import _ from "lodash";
// import { HorizontalBar } from "react-chartjs-2";

class LoginPage extends React.Component {
  static async getInitialProps({ store, isServer, pathname, query }) {
    const querySnapshot = await firebase
      .firestore()
      .collection("counter")
      .get();
    const counter = [];
    querySnapshot.forEach(doc => {
      counter.push({ ...doc.data(), id: doc.id });
    });

    store.dispatch.counter.fetchCounterSuccessfully(counter);

    const querySnapshotEvent = await firebase
      .firestore()
      .collection("events")
      .orderBy("timestamp", "desc")
      .get();
    const events = [];
    querySnapshotEvent.forEach(doc => {
      events.push({ ...doc.data(), id: doc.id });
    });
    store.dispatch.event.fetchEventsSuccessfully(events);

    const querySnapshotFaculty = await firebase
      .firestore()
      .collection("faculties")
      .get();
    const faculties = [];
    querySnapshotFaculty.forEach(doc => {
      faculties.push({ ...doc.data(), id: doc.id });
    });
    store.dispatch.faculty.fetchFacultiesSuccessfully(faculties);
  }

  constructor(props) {
    super(props);
    this.state = {
      selectedEventId:
        this.props.event.all.length === 0 ? -1 : this.props.event.all[0].id
    };
  }

  handleEventChange = value => {
    this.setState({ selectedEventId: value });
  };

  render() {
    const counter = this.props.counter.all;
    const eventCounterIndex = _.findIndex(
      this.props.counter.all,
      i => i.id === this.state.selectedEventId
    );
    const columns = [
      {
        title: "Faculty Name",
        dataIndex: "name",
        key: "name"
      },
      {
        title: "Percentage of contributions",
        dataIndex: "percentage",
        key: "percentage"
      },
      {
        title: "Contributions",
        dataIndex: "contributions",
        key: "contributions"
      },
      {
        title: "Contributors",
        dataIndex: "contributors",
        key: "contributors"
      }
    ];
    const data =
      this.state.selectedEventId !== undefined
        ? this.props.faculty.all.map(item => {
            const percentage =
              counter[eventCounterIndex].contributionsByFaculty[item.id] ===
              undefined
                ? 0
                : (counter[eventCounterIndex].contributionsByFaculty[item.id] /
                    counter[eventCounterIndex].contributions) *
                  100;
            const contributions =
              counter[eventCounterIndex].contributionsByFaculty[item.id] ===
              undefined
                ? 0
                : counter[eventCounterIndex].contributionsByFaculty[item.id];
            const contributors =
              counter[eventCounterIndex].contributorsByFaculty[item.id] ===
              undefined
                ? 0
                : counter[eventCounterIndex].contributorsByFaculty[item.id];
            return {
              name: item.name,
              percentage: percentage.toFixed(1).concat("%"),
              contributions: contributions.toString().concat(" articles"),
              contributors: contributors.toString().concat(" students")
            };
          })
        : null;
    return (
      <AdminLayout
        userEmail={this.props.userProfile.email}
        logOut={this.props.logoutFirebase}
        role={this.props.userProfile.role}
        breadcrumb={["Admin", "Dashboard"]}
        selectedKey="dashboard"
      >
        <div className="container">
          <Row>
            <Select
              showSearch
              prefix={<Icon type="lock" />}
              placeholder="Choose an magazine"
              disabled={this.props.event.isBusy}
              style={{ width: "100%" }}
              onChange={this.handleEventChange}
              value={this.state.selectedEventId}
            >
              {this.props.event.all.map(item => {
                return (
                  <Select.Option value={item.id} key={item.id}>
                    {item.name}
                  </Select.Option>
                );
              })}
            </Select>
          </Row>
          {this.state.selectedEventId !== undefined && (
            <div className="row">
              <Row>
                <Col xs={8} sm={8} lg={8}>
                  <Statistic
                    title="Contributions"
                    value={counter[eventCounterIndex].contributions}
                    // prefix={<Icon type="file" />}
                    suffix="articles"
                  />
                </Col>
                <Col xs={8} sm={8} lg={8}>
                  <Statistic
                    title="Contributors"
                    value={counter[eventCounterIndex].contributors}
                    suffix="students"
                  />
                </Col>
                <Col xs={8} sm={8} lg={8}>
                  <Statistic
                    title="Contributions without comments"
                    value={
                      counter[eventCounterIndex].contributionsWithoutComment
                    }
                    suffix="articles"
                  />
                </Col>
              </Row>
              <div className="table-container">
                <Table
                  size="small"
                  bordered
                  columns={columns}
                  dataSource={data}
                  rowKey={record => record.id}
                  pagination={false}
                />
              </div>
            </div>
          )}
        </div>
      </AdminLayout>
    );
  }
}

const mapState = state => ({
  userProfile: state.userProfile,
  counter: state.counter,
  event: state.event,
  faculty: state.faculty
});

const mapDispatch = ({ userProfile, article }) => ({
  logoutFirebase: () => userProfile.logoutFirebase(),
  getCountArticle: eventId => article.getCountArticle({ eventId })
});

export default withRematch(initStore, mapState, mapDispatch)(LoginPage);

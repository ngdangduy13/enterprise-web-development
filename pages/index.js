import * as React from "react";
import { connect } from "react-redux";
import "../static/css/home.css";
import { Row, Col, Button } from "antd";
import Link from "next/link";
import withRematch from "../rematch/withRematch";
import initStore from "../rematch/store";
import firebase from "../firebase";

class LandingPage extends React.Component {
  static async getInitialProps({ store, isServer, pathname, query }) {
    const querySnapshotArticles = await firebase
      .firestore()
      .collection("articles")
      .where("status", "==", "Published")
      .orderBy("timestamp", "desc")
      .get();
    const articles = [];
    querySnapshotArticles.forEach(doc => {
      articles.push({ ...doc.data(), id: doc.id });
    });
    store.dispatch.article.fetchPublishedArticleSuccessfully(articles);
  }

  convertPath = path => {
    return path.replace(/\//g, "%2F");
  };

  renderArticles = item => {
    return (
      <Row>
        <Col xs={1} sm={2} lg={3} />
        <Col xs={22} sm={20} lg={18}>
          <div className="card-container">
            <div className="card">
              <div>
                {item.paths.images.length !== 0 && (
                  <div className="img-container">
                    <img src={`../${item.paths.images[0]}`} />
                  </div>
                )}
                <h1 className="title">{item.title}</h1>
                <span className="timeStamp">{item.timestamp}</span>
                <p className="description">{item.description}</p>
                <Link href={`/magazine-post?articleId=${item.id}`}>
                  <div className="continue">Continue Reading &rarr;</div>
                </Link>
              </div>
            </div>
          </div>
        </Col>
        <Col xs={1} sm={2} lg={3} />
      </Row>
    );
  };

  render() {
    console.log(this.props.article);
    return (
      <div className="home-page">
        <div className="top-bar">
          <div className="top-bar-container">
            <Link href="/login">
              <Button type="primary" style={{ float: "right" }}>
                Login
              </Button>
            </Link>
          </div>
        </div>
        <Row>
          <Col xs={1} sm={2} lg={3} />
          <Col xs={22} sm={20} lg={18}>
            <div className="card-container">
              <div className="card">
                <div>
                  <div className="img-container">
                    <img src="/static/images/home.jpg" />
                  </div>
                  <h1 className="title">
                    Welcome to the magazine of FPT Greenwich!
                  </h1>
                  <span className="timestamp">July 16, 2019</span>
                  <p className="description">
                    Welcome to the new magazine, I hope you enjoy your stay!
                    This is an example of how you can control what except shows
                    up.
                  </p>
                </div>
              </div>
            </div>
          </Col>
          <Col xs={1} sm={2} lg={3} />
        </Row>
        {this.props.article.publishedArticles.map(this.renderArticles)}
      </div>
    );
  }
}

const mapState = state => ({
  article: state.article
});

const mapDispatch = ({ article }) => ({
  fetchPublishedArticles: () => article.fetchPublishedArticles()
});

export default withRematch(initStore, mapState, mapDispatch)(LandingPage);

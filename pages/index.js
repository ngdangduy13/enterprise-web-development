import * as React from "react";
import { connect } from "react-redux";
import "../static/css/home.css";
import { Row, Col } from "antd";
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
                    <img
                      src={`https://firebasestorage.googleapis.com/v0/b/testweb-3595a.appspot.com/o/${this.convertPath(
                        item.paths.images[0]
                      )}?alt=media`}
                    />
                  </div>
                )}
                <h1 className="title">{item.title}</h1>
                <span className="timeStamp">{item.timestamp}</span>
                <p className="description">{item.description}</p>
                <Link>
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
        <Row>
          <Col xs={1} sm={2} lg={3} />
          <Col xs={22} sm={20} lg={18}>
            <div className="card-container">
              <div className="card">
                <div>
                  <div className="img-container">
                    <img src="/static/images/home.jpg" />
                  </div>
                  <h1 className="title">Welcome to the Blog!</h1>
                  <span className="timestamp">July 16, 2019</span>
                  <p className="description">
                    Welcome to the new blog, I hope you enjoy your stay! This is
                    an example of how you can control what excerpt shows up.
                  </p>
                  <Link>
                    <div className="continue">Continue Reading &rarr;</div>
                  </Link>
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

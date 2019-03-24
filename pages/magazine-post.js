import * as React from "react";
import { connect } from "react-redux";
import "../static/css/magazine-post.css";
import { Row, Col } from "antd";
import Link from "next/link";
import withRematch from "../rematch/withRematch";
import initStore from "../rematch/store";
import firebase from "../firebase";
import dynamic from "next/dynamic";

const DynamicFileViewerWithNoSSR = dynamic(() => import("react-file-viewer"), {
  ssr: false
});

class LandingPage extends React.Component {
  static async getInitialProps({ store, isServer, pathname, query }) {
    const querySnapshotArticles = await firebase
      .firestore()
      .collection("articles")
      .doc(query.articleId)
      .get();
    store.dispatch.article.findArticleSuccessfully(
      querySnapshotArticles.data()
    );
  }

  render() {
    const selectedArticle = this.props.article.selectedArticle;
    return (
      <div className="magazine-page">
        <Row>
          <Col xs={1} sm={2} lg={3} />
          <Col xs={22} sm={20} lg={18}>
            <div className="card-header-container">
              <div className="header">
                <h1 className="h1-header">{selectedArticle.title}</h1>
                <p className="p-header">{selectedArticle.timestamp}</p>
                <span className="span-header" />
              </div>

              <DynamicFileViewerWithNoSSR
                fileType="docx"
                filePath={`../${selectedArticle.paths.documents[0]}`}
                onError={this.onError}
              />

              {selectedArticle.paths.images.map(item => (
                <Row>
                  <img
                    alt="example"
                    style={{ width: "100%" }}
                    src={`/${
                      this.props.article.selectedArticle.paths.images[0]
                    }`}
                  />
                </Row>
              ))}
            </div>
          </Col>
          <Col xs={1} sm={2} lg={3} />
        </Row>
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

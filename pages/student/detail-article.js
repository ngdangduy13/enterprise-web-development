import * as React from "react";
import AdminLayout from "../../components/AdminLayout";
import {
  Card,
  Col,
  Row,
  Collapse,
  Form,
} from "antd";
import "../../static/css/student/detail-article.css";
import withRematch from "../../rematch/withRematch";
import initStore from "../../rematch/store";
import dynamic from "next/dynamic";
import firebase from "../../firebase";

const DynamicFileViewerWithNoSSR = dynamic(() => import("react-file-viewer"), {
  ssr: false
});

class UploadArticle extends React.Component {
  static async getInitialProps({ store, isServer, pathname, query }) {
    const userRef = await firebase
      .firestore()
      .collection("articles")
      .doc(query.articleId)
      .get();
    const paths = {
      document: [],
      images: []
    };
    for (const path of userRef.data().paths) {
      if (path.split(".")[1] === "doc" || path.split(".")[1] === "docx") {
        paths.document.push(path);
      } else {
        paths.images.push(path);
      }
    }
    store.dispatch.article.findArticleSuccessfully({
      ...userRef.data(),
      paths
    });

  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  onError(e) {
    console.log(e, "error in file-viewer");
  }

  convertPath = path => {
    return path.replace("/", "%2F");
  };

  render() {
    return (
      <AdminLayout
        userEmail={this.props.userProfile.email}
        logOut={this.props.logoutFirebase}
        role={this.props.userProfile.role}
        breadcrumb={["Student", "Article", "View", "Detail"]}
      >
        <div className="container">
          <div className="card-container">
            <Card
              title={this.props.article.selectedArticle.title}
              bordered
              extra={`Uploaded Date: ${
                this.props.article.selectedArticle.timestamp
                }`}
            >
              <DynamicFileViewerWithNoSSR
                fileType="docx"
                filePath={`https://firebasestorage.googleapis.com/v0/b/testweb-3595a.appspot.com/o/${this.convertPath(
                  this.props.article.selectedArticle.paths.document[0]
                )}?alt=media`}
                onError={this.onError}
              />
              {this.props.article.selectedArticle.paths.images.length !== 0 &&
                <div className="image-container">
                  <Collapse accordion>
                    <Collapse.Panel header="Images" key="1">
                      <Row>
                        {this.props.article.selectedArticle.paths.images.map(item => (
                          <Col xs={24} sm={16} lg={8}>
                            <img
                              alt="example"
                              style={{ width: "100%" }}
                              src={`https://firebasestorage.googleapis.com/v0/b/testweb-3595a.appspot.com/o/${this.convertPath(
                                item
                              )}?alt=media`}
                            />
                          </Col>
                        ))}
                      </Row>
                    </Collapse.Panel>
                  </Collapse>
                </div>}
              {this.props.article.selectedArticle.comments !== undefined &&
                <div className="comment-container">
                  <Collapse accordion>
                    <Collapse.Panel header="Comments" key="2">
                      {this.props.article.selectedArticle.comments.map(item => (
                        <Row style={{ borderBottom: '1px solid #ddd', padding: '10px 10px' }}>
                          <Col xs={8} sm={6} lg={4}>
                            On <strong>{item.timestamp}</strong> :
                      </Col>
                          <Col xs={16} sm={18} lg={20} >
                            {/* {dangerouslySetInnerHTML item.html} */}
                            <div dangerouslySetInnerHTML={{ __html: item.html }}></div>
                          </Col>
                        </Row>
                      ))}
                    </Collapse.Panel>
                  </Collapse>
                </div>}
            </Card>
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

const mapDispatch = ({ userProfile, article }) => ({
  logoutFirebase: () => userProfile.logoutFirebase(),
  deleteArticle: id => article.deleteArticle({ id })
});

export default withRematch(initStore, mapState, mapDispatch)(
  Form.create()(UploadArticle)
);

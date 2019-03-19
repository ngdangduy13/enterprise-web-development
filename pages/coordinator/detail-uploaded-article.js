import * as React from "react";
import AdminLayout from "../../components/AdminLayout";
import {
  Card,
  Col,
  Row,
  Upload,
  Button,
  Collapse,
  Table,
  Modal,
  Form,
  Tag,
  Checkbox,
  message
} from "antd";
import "../../static/css/coord/detail-article.css";
import 'braft-editor/dist/index.css';

import withRematch from "../../rematch/withRematch";
import initStore from "../../rematch/store";
import dynamic from "next/dynamic";
import firebase from "../../firebase";
const DynamicFileViewerWithNoSSR = dynamic(() => import("react-file-viewer"), {
  ssr: false
});

const DynamicBraftEditorWithNoSSR = dynamic(() => import("braft-editor"), {
  ssr: false
});

class DetailUploadedArticle extends React.Component {
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
      paths,
      id: query.articleId
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      // editorState: DynamicBraftEditorWithNoSSR.EditorState.createEditorState()
    };
  }

  handleEditorChange = (editorState) => {
    this.setState({ editorState })
  }

  onError(e) {
    console.log(e, "error in file-viewer");
  }

  convertPath = path => {
    return path.replace("/", "%2F");
  };

  submitComment = () => {
    this.props.makeComment(this.state.editorState.toHTML())
  }

  render() {
    return (
      <AdminLayout
        userEmail={this.props.userProfile.email}
        logOut={this.props.logoutFirebase}
        role={this.props.userProfile.role}
        breadcrumb={[
          "Coordinator",
          "Event",
          "Manage uploaded articles",
          "Detail"
        ]}
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
              </div>
              {this.props.article.selectedArticle.comments !== undefined &&
                <div className="comment-container">
                  <Collapse accordion>
                    <Collapse.Panel header="Previous comments" key="2">
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
          <div className="editor">
            <Card
              title="Make comment"
              bordered
              size="small"
              extra={<Button type="primary" onClick={this.submitComment}>Save</Button>}
              style={{ width: '100%' }}
            >
              <DynamicBraftEditorWithNoSSR
                value={this.state.editorState}
                language="en"
                onChange={this.handleEditorChange}
                onSave={this.submitContent}
              />
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
  makeComment: (comment) => article.makeComment({ comment })
});

export default withRematch(initStore, mapState, mapDispatch)(
  Form.create()(DetailUploadedArticle)
);

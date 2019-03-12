import * as React from "react";
import AdminLayout from "../../components/AdminLayout";
import { Card, Col, Row, Upload, Button, Icon, Tooltip, Table, Modal, Form, Tag, Checkbox, message } from 'antd';
import '../../static/css/detail-article.css';
import withRematch from '../../rematch/withRematch'
import initStore from '../../rematch/store'
// import FileViewer from 'react-file-viewer';
import dynamic from 'next/dynamic'
import firebase from '../../firebase'

const DynamicFileViewerWithNoSSR = dynamic(() => import('react-file-viewer'), {
    ssr: false
})



class UploadArticle extends React.Component {
    static async getInitialProps({ store, isServer, pathname, query }) {
        if (query.selectedArticle === undefined) {
            const userRef = await firebase.firestore().collection('articles').doc(query.articleId).get();
            const paths = {
                document: [],
                images: []
            }
            for (const path of userRef.data().paths) {
                const downloadUrl = await firebase.storage().ref(path).getDownloadURL()
                if (path.split('.')[1] === 'doc' || path.split('.')[1] === 'docx') {
                    paths.document.push(downloadUrl)
                } else {
                    paths.images.push(downloadUrl)
                }
            }
            store.dispatch.article.findArticleSuccessfully({ ...userRef.data(), paths })
        } else {
            store.dispatch.article.findArticleSuccessfully(query.selectedArticle)
        }
    }

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    onError(e) {
        console.log(e, 'error in file-viewer');
    }

    render() {
        console.log(this.props.article)
        return (
            <AdminLayout userEmail={this.props.userProfile.email} logOut={this.props.logoutFirebase}>
                <div className="container">
                    <div className="card-container">
                        <Card title={this.props.article.selectedArticle.title} bordered extra={`Uploaded Date: ${this.props.article.selectedArticle.timestamp}`}>
                            <DynamicFileViewerWithNoSSR
                                fileType='docx'
                                filePath={this.props.article.selectedArticle.paths.document[0]}
                                onError={this.onError} />
                        </Card>
                    </div>

                    <div className="card-container">
                        <Card title="Images" bordered extra={`Uploaded Date: ${this.props.article.selectedArticle.timestamp}`} >
                            <Row>
                                {this.props.article.selectedArticle.paths.images.map(item =>
                                    <Col xs={24} sm={16} lg={8}>
                                        <img alt="example" style={{ width: '100%' }} src={item} />
                                    </Col>
                                )}
                            </Row>
                        </Card>
                    </div>

                </div>
            </AdminLayout >
        );
    }
}

const mapState = state => ({
    userProfile: state.userProfile,
    article: state.article,
})

const mapDispatch = ({ userProfile, article }) => ({
    logoutFirebase: () => userProfile.logoutFirebase(),
    deleteArticle: (id) => article.deleteArticle({ id }),
})


export default withRematch(initStore, mapState, mapDispatch)(Form.create()(UploadArticle));


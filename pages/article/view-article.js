import * as React from "react";
import AdminLayout from "../../components/AdminLayout";
import { Row, Col, Input, Upload, Button, Icon, Tooltip, Table, Modal, Form, Tree, Checkbox } from 'antd';
import '../../static/css/view-article.css';
import withRematch from '../../rematch/withRematch'
import initStore from '../../rematch/store'



class UploadArticle extends React.Component {
    static getInitialProps({ store, isServer, pathname, query }) {
        const t = store.getState(); // component will be able to read from store's state when rendered
        console.log(t)
    }

    constructor(props) {
        super(props);
        this.state = {
            isVisible: true,
            fileList: [],
            title: '',
            description: ''
        };
    }

    // componentDidMount = () => {
    //     this.props.fetchArticles();
    // }

    toggleUploadArticle = () => {
        this.setState({
            isVisible: !this.state.isVisible,
        })
    }

    uploadArticle = (e) => {
        e.preventDefault();
        this.props.form.validateFields(async (error, _values) => {
            if (!error) {
                this.props.uploadArticle(this.state.title, this.state.description, this.state.fileList[this.state.fileList.length - 1])
                this.setState({
                    fileList: [],
                    title: '',
                    description: ''
                })
                this.props.form.resetFields()
            }
        });

    }
    hasErrors = (fieldsError) => {
        return Object.keys(fieldsError).some(field => fieldsError[field]);
    }

    render() {
        const { getFieldDecorator, getFieldsError } = this.props.form;
        const { fileList } = this.state;
        const propsUpload = {
            onRemove: (file) => {
                this.setState((state) => {
                    const index = state.fileList.indexOf(file);
                    const newFileList = state.fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList,
                    };
                });
            },
            beforeUpload: (file) => {
                this.setState(state => ({
                    fileList: [...state.fileList, file],
                }));
                return false;
            },
            fileList,
            accept: ".doc,.docx"
        };
        const columns = [
            {
                title: 'Title',
                dataIndex: 'email',
                key: 'email',
                sorter: true,
            },
            {
                title: 'Description',
                dataIndex: 'fullName',
                key: 'fullName',
            },
            {
                title: 'Uploaded Date',
                dataIndex: 'date',
                key: 'date',
                sorter: true,
            },
        ];
        return (
            <AdminLayout userEmail={this.props.userProfile.email} logOut={this.props.logoutFirebase}>
                <div className="container">
                    <Row type="flex" gutter={24}>
                        <Col lg={12} md={24} xs={24}>
                            <div className="search">
                                <Input.Search
                                    className="search-input"
                                    style={{ width: '100%' }}
                                    placeholder='Search By Full Name/Email ...'
                                    defaultValue={this.props.search}

                                />
                            </div>
                        </Col>

                        <Col lg={12} md={24} xs={24}>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24} className='button-flex'>
                            <div className="add">
                                <Button type="primary" onClick={this.toggleUploadArticle}>
                                    <Icon type="plus" /> Upload Article
                                </Button>
                            </div>
                            <div className="refresh">
                                <Button type="primary">
                                    <Icon type="sync" /> Refresh
                                </Button>
                            </div>
                        </Col>
                    </Row>
                    <div className="users-table">
                        <Table
                            size="middle"
                            loading={this.props.isBusy}
                            columns={columns}
                            dataSource={this.props.data}
                            rowKey={record => record._id}
                        // onChange={(pagination, _filters, sorter) => {
                        //     this.props.fetchDataReducer({
                        //         search: this.props.search,
                        //         pageNumber: pagination.current,
                        //         pageSize: pagination.pageSize,
                        //         sortBy: sorter.field ? sorter.field : this.props.sortBy,
                        //         asc: sorter.order ? sorter.order === 'ascend' ? true : false : this.props.asc,
                        //     });
                        //     this.props.fetchDataEffect({
                        //         search: this.props.search,
                        //         pageNumber: pagination.current,
                        //         pageSize: pagination.pageSize,
                        //         sortBy: sorter.field ? sorter.field : this.props.sortBy,
                        //         asc: sorter.order ? sorter.order === 'ascend' ? true : false : this.props.asc,
                        //     });
                        // }}
                        // pagination={{
                        //     total: this.props.total,
                        //     current: this.props.pageNumber,
                        //     showSizeChanger: true,
                        //     pageSize: this.props.pageSize,
                        //     pageSizeOptions: [10, 20, 50].map((item) => String(item)),
                        // }}
                        />
                    </div>
                    <Modal
                        title='Upload Article'
                        visible={this.state.isVisible}
                        confirmLoading={this.props.article.isBusy}
                        okText='Save'
                        cancelText='Cancel'
                        onOk={this.uploadArticle}
                        onCancel={this.toggleUploadArticle}
                        okButtonProps={{
                            disabled: this.hasErrors(getFieldsError())
                        }}

                    >
                        <div className="input-user-info">
                            <Form>
                                <Form.Item label='Title'>
                                    {getFieldDecorator('title', {
                                        rules: [
                                            { required: true, message: 'Please fill the title' },
                                        ],
                                    })(
                                        <Input
                                            name="title"
                                            prefix={<Icon type="mail" />}
                                            placeholder='Title'
                                            onChange={e => this.setState({ title: e.target.value })}
                                        // disabled={this.props.currentUser._id ? true : false}
                                        />
                                    )}
                                </Form.Item>

                                <Form.Item label='Description'>
                                    {getFieldDecorator('description', {
                                        validateTrigger: 'onBlur',
                                        validateFirst: true,
                                    })(
                                        <Input
                                            prefix={<Icon type="lock" />}
                                            name="description"
                                            placeholder='Description'
                                            onChange={e => this.setState({ description: e.target.value })}

                                        />,
                                    )}
                                </Form.Item>
                                <Form.Item
                                    label="Dragger"
                                >
                                    <div className="dropbox">
                                        {getFieldDecorator('dragger', {
                                            rules: [
                                                { required: true, message: 'Please upload article' },
                                            ]
                                        })(
                                            <Upload.Dragger {...propsUpload}>
                                                <p className="ant-upload-drag-icon">
                                                    <Icon type="inbox" />
                                                </p>
                                                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                                <p className="ant-upload-hint">Only support Word documents.</p>
                                            </Upload.Dragger>
                                        )}
                                    </div>
                                </Form.Item>
                            </Form>
                        </div>
                    </Modal>
                </div>

            </AdminLayout >
        );
    }
}

const mapState = state => ({
    userProfile: state.userProfile,
    article: state.article,

})

const mapDispatch = ({ userProfile }) => ({
    loginFirebase: (email, password) => userProfile.loginFirebase({ email, password }),
    logoutFirebase: () => userProfile.logoutFirebase(),

})


export default withRematch(initStore, mapState, mapDispatch)(Form.create()(UploadArticle));


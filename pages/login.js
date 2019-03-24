import * as React from "react";
import { Row, Col, Form, Input, Icon, Checkbox, Button } from "antd";
import "../static/css/login.css";
import withRematch from "../rematch/withRematch";
import initStore from "../rematch/store";
import Head from "next/head";
import Link from "next/link";

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { email: "", password: "" };
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields(async (error, _values) => {
      if (!error) {
        this.props.loginFirebase(this.state.email, this.state.password);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="login-page">
        <Row>
          <Col xs={2} sm={4} lg={8} />
          <Col xs={20} sm={16} lg={8}>
            <div className="login-form">
              <Form onSubmit={this.handleSubmit}>
                <Form.Item>
                  <h2>Welcome to ....</h2>
                </Form.Item>

                <Form.Item>
                  {this.props.errorMessage && (
                    <div
                      style={{
                        height: "21px",
                        lineHeight: "21px",
                        color: "#f5222d",
                        textAlign: "center"
                      }}
                    >
                      {this.props.errorMessage}
                    </div>
                  )}
                </Form.Item>

                <Form.Item>
                  {getFieldDecorator("email", {
                    rules: [
                      { required: true, message: "Please Input Your Email" },
                      { type: "email", message: "Invalid Email Address" }
                    ],
                    validateTrigger: "onBlur",
                    validateFirst: true
                  })(
                    <Input
                      prefix={<Icon type="user" />}
                      type="email"
                      placeholder="Email Address"
                      onChange={e => this.setState({ email: e.target.value })}
                    />
                  )}
                </Form.Item>

                <Form.Item>
                  {getFieldDecorator("password", {
                    rules: [
                      { required: true, message: "Please Input Your Password" }
                    ],
                    validateTrigger: "onBlur",
                    validateFirst: true
                  })(
                    <Input
                      prefix={<Icon type="lock" />}
                      type="password"
                      placeholder="Password"
                      onChange={e =>
                        this.setState({ password: e.target.value })
                      }
                    />
                  )}
                </Form.Item>

                <Form.Item>
                  {getFieldDecorator("rememberMe", {
                    valuePropName: "checked"
                  })(
                    <Checkbox className="login-form-checkbox">
                      Remember Me
                    </Checkbox>
                  )}
                  <a className="login-form-forgot" href="">
                    Forgot password
                  </a>
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="login-form-button"
                    loading={this.props.userProfile.isBusy}
                  >
                    Log In
                  </Button>
                </Form.Item>
              </Form>
              <Link href={`/`}>
                <div className="back-homepage">Back to homepage</div>
              </Link>
            </div>
          </Col>
          <Col xs={2} sm={4} lg={8} />
        </Row>
      </div>
    );
  }
}

const mapState = state => ({
  userProfile: state.userProfile
});

const mapDispatch = ({ userProfile }) => ({
  loginFirebase: (email, password) =>
    userProfile.loginFirebase({ email, password })
});

export default withRematch(initStore, mapState, mapDispatch)(
  Form.create()(LoginPage)
);

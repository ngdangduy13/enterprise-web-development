import * as React from "react";
import { Row, Col, Form, Input, Icon, Checkbox, Button } from "antd";
import "./index.css";

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { email: "", password: "", confirmPassword: "" };
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((error, _values) => {
      if (!error) {
        this.props.login({
          email: this.props.email,
          password: this.props.password
        });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <div className="login-page">
        <Row>
          <Col xs={0} sm={4} lg={8} />
          <Col xs={24} sm={16} lg={8}>
            <div className="login-form">
              <Form onSubmit={this.handleSubmit}>
                <Form.Item>
                  <h2>Register</h2>
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
                  {getFieldDecorator("confirmPassword", {
                    rules: [
                      {
                        required: true,
                        message: "Please Input Your Confirm Password"
                      }
                    ],
                    validateTrigger: "onBlur",
                    validateFirst: true
                  })(
                    <Input
                      prefix={<Icon type="lock" />}
                      type="confirmPassword"
                      placeholder="Confirm Password"
                      onChange={e =>
                        this.setState({ confirmPassword: e.target.value })
                      }
                    />
                  )}
                </Form.Item>

                <Form.Item>
                  {getFieldDecorator("agreement", {
                    valuePropName: "checked"
                  })(
                    <Checkbox>
                      I have read the <a href="">agreement</a>
                    </Checkbox>
                  )}
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="login-form-button"
                    loading={this.props.isBusy}
                  >
                    Log In
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Col>
          <Col xs={0} sm={4} lg={8} />
        </Row>
      </div>
    );
  }
}

export default Form.create()(LoginPage);

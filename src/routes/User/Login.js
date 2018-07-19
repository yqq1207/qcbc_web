import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Alert, Row, Col, Input, Form } from 'antd';
import Login from 'components/Login';
import styles from './Login.less';
import { baseUrl } from '../../utils/base';

const FormItem = Form.Item;

const { Tab, UserName, Password, Submit } = Login;

@connect(({ register, loading }) => ({
  register,
  submitting: loading.effects['register/login'],
}))
@Form.create()
export default class LoginPage extends Component {
  state = {
    type: 'account',
    codeSrc: `${baseUrl}/user/validateCode`,
  };

  componentDidMount() {
    this.handleClick();
  }

  onTabChange = type => {
    this.setState({ type });
  };

  handleSubmit = (err, values) => {
    const { form, dispatch } = this.props;
    form.validateFields({ force: true }, (errs, val) => {
      if (!err && !errs) {
        const params = {
          ...values,
          ...val,
          type: 'userLogin',
        };
        dispatch({
          type: 'register/login',
          // type: 'login/login',
          payload: params,
        });
      }
    });
  };

  handleClick = () => {
    this.setState({
      codeSrc: `${baseUrl}/user/validateCode?t=${Math.random()}`,
    });
  };

  renderMessage = content => {
    return <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />;
  };

  render() {
    const { register, submitting, form } = this.props;
    const { type, codeSrc } = this.state;
    const { getFieldDecorator } = form;

    return (
      <div className={styles.main}>
        <Login defaultActiveKey={type} onTabChange={this.onTabChange} onSubmit={this.handleSubmit}>
          <Tab key="account" tab="账户密码登录">
            {register.status === 'error' &&
              register.type === 'account' &&
              !submitting &&
              this.renderMessage('账户或密码错误')}
            <UserName name="email" placeholder="请输入用户名" />
            <Password name="password" placeholder="请输入密码" />
            <Row gutter={8} style={{ marginBottom: 24 }}>
              <FormItem>
                <Col span={16}>
                  {getFieldDecorator('code', {
                    rules: [
                      {
                        required: true,
                        message: '请输入验证码  ！',
                      },
                    ],
                  })(<Input size="large" placeholder="图形验证码" onChange={this.saveCode} />)}
                </Col>
                <Col span={8}>
                  <div onClick={this.handleClick}>
                    <img
                      className={styles.codeimg}
                      style={{ width: '100%', height: 40 }}
                      src={codeSrc}
                      alt="点击刷新"
                    />
                  </div>
                </Col>
              </FormItem>
            </Row>
          </Tab>
          <div>
            <Link
              className={styles.register}
              to="/user/forget/page"
              style={{ width: '50%', display: 'inline-block', textAlign: 'left' }}
            >
              忘记密码
            </Link>
            <Link
              className={styles.register}
              to="/user/register/page"
              style={{ width: '50%', display: 'inline-block', textAlign: 'right' }}
            >
              注册账户
            </Link>
          </div>
          <Submit loading={submitting}>登录</Submit>
        </Login>
      </div>
    );
  }
}

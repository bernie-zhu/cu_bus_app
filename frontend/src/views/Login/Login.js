import React from 'react'
import 'antd/dist/antd.css';
import { Layout, Form, Checkbox, Input, Button, Row, Col } from 'antd';

import { login } from '../../api.js';

const { Header, Content, Footer } = Layout;
function Login(props) {
    const [form] = Form.useForm();

    const onReset = () => {
        form.resetFields();
    };

    const onFinish = (values) => {
        console.log('Success:', values);
        login(values.username, values.pwd).then(res => {
            console.log(res);
            if (res.success) {
                localStorage.setItem('username', values.username);
                window.location.href = '/favorites'
            } else {
                form.resetFields();
            }
        });
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Layout className="layout">
            <Header style={{ position: "sticky", top: "0", textAlign: 'center' }}>
                you are stupid for reading this
            </Header>
            <Content style={{ padding: '50px 50px', height: "calc(100vh - 65px)" }}>
                <Row>
                    <Col style={{ textAlign: 'center' }} span={24}>
                        <h1>Log In</h1>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Form
                            form={form}
                            name="basic"
                            labelCol={{
                                span: 7,
                            }}
                            wrapperCol={{
                                span: 10,
                            }}
                            initialValues={{
                                remember: true,
                            }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                        >
                            <Form.Item
                                label="Username"
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your username!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Password"
                                name="pwd"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your password!',
                                    },
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item
                                wrapperCol={{
                                    offset: 8,
                                    span: 10,
                                }}
                            >
                                <Button type="primary" htmlType="submit" style={{marginRight:350}}>
                                    Submit
                                </Button>
                                <Button type="primary" onClick={() => window.location.href = '/change_pwd'}>
                                    Forgot Password
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
}

export default Login
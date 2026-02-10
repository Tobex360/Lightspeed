import React from 'react';
import './register.css';
import userImg from '../../assets/user.avif';
import { Input, Button, Form, message, Card, Typography, Row, Col, Divider } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import AuthUservices from '../../services/authUservices';
import { UserOutlined, MailOutlined, PhoneOutlined, LockOutlined, HomeOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

function Uregister() {
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      const data = {
        firstname: values.firstname,
        lastname: values.lastname,
        username: values.username,
        email: values.email,
        phonenumber: values.phonenumber,
        password: values.password,
        address: {
          street: values.street,
          city: values.city,
          state: values.state
        }
      };

      await AuthUservices.registerUser(data);
      message.success("You are successfully registered");
      navigate('/ulogin');
    } catch (err) {
      console.log(err);
      message.error("Registration failed");
    }
  };

  return (
    <div className="login-wrapper">
      <Card className="auth-card register-card" variant={false}>
        <div className="auth-header">
          <div className="image-container">
            <img src={userImg} alt="User" className='auth-avatar' />
          </div>
          <Title level={3}>Create Account</Title>
          <Text type="secondary">Join Lightspeed for lightning-fast deliveries</Text>
        </div>

        <Form onFinish={handleSubmit} layout="vertical" size="large">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="firstname" rules={[{ required: true, message: 'Required' }]}>
                <Input placeholder="Firstname" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="lastname" rules={[{ required: true, message: 'Required' }]}>
                <Input placeholder="Lastname" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="username" rules={[{ required: true }]}>
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={14}>
              <Form.Item name="email" rules={[{ required: true, type: 'email' }]}>
                <Input prefix={<MailOutlined />} placeholder="Email" />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item name="phonenumber" rules={[{ required: true }]}>
                <Input prefix={<PhoneOutlined />} placeholder="Phone" />
              </Form.Item>
            </Col>
          </Row>

          <Divider titlePlacement="left" style={{ fontSize: '12px', color: '#999' }}>Address Details</Divider>

          <Form.Item name="street" rules={[{ required: true }]}>
            <Input prefix={<HomeOutlined />} placeholder="Street Address" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="city" rules={[{ required: true }]}>
                <Input placeholder="City" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="state" rules={[{ required: true }]}>
                <Input placeholder="State" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="password" rules={[{ required: true}]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Create Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block className="login-btn">
              Create My Account
            </Button>
          </Form.Item>

          <div className="auth-footer">
            <Text type="secondary">
              Already have an account? <Link to="/ulogin">Login</Link>
            </Text>
            <br />
            <Link to="/dregister" className="alt-login-link">Register as a Driver instead</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
}

export default Uregister;
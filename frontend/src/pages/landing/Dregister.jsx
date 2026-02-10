import React from 'react';
import './register.css';
import driverImg from '../../assets/driver.avif';
import { Input, Button, Form, message, Card, Typography, Row, Col, Divider } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import AuthDservices from '../../services/authDservices';
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  LockOutlined, 
  HomeOutlined, 
  CarOutlined 
} from '@ant-design/icons';

const { Title, Text } = Typography;

function Dregister() {
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      const data = {
        firstname: values.firstname,
        lastname: values.lastname,
        username: values.username,
        email: values.email,
        address: {
          street: values.street,
          city: values.city,
          state: values.state
        },
        phonenumber: values.phonenumber,
        password: values.password,
        vehicle: values.vehicle
      };

      const response = await AuthDservices.registerDriver(data);
      message.success("Driver account created successfully!");
      navigate('/dlogin');
    } catch (err) {
      console.error(err);
      message.error("Registration failed. Please try again.");
    }
  };

  return (
    <div className="login-wrapper">
      <Card className="auth-card register-card" variant={false}>
        <div className="auth-header">
          <div className="image-container">
            <img src={driverImg} alt="Driver" className='auth-avatar' />
          </div>
          <Title level={3}>Driver Application</Title>
          <Text type="secondary">Join the fleet and start earning today</Text>
        </div>

        <Form onFinish={handleSubmit} layout="vertical" size="large">
          <Row gutter={12}>
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

          <Row gutter={12}>
            <Col span={14}>
              <Form.Item name="email" rules={[{ required: true, type: 'email' }]}>
                <Input prefix={<MailOutlined />} placeholder="Email Address" />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item name="phonenumber" rules={[{ required: true }]}>
                <Input prefix={<PhoneOutlined />} placeholder="Phone" />
              </Form.Item>
            </Col>
          </Row>

          <Divider titlePlacement="left" style={{ color: '#999', fontSize: '12px' }}>Professional Details</Divider>

          <Form.Item name="vehicle" rules={[{ required: true, message: 'Please specify your vehicle model' }]}>
            <Input prefix={<CarOutlined />} placeholder="Vehicle Model (e.g. Toyota Camry 2022)" />
          </Form.Item>

          <Form.Item name="street" rules={[{ required: true }]}>
            <Input prefix={<HomeOutlined />} placeholder="Street Address" />
          </Form.Item>

          <Row gutter={12}>
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

          <Form.Item name="password" rules={[{ required: true }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Create Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block className="login-btn driver-theme-btn">
              Apply to Drive
            </Button>
          </Form.Item>

          <div className="auth-footer">
            <Text type="secondary">
              Already have a driver account? <Link to="/dlogin">Login</Link>
            </Text>
            <Divider plain><Text type="secondary" style={{fontSize: '11px'}}>NOT A DRIVER?</Text></Divider>
            <Link to="/uregister" className="alt-login-link">Register as a User</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
}

export default Dregister;
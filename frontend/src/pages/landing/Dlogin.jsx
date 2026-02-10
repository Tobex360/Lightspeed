import React, { useState } from 'react'
import './register.css'
import driverImg from '../../assets/driver.avif'
import { Input, Button, Form, message, Card, Typography, Divider } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import AuthDservices from '../../services/authDservices'
import { UserOutlined, LockOutlined } from '@ant-design/icons'

const { Title, Text } = Typography;

function Dlogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      let data = { username, password };
      const response = await AuthDservices.loginDriver(data);
      localStorage.setItem('driver', JSON.stringify(response.data));
      window.dispatchEvent(new Event('authChange'));
      message.success("Driver Logged In Successfully");
      navigate('/dhome');
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401 || err.response.status === 404) {
          message.error("User not found or incorrect password");
        } else {
          message.error(err.response.data?.message || "Login failed");
        }
      } else {
        message.error("Something went wrong. Please try again.");
      }
    }
  }

  return (
    <div className="login-wrapper">
      <Card className="auth-card" variant={false}>
        <div className="auth-header">
          <div className="image-container">
            <img src={driverImg} alt="Driver" className='auth-avatar' />
          </div>
          <Title level={3}>Driver Portal</Title>
          <Text type="secondary">Ready for your next delivery?</Text>
        </div>

        <Form onFinish={handleSubmit} layout="vertical" size="large">
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input
              prefix={<UserOutlined className="input-icon" />}
              placeholder='Username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined className="input-icon" />}
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block className="login-btn driver-theme-btn">
              Start Driving
            </Button>
          </Form.Item>

          <div className="auth-footer">
            <Link to='/ulogin' className="alt-login-link">Switch to User Login</Link>
            <Divider plain><Text type="secondary" style={{fontSize: '11px'}}>PARTNER WITH US</Text></Divider>
            <Text type="secondary">
              Don't have a driver account? <Link to='/dregister'>Apply Now</Link>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  )
}

export default Dlogin
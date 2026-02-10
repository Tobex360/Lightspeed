import React, { useState } from 'react'
import './register.css'
import userImg from '../../assets/user.avif'
import { Input, Button, Form, message, Card, Typography, Divider } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import AuthUservices from '../../services/authUservices'
import { UserOutlined, LockOutlined } from '@ant-design/icons'

const { Title, Text } = Typography;

function Ulogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  
  const handleSubmit = async (values) => {
    try {
      let data = { username, password };
      const response = await AuthUservices.loginUser(data);
      localStorage.setItem('user', JSON.stringify(response.data));
      window.dispatchEvent(new Event('authChange'));
      message.success("User logged in successfully");
      navigate('/uhome')
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
            <img src={userImg} alt="User" className='auth-avatar' />
          </div>
          <Title level={3}>Welcome Back</Title>
          <Text type="secondary">Login to manage your deliveries</Text>
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
            <Button type="primary" htmlType="submit" block className="login-btn">
              Login
            </Button>
          </Form.Item>

          <div className="auth-footer">
            <Link to='/dlogin' className="alt-login-link">Login as Driver?</Link>
            <Divider plain><Text type="secondary" style={{fontSize: '12px'}}>OR</Text></Divider>
            <Text type="secondary">
              Don't have an account? <Link to='/uregister'>Sign up</Link>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  )
}

export default Ulogin
import React, { useState } from 'react'
import './register.css'
import user from '../../assets/user.avif'
import { Input, Button, Form, message } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import AuthUservices from '../../services/authUservices'
import { UserOutlined, LockOutlined } from '@ant-design/icons'


function Ulogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  
  const handleSubmit = async(values)=>{
    console.log('login attempth:', values);

    try{
      let data ={
        username,
        password,
      }
      const response =await AuthUservices.loginUser(data);
      console.log(response.data);
      localStorage.setItem('user',JSON.stringify(response.data));
      // Dispatch auth change event for navbar update
      window.dispatchEvent(new Event('authChange'));
      message.success("user logged in successfully");
      navigate('/uhome')
    }catch(err){console.log(err)}
  }


  return (
    <><br /><br />
    <div className='container'>
      <div className='row login_container'>
        <div className='col-md-6 justify-content-center align-center'>
          <img src={user} alt="Register" className='card-image' />
          <h2>Login as a User</h2><br /><br />
          
          <Form onFinish={handleSubmit}>
            <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your Firstname!' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder='Username'
              value={username}
              onChange={(e)=>setUsername(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder='Password'
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Login
            </Button>
          </Form.Item>
          <Link to='/dlogin'>Login in as Driver?</Link><br />
          <Link to='/uregister'>Dont have an account?</Link>
          </Form>
        </div>
      </div>
    </div>

    </>
  )
}

export default Ulogin
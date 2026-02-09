import React, { useState } from 'react'
import './register.css'
import driver from '../../assets/driver.avif'
import { Input, Button, Form, message } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import AuthDservices from '../../services/authDservices'
import { UserOutlined, LockOutlined } from '@ant-design/icons'

function Dlogin() {


  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async(values)=>{
    console.log('login attempt:',values);
    try{
      let data ={
        username,
        password,
      }
      const response =await AuthDservices.loginDriver(data);
      console.log(response.data);
      localStorage.setItem('driver',JSON.stringify(response.data));
      // Dispatch auth change event for navbar update
      window.dispatchEvent(new Event('authChange'));
      message.success("Driver Logged In Successfully");
      navigate('/dhome');
    }catch(err){
      console.log(err)
    }
  }


  return (
    <><br /><br />
    <div className='container'>
      <div className='row login_container'>
        <div className='col-md-6 justify-content-center align-center'>
          <img src={driver} alt="Register" className='card-image' />
          <h2>Login as a Driver</h2><br /><br />
          
          <Form onFinish={handleSubmit}>
            <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input
              prefix ={<UserOutlined />}
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
              prefix ={<LockOutlined />}
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
          <Link to='/ulogin'>Login in as User?</Link><br />
          <Link to='/dregister'>Dont have an account?</Link>
          </Form>
        </div>
      </div>
    </div>

    </>
  )
}

export default Dlogin
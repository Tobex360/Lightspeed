import React from 'react'
import './register.css'
import driver from '../../assets/driver.avif'
import { Input, Button, Form, message } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import AuthDservices from '../../services/authDservices'
import { useState } from 'react'

function Dregister() {

  const navigate = useNavigate();

  const handleSubmit = async(values)=>{
    console.log('register attempt:', values);

    try{
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
      console.log(response.data);
      message.success("you are successfully Registered");
      navigate('/dlogin');
    }catch(err){
      console.log(err);
      message.error("registration failed");
    }
  };





  return (
    <><br /><br />
    <div className='container'>
      <div className='row login_container'>
        <div className='col-md-8 justify-content-center align-center'>
          <img src={driver} alt="Register" className='card-image' />
          <h2>Register as a Driver</h2><br /><br />
          
          <Form onFinish={handleSubmit}>
            <Form.Item
            name="firstname"
            rules={[{ required: true, message: 'Please input your Firstname!' }]}
          >
            <Input
              placeholder='Firstname' />
          </Form.Item>
            <Form.Item
            name="lastname"
            rules={[{ required: true, message: 'Please input your Lastname!' }]}
          >
            <Input
              placeholder='Lastname' />
          </Form.Item>
            <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input
              placeholder='Username' />
          </Form.Item>
            <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please input your Email!'}]}
          >
            <Input
              placeholder='Email' />
          </Form.Item>
            <Form.Item
            name="phonenumber"
            rules={[{ required: true, message: 'Please input your Phone Number!' }]}
          >
            <Input
              placeholder='Phone Number' />
          </Form.Item>
            <Form.Item
            name="street"
            rules={[{ required: true, message: 'Please input your Street!' }]}
          >
            <Input
              placeholder='Street' />
          </Form.Item>
            <Form.Item
            name="city"
            rules={[{ required: true, message: 'Please input your City!' }]}
          >
            <Input
              placeholder='City' />
          </Form.Item>
            <Form.Item
            name="state"
            rules={[{ required: true, message: 'Please input your State!' }]}
          >
            <Input
              placeholder='State' />
          </Form.Item>
            <Form.Item
            name="vehicle"
            rules={[{ required: true, message: 'Please input your Vehicle!' }]}
          >
            <Input
              placeholder='vehicle' />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              placeholder='Password' />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Register
            </Button>
          </Form.Item>
          <Link to='/uregister'>Register as a User?</Link><br />
          <Link to='/dlogin'>Already have an account</Link>
          </Form>
        </div>
      </div>
    </div>

    </>
  )
}

export default Dregister
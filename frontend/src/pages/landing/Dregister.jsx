import React from 'react'
import './register.css'
import driver from '../../assets/driver.avif'
import { Input, Button, Form, message } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import AuthDservices from '../../services/authDservices'
import { useState } from 'react'

function Dregister() {

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [vehicle, setVehicle] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async(values)=>{
    console.log('register attempt:', values);

    try{
      const data = {
        firstname,
        lastname,
        username,
        email,
        address,
        phonenumber,
        password,
        vehicle

      }
      const response = await AuthDservices.registerDriver(data);
      console.log(response.data);
      message.success("you are successfully Registered");
      navigate('/dlogin');
    }catch(err){
      console.log(err);
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
              placeholder='Firstname'
              value={firstname}
              onChange={(e)=> setFirstname(e.target.value)}
            />
          </Form.Item>
            <Form.Item
            name="lastname"
            rules={[{ required: true, message: 'Please input your Lastname!' }]}
          >
            <Input
              placeholder='Lastname'
              value={lastname}
              onChange={(e)=>setLastname(e.target.value)}
            />
          </Form.Item>
            <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input
              placeholder='Username'
              value={username}
              onChange={(e)=>setUsername(e.target.value)}
            />
          </Form.Item>
            <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please input your Email!' }]}
          >
            <Input
              placeholder='Email'
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />
          </Form.Item>
            <Form.Item
            name="phonenumber"
            rules={[{ required: true, message: 'Please input your Phone Number!' }]}
          >
            <Input
              placeholder='Phone Number'
              value={phonenumber}
              onChange={(e)=>setPhonenumber(e.target.value)}
            />
          </Form.Item>
            <Form.Item
            name="address"
            rules={[{ required: true, message: 'Please input your Address!' }]}
          >
            <Input
              placeholder='Address'
              value={address}
              onChange={(e)=>setAddress(e.target.value)}
            />
          </Form.Item>
            <Form.Item
            name="vehicle"
            rules={[{ required: true, message: 'Please input your Vehicle!' }]}
          >
            <Input
              placeholder='vehicle'
              value={vehicle}
              onChange={(e)=>setVehicle(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              placeholder='Password'
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />
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
import React from 'react';
import './register.css';
import user from '../../assets/user.avif';
import { Input, Button, Form, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import AuthUservices from '../../services/authUservices';

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
    <div className="container">
      <div className="row login_container">
        <div className="col-md-8">
          <img src={user} alt="Register" className="card-image" />
          <h2>Register as a User</h2>

          <Form onFinish={handleSubmit}>
            <Form.Item name="firstname" rules={[{ required: true }]}>
              <Input placeholder="Firstname" />
            </Form.Item>

            <Form.Item name="lastname" rules={[{ required: true }]}>
              <Input placeholder="Lastname" />
            </Form.Item>

            <Form.Item name="username" rules={[{ required: true }]}>
              <Input placeholder="Username" />
            </Form.Item>

            <Form.Item name="email" rules={[{ required: true }]}>
              <Input placeholder="Email" />
            </Form.Item>

            <Form.Item name="phonenumber" rules={[{ required: true }]}>
              <Input placeholder="Phone number" />
            </Form.Item>

            <Form.Item name="street" rules={[{ required: true }]}>
              <Input placeholder="Street" />
            </Form.Item>

            <Form.Item name="city" rules={[{ required: true }]}>
              <Input placeholder="City" />
            </Form.Item>

            <Form.Item name="state" rules={[{ required: true }]}>
              <Input placeholder="State" />
            </Form.Item>

            <Form.Item name="password" rules={[{ required: true }]}>
              <Input.Password placeholder="Password" />
            </Form.Item>

            <Button type="primary" htmlType="submit" block>
              Register
            </Button>

            <Link to="/dregister">Register as a Driver?</Link><br />
            <Link to="/ulogin">Already have an account</Link>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Uregister;

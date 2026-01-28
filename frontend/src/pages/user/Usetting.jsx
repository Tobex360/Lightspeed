import React, { useState, useEffect } from 'react'
import { Input, Button, Form, message, Spin } from 'antd'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Usetting() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user')
    if (!user) {
      message.warning('Please login first')
      navigate('/ulogin')
      return
    }
    
    const parsedUser = JSON.parse(user)
    setUserData(parsedUser)
    
    // Set form values
    form.setFieldsValue({
      firstname: parsedUser.firstname || '',
      lastname: parsedUser.lastname || '',
      username: parsedUser.username || '',
      email: parsedUser.email || '',
      address: parsedUser.address || '',
      phonenumber: parsedUser.phonenumber || '',
    })
  }, [form, navigate])

  const handleSubmit = async (values) => {
    if (!userData || !userData.userid) {
      message.error('User information not found')
      return
    }

    setLoading(true)
    try {
      const response = await axios.put(
        `http://localhost:7000/user/edit/${userData.userid}`,
        values
      )

      // Update localStorage
      const updatedUser = {
        ...userData,
        ...values
      }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setUserData(updatedUser)
      
      message.success('Profile updated successfully!')
    } catch (err) {
      console.error('Error:', err)
      message.error(
        err.response?.data?.message || 'Failed to update profile'
      )
    } finally {
      setLoading(false)
    }
  }

  if (!userData) {
    return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }} />
  }

  return (
    <>
      <section style={{ minHeight: '80vh', paddingTop: '40px', paddingBottom: '40px' }}>
        <div className='container'>
          <div className='row'>
            <div className='col-md-6 offset-md-3'>
              <h2>Edit Profile</h2>
              <div className='form' style={{ marginTop: '30px' }}>
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSubmit}
                  autoComplete="off"
                >
                  <Form.Item
                    label="First Name"
                    name="firstname"
                    rules={[{ required: true, message: 'Please enter your first name' }]}
                  >
                    <Input placeholder='First Name' />
                  </Form.Item>

                  <Form.Item
                    label="Last Name"
                    name="lastname"
                    rules={[{ required: true, message: 'Please enter your last name' }]}
                  >
                    <Input placeholder='Last Name' />
                  </Form.Item>

                  <Form.Item
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: 'Please enter your username' }]}
                  >
                    <Input placeholder='Username' />
                  </Form.Item>

                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: 'Please enter your email' },
                      { type: 'email', message: 'Please enter a valid email' }
                    ]}
                  >
                    <Input type="email" placeholder='Email' />
                  </Form.Item>

                  <Form.Item
                    label="Address"
                    name="address"
                    rules={[{ required: true, message: 'Please enter your address' }]}
                  >
                    <Input placeholder='Address' />
                  </Form.Item>

                  <Form.Item
                    label="Phone Number"
                    name="phonenumber"
                    rules={[{ required: true, message: 'Please enter your phone number' }]}
                  >
                    <Input placeholder='Phone Number' />
                  </Form.Item>

                  <Form.Item>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      block
                      loading={loading}
                      size="large"
                    >
                      Save Changes
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Usetting
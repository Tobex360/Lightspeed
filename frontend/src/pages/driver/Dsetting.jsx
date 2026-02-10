import React, { useState, useEffect } from 'react'
import { Input, Button, Form, message, Spin, Switch } from 'antd'
import { useNavigate } from 'react-router-dom'
import BackButton from '../../components/BackButton'
import axios from 'axios'

function Dsetting() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState(null)
  const [isAvailable, setIsAvailable] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('driver')
    if (!user) {
      message.warning('Please login first')
      navigate('/dlogin')
      return
    }
    
    const parsedUser = JSON.parse(user)
    setUserData(parsedUser)
    
    // Set availability state
    const available = parsedUser.isOpen || false
    setIsAvailable(available)
    
    // Set form values
    form.setFieldsValue({
      firstname: parsedUser.firstname || '',
      lastname: parsedUser.lastname || '',
      username: parsedUser.username || '',
      email: parsedUser.email || '',
      street: parsedUser.address?.street || '',
      city: parsedUser.address?.city || '',
      state: parsedUser.address?.state || '',
      phonenumber: parsedUser.phonenumber || '',
      vehicle: parsedUser.vehicle || '',
    })
  }, [form, navigate])

  const handleSubmit = async (values) => {
    if (!userData || !userData.userid) {
      message.error('User information not found')
      return
    }

    setLoading(true)
    try {
      const payload = {
        firstname: values.firstname,
        lastname: values.lastname,
        username: values.username,
        email: values.email,
        phonenumber: values.phonenumber,
        address: {
          street: values.street,
          city: values.city,
          state: values.state
        },
        vehicle: values.vehicle,
        isOpen: isAvailable // Use state value instead of form value
      }

      const response = await axios.put(
        `http://localhost:7000/driver/edit/${userData.userid}`,
        payload
      )

      // Update localStorage
      const updatedUser = {
        ...userData,
        ...payload,
        isOpen: isAvailable
      }
      localStorage.setItem('driver', JSON.stringify(updatedUser))
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

  const handleAvailabilityChange = (checked) => {
    setIsAvailable(checked)
    if (checked) {
      message.info('You are now available for orders')
    } else {
      message.info('You are now unavailable for orders')
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
              <h2><BackButton />Edit Profile</h2>
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
                    <Input placeholder='First Name' size="large" />
                  </Form.Item>

                  <Form.Item
                    label="Last Name"
                    name="lastname"
                    rules={[{ required: true, message: 'Please enter your last name' }]}
                  >
                    <Input placeholder='Last Name' size="large" />
                  </Form.Item>

                  <Form.Item
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: 'Please enter your username' }]}
                  >
                    <Input placeholder='Username' size="large" />
                  </Form.Item>

                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: 'Please enter your email' },
                      { type: 'email', message: 'Please enter a valid email' }
                    ]}
                  >
                    <Input type="email" placeholder='Email' size="large" />
                  </Form.Item>

                  <Form.Item
                    label="Street"
                    name="street"
                    rules={[{ required: true, message: 'Please enter your Street' }]}
                  >
                    <Input placeholder='Street' size="large" />
                  </Form.Item>

                  <Form.Item
                    label="City"
                    name="city"
                    rules={[{ required: true, message: 'Please enter your City' }]}
                  >
                    <Input placeholder='City' size="large" />
                  </Form.Item>

                  <Form.Item
                    label="State"
                    name="state"
                    rules={[{ required: true, message: 'Please enter your State' }]}
                  >
                    <Input placeholder='State' size="large" />
                  </Form.Item>

                  <Form.Item
                    label="Phone Number"
                    name="phonenumber"
                    rules={[{ required: true, message: 'Please enter your phone number' }]}
                  >
                    <Input placeholder='Phone Number' size="large" />
                  </Form.Item>

                  <Form.Item
                    label="Vehicle"
                    name="vehicle"
                    rules={[{ required: true, message: 'Please enter your vehicle' }]}
                  >
                    <Input placeholder='Vehicle' size="large" />
                  </Form.Item>

                  <Form.Item label="Availability">
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '12px',
                      padding: '12px',
                      backgroundColor: isAvailable ? '#f6ffed' : '#fff7e6',
                      border: `2px solid ${isAvailable ? '#52c41a' : '#faad14'}`,
                      borderRadius: '8px',
                      transition: 'all 0.3s ease'
                    }}>
                      <Switch 
                        checked={isAvailable}
                        onChange={handleAvailabilityChange}
                        checkedChildren="Available"
                        unCheckedChildren="Unavailable"
                        style={{ minWidth: '60px' }}
                      />
                      <span style={{ 
                        fontWeight: 500,
                        color: isAvailable ? '#52c41a' : '#faad14'
                      }}>
                        {isAvailable ? 'You are available for orders' : 'You are currently unavailable'}
                      </span>
                    </div>
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

export default Dsetting
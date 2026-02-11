import React, { useState, useEffect } from 'react'
import { Input, Button, Form, message, Select, Space } from 'antd'
import { EnvironmentOutlined } from '@ant-design/icons'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';

const { TextArea } = Input;
const { Option } = Select;

function Ucreate() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const [loadingDrivers, setLoadingDrivers] = useState(true);
  const [pickupLocation, setPickupLocation] = useState(null);
  const [deliveryLocation, setDeliveryLocation] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchAvailableDrivers();
  }, []);

  const fetchAvailableDrivers = async () => {
    try {
      setLoadingDrivers(true);
      const response = await axios.get(`http://localhost:7000/driver/available`);
      setDrivers(response.data.drivers || [])
    } catch (error) {
      setDrivers([]);
    } finally {
      setLoadingDrivers(false);
    }
  };

  const getCurrentLocation = (locationType) => {
    if (!navigator.geolocation) {
      message.error('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (locationType === 'pickup') {
          setPickupLocation({ lat: latitude, lng: longitude });
          form.setFieldsValue({ pickupLocation: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` });
          message.success('Pickup location captured');
        } else {
          setDeliveryLocation({ lat: latitude, lng: longitude });
          form.setFieldsValue({ deliveryLocation: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` });
          message.success('Delivery location captured');
        }
      },
      (error) => {
        message.error('Unable to get your location. Please check your browser permissions.');
      }
    );
  };

  const handleSubmit = async (values) => {
    if (!pickupLocation || !deliveryLocation) {
      message.error('Please capture both pickup and delivery locations');
      return;
    }

    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      const receiverResponse = await axios.get(`http://localhost:7000/user/username/${values.receiver}`);
      const receiverId = receiverResponse.data.user._id;

      const orderData = {
        sender: user.userid,
        receiver: receiverId,
        driver: values.driver || null,
        packageName: values.packagename,
        size: values.size,
        description: values.description,
        pickupLocation: { ...pickupLocation, address: values.pickupAddress || '' },
        deliveryLocation: { ...deliveryLocation, address: values.deliveryAddress || '' }
      };

      await axios.post(`http://localhost:7000/order/create`, orderData);

      message.success('Order created successfully!');
      form.resetFields();
      setPickupLocation(null);
      setDeliveryLocation(null);
      navigate('/uhome');

    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };



  return (
    <><br />
    <section>
        <div className='container'>
            <div className='row'>
                <div className='col-md-6 offset-md-3'>
                    <h2><BackButton /> CREATE ORDER</h2>
                    <div className='form' style={{ marginTop: '30px' }}>
                        <Form form={form} onFinish={handleSubmit} layout='vertical'>
                          
                          {/* Location Section */}
                          <Form.Item
                            label="Pickup Location"
                            name="pickupLocation"
                            rules={[{ required: true, message: 'Please capture pickup location' }]}
                          >
                            <Input 
                              placeholder='Location will appear here' 
                              size='large'
                              disabled 
                            />
                          </Form.Item>
                          <Form.Item>
                            <Button 
                              icon={<EnvironmentOutlined />}
                              block
                              onClick={() => getCurrentLocation('pickup')}
                            >
                              Get Current Pickup Location
                            </Button>
                          </Form.Item>
                          {pickupLocation && <p style={{ color: 'green', marginBottom: 16 }}>✓ Pickup location set</p>}

                          <Form.Item
                            label="Pickup Address (Optional)"
                            name="pickupAddress"
                          >
                            <Input placeholder='Enter pickup address or description' size='large' />
                          </Form.Item>

                          <Form.Item
                            label="Delivery Location"
                            name="deliveryLocation"
                            rules={[{ required: true, message: 'Please capture delivery location' }]}
                          >
                            <Input 
                              placeholder='Location will appear here' 
                              size='large'
                              disabled 
                            />
                          </Form.Item>
                          <Form.Item>
                            <Button 
                              icon={<EnvironmentOutlined />}
                              block
                              onClick={() => getCurrentLocation('delivery')}
                            >
                              Get Current Delivery Location
                            </Button>
                          </Form.Item>
                          {deliveryLocation && <p style={{ color: 'green', marginBottom: 16 }}>✓ Delivery location set</p>}

                          <Form.Item
                            label="Delivery Address (Optional)"
                            name="deliveryAddress"
                          >
                            <Input placeholder='Enter delivery address or description' size='large' />
                          </Form.Item>

                          {/* Package Section */}
                            <Form.Item
                                label="Package Name"
                                name="packagename"
                                rules={[{ required: true, message: 'Please enter your Package name' }]}
                                >
                                <Input placeholder='Package Name'  size='large'/>
                            </Form.Item>
                            <Form.Item
                                label="Receiver"
                                name="receiver"
                                rules={[{ required: true, message: 'Please enter your Receiver' }]}
                                >
                                <Input placeholder='Receiver Username' size='large'/>
                            </Form.Item>
                            <Form.Item
                                label="Driver"
                                name="driver"
                                rules={[{ required: true, message: 'please select your driver' }]} // Make it optional???
                                >
                                <Select 
                                    placeholder="Select a driver" 
                                    size="large"
                                    allowClear
                                >
                                    {drivers.map(driver => (
                                    <Option key={driver._id} value={driver._id}>
                                        {driver.firstname} {driver.lastname} - {driver.vehicle}
                                    </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label="Size"
                                name="size"
                                rules={[{ required: true, message: 'Please select package size' }]}
                            >
                                <Select placeholder="Select size" size="large">
                                <Option value="Small">Small</Option>
                                <Option value="Medium">Medium</Option>
                                <Option value="Large">Large</Option>
                                <Option value="Extra Large">Extra Large</Option>
                                </Select>
                            </Form.Item>
                           <Form.Item
                                label="Description"
                                name="description"
                                rules={[{ required: true, message: 'Please enter description' }]}
                            >
                                <TextArea 
                                rows={4} 
                                placeholder='Describe your package...' 
                                maxLength={500}
                                showCount
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button 
                                    type="primary" 
                                    htmlType="submit" 
                                    block
                                    size="large"
                                    loading={loading}
                                >
                                    Create Order
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

export default Ucreate
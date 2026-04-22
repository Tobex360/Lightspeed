import React, { useState, useEffect } from 'react'
import { Input, Button, Form, message, Select, Spin, Card, Alert } from 'antd'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import TrackingMap from '../../components/TrackingMap';
import { API_URL } from "../../config/api";

const { TextArea } = Input;
const { Option } = Select;

function Ucreate() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const [loadingDrivers, setLoadingDrivers] = useState(true);
  const [selectedDeliveryLocation, setSelectedDeliveryLocation] = useState(null);

  const navigate = useNavigate();

    // Fetch available drivers when component mounts

    useEffect(()=>{
        fetchAvailableDrivers();
    },[]);

    const fetchAvailableDrivers = async ()=>{
        try{
            setLoadingDrivers(true);
            const response = await axios.get(`${API_URL}/driver/available`);
            setDrivers(response.data.drivers || [])
        }catch(error){
            console.log(error)
            setDrivers([]);
        }finally{
            setLoadingDrivers(false);
        }
    };

    const handleDeliveryLocationSelect = (location) => {
        setSelectedDeliveryLocation(location);
    };

    const handleSubmit = async(values)=>{
        setLoading(true);
        try{
            if (!selectedDeliveryLocation) {
                message.error('Please select a delivery location on the map');
                setLoading(false);
                return;
            }

            console.log('Form Values:', values);
            // Get sender
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            console.log('Sender user:', user);

            // Resolve receiver username to user ID
            const receiverResponse = await axios.get(`${API_URL}/user/username/${values.receiver}`);
            const receiverId = receiverResponse.data.user._id;
            console.log('Receiver ID:', receiverId);

            const orderData ={
                sender: user.userid,
                receiver: receiverId,
                driver: values.driver || null,
                packageName: values.packagename,
                size: values.size,
                description: values.description,
                deliveryLocation: selectedDeliveryLocation
            }
            console.log('Order data being sent:', orderData);

            const response = await axios.post(`${API_URL}/order/create`, orderData);

            message.success('Order created successfully!');
            form.resetFields();
            setSelectedDeliveryLocation(null);
            navigate('/uhome');

        }catch(err){
            console.log('Error details:', err.response?.data || err.message)
            message.error(err.response?.data?.message || 'Failed to create order. Please check the receiver username and try again.')
        } finally{
            setLoading(false);
        }
    };



  return (
    <><br />
    <section>
        <div className='container'>
            <div className='row'>
                <div className='col-md-8 offset-md-2'>
                    <h2> <BackButton /> CREATE ORDER</h2>
                    
                    {/* Delivery Location Map */}
                    <Card title="Select Delivery Location" style={{ marginTop: '30px', marginBottom: '30px' }}>
                        <TrackingMap 
                            onDeliveryLocationSelect={handleDeliveryLocationSelect}
                        />
                    </Card>

                    {selectedDeliveryLocation && (
                        <Alert
                            message="Delivery location selected"
                            description={`Latitude: ${selectedDeliveryLocation.latitude.toFixed(4)}, Longitude: ${selectedDeliveryLocation.longitude.toFixed(4)}`}
                            type="success"
                            showIcon
                            style={{ marginBottom: '20px' }}
                        />
                    )}

                    <div className='form' style={{ marginTop: '30px' }}>
                        <Form form={form} onFinish={handleSubmit} layout='vertical'>
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
                                <Input placeholder='Receiver Username' />
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
import React, { useState, useEffect } from 'react'
import { Input, Button, Form, message, Select, Spin } from 'antd'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;
const { Option } = Select;

function Ucreate() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const [loadingDrivers, setLoadingDrivers] = useState(true);

  const navigate = useNavigate();

    // Fetch available drivers when component mounts

    useEffect(()=>{
        fetchAvailableDrivers();
    },[]);

    const fetchAvailableDrivers = async ()=>{
        try{
            setLoadingDrivers(true);
            const response = await axios.get(`http://localhost:7000/driver/available`);
            setDrivers(response.data.drivers || [])
        }catch(error){
            console.log(error)
            setDrivers([]);
        }finally{
            setLoadingDrivers(false);
        }
    };

    const handleSubmit = async(values)=>{
        setLoading(true);
        try{
            console.log('Form Values:', values);
            // Get sender
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            console.log('Sender user:', user);

            // Resolve receiver username to user ID
            const receiverResponse = await axios.get(`http://localhost:7000/user/username/${values.receiver}`);
            const receiverId = receiverResponse.data.user._id;
            console.log('Receiver ID:', receiverId);

            const orderData ={
                sender: user.userid,
                receiver: receiverId,
                driver: values.driver || null,
                packageName: values.packagename,
                size: values.size,
                description: values.description
            }
            console.log('Order data being sent:', orderData);

            const response = await axios.post(`http://localhost:7000/order/create`, orderData);

            message.success('Order created successfully!');
            form.resetFields();
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
                <div className='col-md-6 offset-md-3'>
                    <h2>Create Order</h2>
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
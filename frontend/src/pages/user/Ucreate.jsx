import React, { useState, useEffect } from 'react'
import { Input, Button, Form, message, Select, Spin } from 'antd'
import axios from 'axios'

const { TextArea } = Input;
const { Option } = Select;

function Ucreate() {
  return (
    <><br />
    <section>
        <div className='container'>
            <div className='row'>
                <div className='col-md-6 offset-md-3'>
                    <h2>Create Order</h2>
                    <div className='form' style={{ marginTop: '30px' }}>
                        <Form>
                            <Form.Item
                                label="Package Name"
                                name="packagename"
                                rules={[{ required: true, message: 'Please enter your Packagename' }]}
                                >
                                <Input placeholder='Package Name' />
                            </Form.Item>
                            <Form.Item
                                label="Receiver"
                                name="receiver"
                                rules={[{ required: true, message: 'Please enter your Receiver' }]}
                                >
                                <Input placeholder='Receiver' />
                            </Form.Item>
                            <Form.Item
                                label="Driver"
                                name="driver"
                                rules={[{ required: true, message: 'Please select your Driver' }]}
                                >
                                <Input placeholder='Driver' />
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
                                >
                                    Create
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
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Input, Button, Form, message, Table, Tag } from 'antd'

function dhome() {
  const [username, setUsername] = useState("")
  const [firstname, setFirstname] = useState("")
  const [lastname, setLastname] = useState("")
  const [driverId, setDriverId] = useState("")
  const [pendingOrders, setPendingOrders] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    const driver = localStorage.getItem('driver');

    if(driver){
      const driverData = JSON.parse(driver);
      console.log('Driver data from localStorage:', driverData);
      setFirstname(driverData.firstname);
      setUsername(driverData.username);
      setLastname(driverData.lastname);
      const id = driverData.driverid || driverData._id || driverData.userid;
      console.log('Setting driver ID to:', id);
      setDriverId(id || '');
    }

  },[])

  useEffect(()=>{
    if(driverId){
      fetchDriverPendingOrders();
    }
  }, [driverId])

  const fetchDriverPendingOrders = async () => {
    setLoading(true);
    try {
      console.log('Fetching driver pending orders for driverId:', driverId);
      const response = await fetch(`http://localhost:7000/order/driver-pending/${driverId}`);
      const data = await response.json();
      console.log('Driver Pending Response:', data);
      if(data.orders){
        setPendingOrders(data.orders);
        console.log('Driver pending orders loaded:', data.orders);
      } else {
        console.log('No pending orders in response');
      }
    } catch (error) {
      console.log('Error fetching driver pending orders:', error);
      message.error('Failed to fetch pending orders');
    } finally {
      setLoading(false);
    }
  }

  const handleAcceptOrder = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:7000/order/accept-driver/${orderId}`, {
        method: 'PUT'
      });
      const data = await response.json();
      if(data.order){
        message.success('Order accepted');
        fetchDriverPendingOrders();
      }
    } catch (error) {
      console.log('Error accepting order:', error);
      message.error('Failed to accept order');
    }
  }

  const handleDeclineOrder = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:7000/order/decline-driver/${orderId}`, {
        method: 'PUT'
      });
      const data = await response.json();
      if(data.order){
        message.success('Order declined');
        fetchDriverPendingOrders();
      }
    } catch (error) {
      console.log('Error declining order:', error);
      message.error('Failed to decline order');
    }
  }

  const driverPendingColumns = [
    {
      title: 'Package Name',
      dataIndex: 'packageName',
      key: 'packageName',
    },
    {
      title: 'Sender',
      dataIndex: ['sender', 'username'],
      key: 'sender',
    },
    {
      title: 'Receiver',
      dataIndex: ['receiver', 'username'],
      key: 'receiver',
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <span>
          <Button 
            type='primary' 
            size='small'
            onClick={() => handleAcceptOrder(record._id)}
            style={{marginRight: '10px'}}
          >
            Accept
          </Button>
          <Button 
            danger 
            size='small'
            onClick={() => handleDeclineOrder(record._id)}
          >
            Decline
          </Button>
        </span>
      ),
    }
  ];

  return (
    <><br />
    <div className='container'>
      <div className='row justify-content-center'>
        <h2>Welcome, {firstname}</h2>
      </div>
    </div><br /><hr />

    <div className='container'>
      <div className='row'>
        <div className='col-md-24'>
          <h3>Pending Orders (Awaiting Your Response)</h3>
          <Table 
            columns={driverPendingColumns} 
            dataSource={pendingOrders.map((order, index) => ({...order, key: order._id}))}
            loading={loading}
            pagination={{pageSize: 10}}
          />
        </div>
      </div>
    </div><br />
    </>
    )
}

export default dhome
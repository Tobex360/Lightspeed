import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Input, Button, Form, message, Table, Tag } from 'antd'



function uhome() {
  const [username, setUsername] = useState("")
  const [firstname, setFirstname] = useState("")
  const [lastname, setLastname] = useState("")
  const [userId, setUserId] = useState("")
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    const user = localStorage.getItem('user');

    if(user){
      const userData = JSON.parse(user);
      setUsername(userData.username || 'User');
      setFirstname(userData.firstname || 'User');
      setLastname(userData.lastname || 'User');
      setUserId(userData.userid || '');
    }
  },[])

  useEffect(()=>{
    if(userId){
      fetchOutgoingOrders();
    }
  }, [userId])

  const fetchOutgoingOrders = async () => {
    setLoading(true);
    try {
      console.log('Fetching orders for userId:', userId);
      const response = await fetch(`http://localhost:7000/order/outgoing/${userId}`);
      const data = await response.json();
      console.log('Response:', data);
      if(data.orders){
        setOrders(data.orders);
        console.log('Orders loaded:', data.orders);
      } else {
        console.log('No orders in response');
      }
    } catch (error) {
      console.log('Error fetching orders:', error);
      message.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  }

  const columns = [
    {
      title: 'Package Name',
      dataIndex: 'packageName',
      key: 'packageName',
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
      title: 'Driver',
      dataIndex: ['driver', 'username'],
      key: 'driver',
      render: (text) => text || 'Unassigned'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colorMap = {
          'pending': 'gold',
          'accepted': 'blue',
          'in-transit': 'cyan',
          'completed': 'green',
          'cancelled': 'red'
        };
        return <Tag color={colorMap[status] || 'default'}>{status}</Tag>
      }
    },
    {
      title: 'Tracking Number',
      dataIndex: 'trackingNumber',
      key: 'trackingNumber',
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
        <div className='col-md-14'>
          <div className=''>
            Create Order 
            <Link to={'/ucreate'}><Button size='large' type='primary'>Create</Button></Link>
          </div>
        </div>
      </div>
    </div><br /><hr />

    <div className='container'>
      <div className='row'>
        <div className='col-md-24'>
          <h3>Outgoing Orders</h3>
          <Table 
            columns={columns} 
            dataSource={orders.map((order, index) => ({...order, key: order._id}))}
            loading={loading}
            pagination={{pageSize: 10}}
          />
        </div>
      </div>
    </div><br />
    </>
  )
}

export default uhome
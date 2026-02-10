import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Input, Button, Form, message, Table, Tag, Modal, Divider, Descriptions} from 'antd'
import { EyeOutlined, PlusOutlined } from '@ant-design/icons'





function uhome() {
  const [username, setUsername] = useState("")
  const [firstname, setFirstname] = useState("")
  const [lastname, setLastname] = useState("")
  const [userId, setUserId] = useState("")
  const [outgoingOrders, setOutgoingOrders] = useState([])
  const [incomingOrders, setIncomingOrders] = useState([])
  const [receiverPendingOrders, setReceiverPendingOrders] = useState([])
  const [completedOrders, setCompletedOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [completedLoading, setCompletedLoading] = useState(false)
  const [deleting, setDeleting] = useState({})

  // modal states

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)

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
      fetchIncomingOrders();
      fetchReceiverPendingOrders();
      fetchCompletedOrders();
    }
  }, [userId])

  const fetchOutgoingOrders = async () => {
    setLoading(true);
    try {
      console.log('Fetching outgoing orders for userId:', userId);
      const response = await fetch(`http://localhost:7000/order/outgoing/${userId}`);
      const data = await response.json();
      console.log('Outgoing Response:', data);
      if(data.orders){
        setOutgoingOrders(data.orders);
        console.log('Outgoing orders loaded:', data.orders);
      } else {
        console.log('No outgoing orders in response');
      }
    } catch (error) {
      console.log('Error fetching outgoing orders:', error);
      message.error('Failed to fetch outgoing orders');
    } finally {
      setLoading(false);
    }
  }

  const fetchIncomingOrders = async () => {
    try {
      console.log('Fetching incoming orders for userId:', userId);
      const response = await fetch(`http://localhost:7000/order/incoming/${userId}`);
      const data = await response.json();
      console.log('Incoming Response:', data);
      if(data.orders){
        setIncomingOrders(data.orders);
        console.log('Incoming orders loaded:', data.orders);
      } else {
        console.log('No incoming orders in response');
      }
    } catch (error) {
      console.log('Error fetching incoming orders:', error);
      message.error('Failed to fetch incoming orders');
    }
  }

  const fetchReceiverPendingOrders = async () => {
    try {
      console.log('Fetching receiver pending orders for userId:', userId);
      const response = await fetch(`http://localhost:7000/order/receiver-pending/${userId}`);
      const data = await response.json();
      console.log('Receiver Pending Response:', data);
      if(data.orders){
        setReceiverPendingOrders(data.orders);
        console.log('Receiver pending orders loaded:', data.orders);
      } else {
        console.log('No pending orders in response');
      }
    } catch (error) {
      console.log('Error fetching receiver pending orders:', error);
      message.error('Failed to fetch pending orders');
    }
  }

  const handleAcceptOrder = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:7000/order/accept-receiver/${orderId}`, {
        method: 'PUT'
      });
      const data = await response.json();
      if(data.order){
        message.success('Order accepted');
        fetchReceiverPendingOrders();
      }
    } catch (error) {
      console.log('Error accepting order:', error);
      message.error('Failed to accept order');
    }
  }

  const handleDeclineOrder = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:7000/order/decline-receiver/${orderId}`, {
        method: 'PUT'
      });
      const data = await response.json();
      if(data.order){
        message.success('Order declined');
        fetchReceiverPendingOrders();
      }
    } catch (error) {
      console.log('Error declining order:', error);
      message.error('Failed to decline order');
    }
  }

  const fetchCompletedOrders = async () => {
    setCompletedLoading(true);
    try {
      const response = await fetch(`http://localhost:7000/order/completed/${userId}`);
      const data = await response.json();
      if (data.orders) {
        setCompletedOrders(data.orders);
      }
    } catch (error) {
      console.log('Error fetching completed orders:', error);
      message.error('Failed to fetch completed orders');
    } finally {
      setCompletedLoading(false);
    }
  }

  const handleDeleteOrder = async (orderId) => {
    setDeleting(prev => ({ ...prev, [orderId]: true }));
    try {
      const response = await fetch(`http://localhost:7000/order/${orderId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.order) {
        message.success('Order deleted successfully');
        fetchCompletedOrders();
      }
    } catch (error) {
      console.log('Error deleting order:', error);
      message.error('Failed to delete order');
    } finally {
      setDeleting(prev => ({ ...prev, [orderId]: false }));
    }
  }

  // View order details

  const handleViewDetails = (order)=>{
    setSelectedOrder(order);
    setIsModalVisible(true);
  }

  const handleModalClose = ()=>{
    setIsModalVisible(false);
    setSelectedOrder(null);
  }

  const outgoingColumns = [
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
    },
    {
      title:'Action',
      key: 'action',
      render: (_, record) =>(
        <Button
        type='link'
        icon={<EyeOutlined />}
        onClick={()=> handleViewDetails(record)}
        >
          View Details
        </Button>
      )
    }
  ];

  const incomingColumns = [
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
    },
    {
      title:'Action',
      key: 'action',
      render: (_, record) =>(
        <Button
        type='link'
        icon={<EyeOutlined />}
        onClick={()=> handleViewDetails(record)}
        >
          View Details
        </Button>
      )
    }
  ];

  const receiverPendingColumns = [
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
          <Button
            type='link'
            size='small'
            icon={<EyeOutlined />}
            onClick={()=> handleViewDetails(record)}
            >
              View Details
          </Button>
        </span>
      ),
    }
  ];

  const completedColumns = [
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
      title: 'Driver',
      dataIndex: ['driver', 'username'],
      key: 'driver',
      render: (text) => text || 'N/A'
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
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          danger
          size='small'
          loading={deleting[record._id]}
          onClick={() => handleDeleteOrder(record._id)}
        >
          Delete
        </Button>
      ),
    },
    {
      title:'View Details',
      key: 'action',
      render: (_, record) =>(
        <Button
        type='link'
        icon={<EyeOutlined />}
        onClick={()=> handleViewDetails(record)}
        >
          View Details
        </Button>
      )
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
            <Link to={'/ucreate'}><Button size='large' type='primary'><PlusOutlined />Create Order</Button></Link>
          </div>
        </div>
      </div>
    </div><br /><hr />

    <div className='container'>
      <div className='row'>
        <div className='col-md-24'>
          <h3>Pending Orders (Awaiting Your Response)</h3>
          <Table 
            columns={receiverPendingColumns} 
            dataSource={receiverPendingOrders.map((order, index) => ({...order, key: order._id}))}
            loading={loading}
            pagination={{pageSize: 10}}
          />
        </div>
      </div>
    </div><br />

    <div className='container'>
      <div className='row'>
        <div className='col-md-24'>
          <h3>Outgoing Orders</h3>
          <Table 
            columns={outgoingColumns} 
            dataSource={outgoingOrders.map((order, index) => ({...order, key: order._id}))}
            loading={loading}
            pagination={{pageSize: 10}}
          />
        </div>
      </div>
    </div><br />

    <div className='container'>
      <div className='row'>
        <div className='col-md-24'>
          <h3>Incoming Orders</h3>
          <Table 
            columns={incomingColumns} 
            dataSource={incomingOrders.map((order, index) => ({...order, key: order._id}))}
            loading={loading}
            pagination={{pageSize: 10}}
          />
        </div>
      </div>
    </div><br />

    <div className='container'>
      <div className='row'>
        <div className='col-md-24'>
          <h3>Completed Orders</h3>
          <Table
            columns={completedColumns}
            dataSource={completedOrders.map((order) => ({ ...order, key: order._id }))}
            loading={completedLoading}
            pagination={{ pageSize: 10 }}
          />
        </div>
      </div>
    </div><br />
    <Modal
    title="Order Details"
    open={isModalVisible}
    onCancel={handleModalClose}
    footer={[
      <Button key="close" type='primary' onClick={handleModalClose}>
        Close
      </Button>
    ]}
    width={700}
    >
      {selectedOrder && (
        <>
          <Divider titlePlacement='left'>Package Information</Divider>
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Package Name" >
              {selectedOrder.packageName}
            </Descriptions.Item>
            <Descriptions.Item label="Size">
              {selectedOrder.size}
            </Descriptions.Item>
            <Descriptions.Item label="Description" span={2}>
              {selectedOrder.description || 'No description provided'}
            </Descriptions.Item>
            <Descriptions.Item label="Tracking Number" span={2}>
              <Tag color="blue">{selectedOrder.trackingNumber}</Tag>
            </Descriptions.Item>
          </Descriptions>

          <Divider titlePlacement='left'>Sender Information</Divider>
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Name" span={2}>
              {selectedOrder.sender?.firstname} {selectedOrder.sender?.lastname}
            </Descriptions.Item>
            <Descriptions.Item label="Username">
              {selectedOrder.sender?.username}
            </Descriptions.Item>
            <Descriptions.Item label="Phone Number">
              {selectedOrder.sender?.phonenumber}
            </Descriptions.Item>
            <Descriptions.Item label="Email" span={2}>
              {selectedOrder.sender?.email}
            </Descriptions.Item>
            <Descriptions.Item label="Address" span={2}>
              {selectedOrder.sender?.address?.street}, {selectedOrder.sender?.address?.city}, {selectedOrder.sender?.address?.state}
            </Descriptions.Item>
          </Descriptions>


          <Divider titlePlacement='left'>Receiver Information</Divider>
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Name" span={2}>
              {selectedOrder.receiver?.firstname} {selectedOrder.receiver?.lastname}
            </Descriptions.Item>
            <Descriptions.Item label="Username">
              {selectedOrder.receiver?.username}
            </Descriptions.Item>
            <Descriptions.Item label="Phone Number">
              {selectedOrder.receiver?.phonenumber}
            </Descriptions.Item>
            <Descriptions.Item label="Email" span={2}>
              {selectedOrder.receiver?.email}
            </Descriptions.Item>
            <Descriptions.Item label="Address" span={2}>
              {selectedOrder.receiver?.address?.street}, {selectedOrder.receiver?.address?.city}, {selectedOrder.receiver?.address?.state}
            </Descriptions.Item>
          </Descriptions>


          <Divider titlePlacement='left'>Driver Information</Divider>
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Name" span={2}>
              {selectedOrder.driver?.firstname} {selectedOrder.driver?.lastname}
            </Descriptions.Item>
            <Descriptions.Item label="Username">
              {selectedOrder.driver?.username}
            </Descriptions.Item>
            <Descriptions.Item label="Phone Number">
              {selectedOrder.driver?.phonenumber || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Email" span={2}>
              {selectedOrder.driver?.email || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Vehicle" span={2}>
              {selectedOrder.driver?.vehicle || 'N/A'}
            </Descriptions.Item>
          </Descriptions>


          <Divider titlePlacement='left'>Timeline</Divider>
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Created At">
              {new Date(selectedOrder.createdAt).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Updated At">
              {new Date(selectedOrder.updatedAt).toLocaleString()}
            </Descriptions.Item>
          </Descriptions>
        </>
      )}

    </Modal>
    </>
  )
}

export default uhome
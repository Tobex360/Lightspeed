import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Input, Button, Form, message, Table, Tag, Modal, Divider, Descriptions, Select} from 'antd'
import { EyeOutlined } from '@ant-design/icons'


function dhome() {
  const [username, setUsername] = useState("")
  const [firstname, setFirstname] = useState("")
  const [available, setAvailable] = useState(true)
  const [lastname, setLastname] = useState("")
  const [driverId, setDriverId] = useState("")
  const [pendingOrders, setPendingOrders] = useState([])
  const [ongoingOrders, setOngoingOrders] = useState([])
  const [completedOrders, setCompletedOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [ongoingLoading, setOngoingLoading] = useState(false)
  const [completedLoading, setCompletedLoading] = useState(false)
  const [statusUpdating, setStatusUpdating] = useState({})
  const [deleting, setDeleting] = useState({})

   // modal states
  
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState(null)
  

  useEffect(()=>{
    const driver = localStorage.getItem('driver');

    if(driver){
      const driverData = JSON.parse(driver);
      console.log('Driver data from localStorage:', driverData);
      setFirstname(driverData.firstname);
      setUsername(driverData.username);
      setLastname(driverData.lastname);
      setAvailable(driverData.isOpen)
      const id = driverData.driverid || driverData._id || driverData.userid;
      console.log('Setting driver ID to:', id);
      setDriverId(id || '');
    }

  },[])

  useEffect(()=>{
    if(driverId){
      fetchDriverPendingOrders();
      fetchDriverOngoingOrders();
      fetchCompletedOrders();
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
        fetchDriverOngoingOrders();
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

  const fetchDriverOngoingOrders = async () => {
    setOngoingLoading(true);
    try {
      console.log('Fetching driver ongoing orders for driverId:', driverId);
      const response = await fetch(`http://localhost:7000/order/driver-ongoing/${driverId}`);
      const data = await response.json();
      console.log('Driver Ongoing Response:', data);
      if (data.orders) {
        setOngoingOrders(data.orders);
        console.log('Driver ongoing orders loaded:', data.orders);
      } else {
        console.log('No ongoing orders in response');
      }
    } catch (error) {
      console.log('Error fetching driver ongoing orders:', error);
      message.error('Failed to fetch ongoing orders');
    } finally {
      setOngoingLoading(false);
    }
  }

  const handleStatusChange = async (orderId, newStatus) => {
    setStatusUpdating(prev => ({ ...prev, [orderId]: true }));
    try {
      const response = await fetch(`http://localhost:7000/order/update-status/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await response.json();
      if (data.order) {
        message.success('Order status updated');
        fetchDriverOngoingOrders();
        fetchCompletedOrders();
      }
    } catch (error) {
      console.log('Error updating order status:', error);
      message.error('Failed to update order status');
    } finally {
      setStatusUpdating(prev => ({ ...prev, [orderId]: false }));
    }
  }

  const fetchCompletedOrders = async () => {
    setCompletedLoading(true);
    try {
      const response = await fetch(`http://localhost:7000/order/completed/${driverId}`);
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

  const ongoingColumns = [
    {
      title: 'Package Name',
      dataIndex: 'packageName',
      key: 'packageName',
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
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
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Select
          value={status}
          style={{ width: '120px' }}
          onChange={(newStatus) => handleStatusChange(record._id, newStatus)}
          disabled={statusUpdating[record._id]}
          options={[
            { label: 'Accepted', value: 'accepted' },
            { label: 'In-Transit', value: 'in-transit' },
            { label: 'Completed', value: 'completed' }
          ]}
        />
      ),
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

  return (
    <><br />
    <div className='container'>
      <div className='row justify-content-center'>
        <h2>Hello, {firstname} {" "}👋{" "}{available?(<Tag color="green">Available</Tag>):(<Tag color="red">Not Available</Tag>)}</h2>
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
    
    <div className='container'>
      <div className='row'>
        <div className='col-md-24'>
          <h3>Ongoing Orders</h3>
          <Table
            columns={ongoingColumns}
            dataSource={ongoingOrders.map((order) => ({ ...order, key: order._id }))}
            loading={ongoingLoading}
            pagination={{ pageSize: 10 }}
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

export default dhome
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Button, Table, Tag, Modal, Divider, Descriptions, 
  Tabs, Card, Statistic, Row, Col, Typography, Space, Empty, message 
} from 'antd';
import { 
  EyeOutlined, PlusOutlined, ShoppingOutlined, 
  ArrowUpOutlined, ArrowDownOutlined, CheckCircleOutlined 
} from '@ant-design/icons';
import { API_URL } from "../../config/api";

const { Title, Text } = Typography;

function Uhome() {
  const [firstname, setFirstname] = useState("");
  const [userId, setUserId] = useState("");
  const [outgoingOrders, setOutgoingOrders] = useState([]);
  const [incomingOrders, setIncomingOrders] = useState([]);
  const [receiverPendingOrders, setReceiverPendingOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [completedLoading, setCompletedLoading] = useState(false);
  const [deleting, setDeleting] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:7000';

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      setFirstname(userData.firstname || 'User');
      setUserId(userData.userid || '');
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchOutgoingOrders();
      fetchIncomingOrders();
      fetchReceiverPendingOrders();
      fetchCompletedOrders();
    }
  }, [userId]);

  // Fetch functions
  const fetchOutgoingOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/order/outgoing/${userId}`);
      const data = await response.json();
      if (data.orders) {
        setOutgoingOrders(data.orders);
      }
    } catch (error) {
      console.error('Error fetching outgoing orders:', error);
      message.error('Failed to fetch outgoing orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchIncomingOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/order/incoming/${userId}`);
      const data = await response.json();
      if (data.orders) {
        setIncomingOrders(data.orders);
      }
    } catch (error) {
      console.error('Error fetching incoming orders:', error);
      message.error('Failed to fetch incoming orders');
    } finally{
      setLoading(false)
    }
  };

  const fetchReceiverPendingOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/order/receiver-pending/${userId}`);
      const data = await response.json();
      if (data.orders) {
        setReceiverPendingOrders(data.orders);
      }
    } catch (error) {
      console.error('Error fetching receiver pending orders:', error);
      message.error('Failed to fetch pending orders');
    } finally{
      setLoading(false)
    }
  };

  const fetchCompletedOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/order/completed/${userId}`);
      const data = await response.json();
      if (data.orders) {
        setCompletedOrders(data.orders);
      }
    } catch (error) {
      console.error('Error fetching completed orders:', error);
      message.error('Failed to fetch completed orders');
    } finally {
      setLoading(false);
    }
  };

  // Handler functions
  const handleAcceptOrder = async (orderId) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/order/accept-receiver/${orderId}`, {
        method: 'PUT'
      });
      const data = await response.json();
      if (data.order) {
        message.success('Order accepted');
        fetchReceiverPendingOrders();
      }
    } catch (error) {
      console.error('Error accepting order:', error);
      message.error('Failed to accept order');
    } finally{
      setLoading(false);
    }
  };

  const handleDeclineOrder = async (orderId) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/order/decline-receiver/${orderId}`, {
        method: 'PUT'
      });
      const data = await response.json();
      if (data.order) {
        message.success('Order declined');
        fetchReceiverPendingOrders();
      }
    } catch (error) {
      console.error('Error declining order:', error);
      message.error('Failed to decline order');
    } finally{
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    setLoading(true);
    setDeleting(prev => ({ ...prev, [orderId]: true }));
    try {
      const response = await fetch(`${API_URL}/order/${orderId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.order) {
        message.success('Order deleted successfully');
        fetchCompletedOrders();
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      message.error('Failed to delete order');
    } finally {
      setDeleting(prev => ({ ...prev, [orderId]: false }));
      setLoading(false);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedOrder(null);
  };

  const statusColorMap = {
    'pending': 'gold',
    'accepted': 'blue',
    'in-transit': 'cyan',
    'completed': 'green',
    'cancelled': 'red'
  };

  // Common columns
  const commonColumns = (type) => [
    { 
      title: 'Package', 
      dataIndex: 'packageName', 
      key: 'packageName', 
      render: (text) => <b>{text}</b> 
    },
    { 
      title: type === 'outgoing' ? 'Receiver' : 'Sender', 
      dataIndex: [type === 'outgoing' ? 'receiver' : 'sender', 'username'], 
      key: 'user' 
    },
    { 
      title: 'Tracking', 
      dataIndex: 'trackingNumber', 
      key: 'trackingNumber', 
      render: (num) => <Link to={`/track/${num}`}><Tag color="blue">{num}</Tag></Link> 
    },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status', 
      render: (s) => <Tag color={statusColorMap[s]}>{s.toUpperCase()}</Tag> 
    },
    { 
      title: 'Action', 
      key: 'action', 
      render: (_, record) => (
        <Button type="text" icon={<EyeOutlined />} onClick={() => handleViewDetails(record)}>
          Details
        </Button>
      )
    }
  ];

  // Receiver pending columns
  const receiverPendingColumns = [
    { title: 'Package', dataIndex: 'packageName', key: 'packageName', render: (text) => <b>{text}</b> },
    { title: 'Sender', dataIndex: ['sender', 'username'], key: 'sender' },
    { title: 'Size', dataIndex: 'size', key: 'size' },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button 
            type='primary' 
            size='small'
            onClick={() => handleAcceptOrder(record._id)}
            loading ={loading}
          >
            Accept
          </Button>
          <Button 
            danger 
            size='small'
            onClick={() => handleDeclineOrder(record._id)}
            loading={loading}
          >
            Decline
          </Button>
          <Button 
            type='link' 
            size='small'
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
          >
            View
          </Button>
        </Space>
      ),
    }
  ];

  // Completed columns
  const completedColumns = [
    { title: 'Package', dataIndex: 'packageName', key: 'packageName' },
    { title: 'Sender', dataIndex: ['sender', 'username'], key: 'sender' },
    { title: 'Receiver', dataIndex: ['receiver', 'username'], key: 'receiver' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (s) => <Tag color="green">{s}</Tag> },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            danger
            size='small'
            loading={deleting[record._id]}
            onClick={() => handleDeleteOrder(record._id)}
          >
            Delete
          </Button>
          <Button 
            type='link' 
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
          >
            View
          </Button>
        </Space>
      ),
    }
  ];

  const tabItems = [
    {
      key: '1',
      label: `Pending (${receiverPendingOrders.length})`,
      children: <Table 
        columns={receiverPendingColumns} 
        dataSource={receiverPendingOrders.map(o => ({...o, key: o._id}))} 
        loading={loading} 
        pagination={{ pageSize: 10 }}
      />,
    },
    {
      key: '2',
      label: `Outgoing (${outgoingOrders.length})`,
      children: <Table 
        columns={commonColumns('outgoing')} 
        dataSource={outgoingOrders.map(o => ({...o, key: o._id}))} 
        loading={loading} 
        pagination={{ pageSize: 10 }}
      />,
    },
    {
      key: '3',
      label: `Incoming (${incomingOrders.length})`,
      children: <Table 
        columns={commonColumns('incoming')} 
        dataSource={incomingOrders.map(o => ({...o, key: o._id}))} 
        loading={loading} 
        pagination={{ pageSize: 10 }}
      />,
    },
    {
      key: '4',
      label: `Completed (${completedOrders.length})`,
      children: <Table 
        columns={completedColumns} 
        dataSource={completedOrders.map(o => ({...o, key: o._id}))} 
        loading={loading} 
        pagination={{ pageSize: 10 }}
      />,
    },
  ];

  return (
    <div style={{ padding: '40px', background: '#f0f2f5', minHeight: '100vh' }}>
      {/* Header Section */}
      <Row gutter={[24, 24]} align="middle" justify="space-between" style={{ marginBottom: '32px' }}>
        <Col>
          <Title level={2} style={{ margin: 0 }}>Welcome back, {firstname} 👋</Title>
          <Text type="secondary">Manage your shipments and track deliveries in real-time.</Text>
        </Col>
        <Col>
          <Link to={'/ucreate'}>
            <Button 
              size='large' 
              type='primary' 
              icon={<PlusOutlined />} 
              style={{ height: '50px', fontWeight: 'bold' }}
            >
              Create New Shipment
            </Button>
          </Link>
        </Col>
      </Row>

      {/* Quick Stats Section */}
      <Row gutter={16} style={{ marginBottom: '32px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card variant={false} hoverable>
            <Statistic 
              title="Awaiting You" 
              value={receiverPendingOrders.length} 
              prefix={<ShoppingOutlined />} 
              styles={{ content: { color: '#faad14'} }} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant={false} hoverable>
            <Statistic 
              title="Outgoing" 
              value={outgoingOrders.length} 
              prefix={<ArrowUpOutlined />} 
              styles={{ content: { color: '#3f8600'} }} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant={false} hoverable>
            <Statistic 
              title="Incoming" 
              value={incomingOrders.length} 
              prefix={<ArrowDownOutlined />} 
              styles={{ content: { color: '#cf1322'} }} 
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card variant={false} hoverable>
            <Statistic 
              title="Completed" 
              value={completedOrders.length} 
              prefix={<CheckCircleOutlined />} 
              styles={{ content: { color: '#52c41a'} }} 
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content Card */}
      <Card variant={false} style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Tabs 
          defaultActiveKey="1" 
          items={tabItems} 
          size="large" 
        />
      </Card>

      {/* Details Modal */}
      <Modal
              title={<Title level={4}><EyeOutlined /> Manifest Details</Title>}
              open={isModalVisible}
              onCancel={handleModalClose}
              footer={[<Button key="close" type='primary' onClick={handleModalClose} size="large">Got it</Button>]}
              width={800}
              centered
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
    </div>
  );
}

export default Uhome;

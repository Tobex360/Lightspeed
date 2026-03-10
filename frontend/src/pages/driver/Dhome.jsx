import React, { useEffect, useState } from 'react';
import { 
  Button, Table, Tag, Modal, Divider, Descriptions, 
  Select, Card, Tabs, Row, Col, Typography, Space, Statistic, message 
} from 'antd';
import { 
  EyeOutlined, CarOutlined, CheckCircleOutlined, 
  ClockCircleOutlined, InboxOutlined 
} from '@ant-design/icons';
import { API_URL } from "../../config/api";

const { Title, Text } = Typography;

function Dhome() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [available, setAvailable] = useState(true);
  const [driverId, setDriverId] = useState("");
  const [pendingOrders, setPendingOrders] = useState([]);
  const [ongoingOrders, setOngoingOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ongoingLoading, setOngoingLoading] = useState(false);
  const [completedLoading, setCompletedLoading] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState({});
  const [deleting, setDeleting] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:7000';

  useEffect(() => {
    const driver = localStorage.getItem('driver');
    if (driver) {
      const driverData = JSON.parse(driver);
      console.log('Driver data from localStorage:', driverData);
      setFirstname(driverData.firstname);
      setLastname(driverData.lastname);
      setAvailable(driverData.isOpen);
      const id = driverData.driverid || driverData._id || driverData.userid;
      console.log('Setting driver ID to:', id);
      setDriverId(id || '');
    }
  }, []);

  useEffect(() => {
    if (driverId) {
      fetchDriverPendingOrders();
      fetchDriverOngoingOrders();
      fetchCompletedOrders();
    }
  }, [driverId]);

  // Fetch functions
  const fetchDriverPendingOrders = async () => {
    setLoading(true);
    try {
      console.log('Fetching driver pending orders for driverId:', driverId);
      const response = await fetch(`${API_URL}/order/driver-pending/${driverId}`);
      const data = await response.json();
      console.log('Driver Pending Response:', data);
      if (data.orders) {
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
  };

  const fetchDriverOngoingOrders = async () => {
    setOngoingLoading(true);
    try {
      console.log('Fetching driver ongoing orders for driverId:', driverId);
      const response = await fetch(`${API_URL}/order/driver-ongoing/${driverId}`);
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
  };

  const fetchCompletedOrders = async () => {
    setCompletedLoading(true);
    try {
      const response = await fetch(`${API_URL}/order/completed/${driverId}`);
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
  };

  // Handler functions
  const handleAcceptOrder = async (orderId) => {
    try {
      const response = await fetch(`${API_URL}/order/accept-driver/${orderId}`, {
        method: 'PUT'
      });
      const data = await response.json();
      if (data.order) {
        message.success('Order accepted');
        fetchDriverPendingOrders();
        fetchDriverOngoingOrders();
      }
    } catch (error) {
      console.log('Error accepting order:', error);
      message.error('Failed to accept order');
    }
  };

  const handleDeclineOrder = async (orderId) => {
    try {
      const response = await fetch(`${API_URL}/order/decline-driver/${orderId}`, {
        method: 'PUT'
      });
      const data = await response.json();
      if (data.order) {
        message.success('Order declined');
        fetchDriverPendingOrders();
      }
    } catch (error) {
      console.log('Error declining order:', error);
      message.error('Failed to decline order');
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setStatusUpdating(prev => ({ ...prev, [orderId]: true }));
    try {
      const response = await fetch(`${API_URL}/order/update-status/${orderId}`, {
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
  };

  const handleDeleteOrder = async (orderId) => {
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
      console.log('Error deleting order:', error);
      message.error('Failed to delete order');
    } finally {
      setDeleting(prev => ({ ...prev, [orderId]: false }));
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

  // Table columns
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
        <Space>
          <Button 
            type='primary' 
            size='small'
            onClick={() => handleAcceptOrder(record._id)}
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
            onClick={() => handleViewDetails(record)}
          >
            View
          </Button>
        </Space>
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
          style={{ width: '140px' }}
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
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          type='link'
          icon={<EyeOutlined />}
          onClick={() => handleViewDetails(record)}
        >
          View
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
      label: (
        <span>
          <ClockCircleOutlined /> Pending ({pendingOrders.length})
        </span>
      ),
      children: (
        <Table 
          columns={driverPendingColumns} 
          dataSource={pendingOrders.map(o => ({...o, key: o._id}))} 
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      ),
    },
    {
      key: '2',
      label: (
        <span>
          <CarOutlined /> Ongoing ({ongoingOrders.length})
        </span>
      ),
      children: (
        <Table 
          columns={ongoingColumns} 
          dataSource={ongoingOrders.map(o => ({...o, key: o._id}))} 
          loading={ongoingLoading}
          pagination={{ pageSize: 10 }}
        />
      ),
    },
    {
      key: '3',
      label: (
        <span>
          <CheckCircleOutlined /> Completed ({completedOrders.length})
        </span>
      ),
      children: (
        <Table 
          columns={completedColumns} 
          dataSource={completedOrders.map(o => ({...o, key: o._id}))} 
          loading={completedLoading}
          pagination={{ pageSize: 10 }}
        />
      ),
    },
  ];

  return (
    <div style={{ padding: '30px', background: '#f5f7f9', minHeight: '100vh' }}>
      {/* Header Profile Section */}
      <Card variant={false} style={{ marginBottom: '24px', borderRadius: '15px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <Row align="middle" justify="space-between">
          <Col>
            <Space orientation="vertical" size={0}>
              <Title level={2} style={{ margin: 0 }}>Welcome, {firstname}! 👨</Title>
              <Text type="secondary">You have {ongoingOrders.length} active deliveries today.</Text>
            </Space>
          </Col>
          <Col>
            <div style={{ textAlign: 'right' }}>
              <Text strong style={{ display: 'block', marginBottom: '4px' }}>Duty Status</Text>
              {available ? (
                <Tag color="green" style={{ padding: '4px 12px', borderRadius: '10px', fontSize: '14px' }}>
                  ● AVAILABLE FOR WORK
                </Tag>
              ) : (
                <Tag color="red" style={{ padding: '4px 12px', borderRadius: '10px', fontSize: '14px' }}>
                  ○ OFF DUTY
                </Tag>
              )}
            </div>
          </Col>
        </Row>
      </Card>

      {/* Stats Quick-View */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={8}>
          <Card variant={false} hoverable>
            <Statistic 
              title="Available Jobs" 
              value={pendingOrders.length} 
              prefix={<InboxOutlined />} 
              styles={{ content:{color: '#faad14' }}} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card variant={false} hoverable>
            <Statistic 
              title="In Transit" 
              value={ongoingOrders.length} 
              prefix={<CarOutlined />} 
              styles={{ content:{color: '#1890ff' }}} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card variant={false} hoverable>
            <Statistic 
              title="Total Finished" 
              value={completedOrders.length} 
              prefix={<CheckCircleOutlined />} 
              styles={{ content:{color: '#52c41a' }}} 
            />
          </Card>
        </Col>
      </Row>

      {/* Main Jobs Workspace */}
      <Card variant={false} style={{ borderRadius: '15px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <Tabs defaultActiveKey="2" items={tabItems} size="large" />
      </Card>

      {/* Detailed View Modal */}
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

export default Dhome;
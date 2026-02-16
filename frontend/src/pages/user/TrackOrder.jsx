// pages/user/TrackOrder.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Timeline, Tag, Spin, Alert } from 'antd';
import BackButton from '../../components/BackButton';
import axios from 'axios';

function TrackOrder() {
  const { trackingNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [trackingNumber]);


  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:7000/order/track/${trackingNumber}`);
      setOrder(response.data.order);
      setDriverLocation(response.data.order.driverLocation);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching order:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mt-5">
        <Alert title="Order not found" type="error" />
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          {/* Connection Status */}
          <div className='mb-3'>
            <BackButton />
          </div>
          <div className="mb-3">
            <Tag color={'red'}>
              ● Live Tracking Active
            </Tag>
          </div>

          {/* Header */}
          <Card className="mb-4">
            <div className="text-center">
              <h3>Track Your Order</h3>
              <h5>Tracking: <Tag color="blue">{order.trackingNumber}</Tag></h5>
              <Tag color="gold" style={{ fontSize: '16px', padding: '8px 16px' }}>
                {order.status.toUpperCase()}
              </Tag>
            </div>
          </Card>

          {/* Order Timeline */}
          <Card title="Order Timeline" className="mb-4">
            <Timeline >
              <Timeline.Item color="green">
                <strong>Order Created</strong>
                <p>{new Date(order.createdAt).toLocaleString()}</p>
              </Timeline.Item>

              {order.status !== 'pending' && (
                <Timeline.Item color="blue">
                  <strong>Driver Assigned</strong>
                  <p>{order.driver?.firstname} {order.driver?.lastname}</p>
                </Timeline.Item>
              )}

              {['in-transit', 'completed'].includes(order.status) && (
                <Timeline.Item color="cyan">
                  <strong>In Transit</strong>
                  <p>Package is on the way</p>
                </Timeline.Item>
              )}

              {order.status === 'completed' && (
                <Timeline.Item color="green">
                  <strong>Delivered</strong>
                  <p>{new Date(order.updatedAt).toLocaleString()}</p>
                </Timeline.Item>
              )}
            </Timeline>
          </Card>
          
        </div>
      </div>
    </div>
  );
}

export default TrackOrder;
// pages/user/TrackOrder.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Timeline, Tag, Spin, Alert } from 'antd';
import { useSocket } from '../../context/SocketContext';
import DeliveryMap from '../../components/DeliveryMap';
import BackButton from '../../components/BackButton';
import axios from 'axios';

function TrackOrder() {
  const { trackingNumber } = useParams();
  const { socket, connected } = useSocket();
  const [order, setOrder] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [trackingNumber]);

  useEffect(() => {
    if (!socket || !order) return;

    // Join order tracking room
    socket.emit('order:track', order._id);

    // Listen for location updates
    socket.on('location:update', (data) => {
      console.log('Driver location update:', data);
      setDriverLocation(data.location);
    });

    // Listen for status updates
    socket.on('status:update', (data) => {
      console.log('Order status update:', data);
      setOrder(prev => ({ ...prev, status: data.status }));
    });

    // Cleanup
    return () => {
      socket.off('location:update');
      socket.off('status:update');
    };
  }, [socket, order]);

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
        <Alert message="Order not found" type="error" />
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
            <Tag color={connected ? 'green' : 'red'}>
              {connected ? '● Live Tracking Active' : '○ Connecting...'}
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

          {/* Live Map */}
          {(order.pickupLocation || order.deliveryLocation) && (
            <Card 
              title={order.status === 'in-transit' ? "Live Driver Location" : "Delivery Route"} 
              className="mb-4"
            >
              <DeliveryMap
                pickupLocation={order.pickupLocation}
                deliveryLocation={order.deliveryLocation}
                driverLocation={order.status === 'in-transit' ? driverLocation : null}
                showDriverMarker={order.status === 'in-transit' && !!driverLocation}
              />
              {driverLocation && driverLocation.timestamp && (
                <p className="text-muted mt-2">
                  Last updated: {new Date(driverLocation.timestamp).toLocaleTimeString()}
                </p>
              )}
            </Card>
          )}

          {/* Order Timeline */}
          <Card title="Order Timeline" className="mb-4">
            <Timeline>
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
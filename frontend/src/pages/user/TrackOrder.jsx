// pages/user/TrackOrder.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Timeline, Tag, Spin, Alert } from 'antd';
import BackButton from '../../components/BackButton';
import DeliveryAnimation from '../../components/DeliveryAnimation';
import TrackingMap from '../../components/TrackingMap';
import axios from 'axios';
import { API_URL } from "../../config/api";

function TrackOrder() {
  const { trackingNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [selectedDeliveryLocation, setSelectedDeliveryLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pollingInterval, setPollingInterval] = useState(null);

  // const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:7000';

  useEffect(() => {
    fetchOrderDetails();
    
    // Set up polling to update tracking info every 5 seconds
    const interval = setInterval(fetchOrderDetails, 5000);
    setPollingInterval(interval);
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [trackingNumber]);


  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/order/track/${trackingNumber}`);
      setOrder(response.data.order);
      
      // Update driver location if tracking is active
      if (response.data.order.isTrackingActive && response.data.order.driverLocation) {
        setDriverLocation(response.data.order.driverLocation);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching order:', error);
      setLoading(false);
    }
  };

  const handleDeliveryLocationSelect = (location) => {
    setSelectedDeliveryLocation(location);
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
            {order.isTrackingActive ? (
              <Tag color={'green'}>
                ● Live Tracking Active
              </Tag>
            ) : (
              <Tag color={'orange'}>
                ● Live Tracking Disabled
              </Tag>
            )}
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

          <DeliveryAnimation
          status={order.status}
          receiverName={order.receiver?.username}
          senderName={order.sender?.username}/>
          <br />

          {/* Live Tracking Map */}
          {order.isTrackingActive && (order.driverLocation || order.deliveryLocation || order.pickupLocation) && (
            <Card title="Live Driver Location & Select Delivery Point" className="mb-4">
              <TrackingMap 
                driverLocation={order.driverLocation}
                deliveryLocation={selectedDeliveryLocation || order.deliveryLocation}
                pickupLocation={order.pickupLocation}
                onDeliveryLocationSelect={handleDeliveryLocationSelect}
              />
            </Card>
          )}

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
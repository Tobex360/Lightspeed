// pages/driver/DriverDashboard.jsx (or separate component)
import React, { useEffect, useState } from 'react';
import { Button, Card, Switch, message } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import { useSocket } from '../context/SocketContext';

function DriverLocationSharing({ activeOrderId, driverId }) {
  const { socket } = useSocket();
  const [sharingLocation, setSharingLocation] = useState(false);
  const [watchId, setWatchId] = useState(null);

  const startSharingLocation = () => {
    if (!navigator.geolocation) {
      message.error('Geolocation is not supported by your browser');
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        console.log('Sending location:', location);

        // Send location to server
        socket.emit('driver:location', {
          driverId,
          orderId: activeOrderId,
          location
        });
      },
      (error) => {
        console.error('Location error:', error);
        message.error('Failed to get location');
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 5000
      }
    );

    setWatchId(id);
    setSharingLocation(true);
    message.success('Location sharing started');
  };

  const stopSharingLocation = () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setSharingLocation(false);
      message.info('Location sharing stopped');
    }
  };

  useEffect(() => {
    // Join driver room
    if (socket && driverId) {
      socket.emit('driver:join', driverId);
    }

    // Cleanup
    return () => {
      stopSharingLocation();
    };
  }, [socket, driverId]);

  return (
    <Card className="mb-4">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h5>
            <EnvironmentOutlined /> Live Location Sharing
          </h5>
          <p className="text-muted">
            {sharingLocation ? 'Customers can see your location' : 'Location sharing is off'}
          </p>
        </div>
        <Switch
          checked={sharingLocation}
          onChange={(checked) => {
            if (checked) {
              startSharingLocation();
            } else {
              stopSharingLocation();
            }
          }}
          checkedChildren="ON"
          unCheckedChildren="OFF"
        />
      </div>
    </Card>
  );
}

export default DriverLocationSharing;
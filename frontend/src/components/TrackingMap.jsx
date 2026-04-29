import React, { useMemo, useState, useEffect } from 'react';
import { Alert, Button, Space } from 'antd';
import { GoogleMap, LoadScript, MarkerF, Polyline } from '@react-google-maps/api';

function TrackingMap({ driverLocation, deliveryLocation, pickupLocation, onDeliveryLocationSelect }) {
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const [selectedLocation, setSelectedLocation] = useState(deliveryLocation);

  // Sync selectedLocation with deliveryLocation prop
  useEffect(() => {
    setSelectedLocation(deliveryLocation);
  }, [deliveryLocation]);

  const mapCenter = useMemo(() => {
    if (driverLocation?.latitude && driverLocation?.longitude) {
      return { lat: driverLocation.latitude, lng: driverLocation.longitude };
    }
    return { lat: 4.8040, lng: 7.0376 }; // Default: New York

    //4.8040299296737, 7.037664232855913
  }, [driverLocation]);

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
  };

  const mapOptions = {
    zoom: 15,
    mapTypeControl: true,
    streetViewControl: false,
    fullscreenControl: true,
    restriction: {
      latLngBounds: {
        north: 13.8856, // Northernmost point of Nigeria
        south: 4.2721,  // Southernmost point of Nigeria
        west: 2.6769,   // Westernmost point of Nigeria
        east: 14.6788,  // Easternmost point of Nigeria
      },
      strictBounds: true,
    },
  };

  const handleMapClick = (e) => {
    const newLocation = {
      latitude: e.latLng.lat(),
      longitude: e.latLng.lng(),
    };
    setSelectedLocation(newLocation);
    if (onDeliveryLocationSelect) {
      onDeliveryLocationSelect(newLocation);
    }
  };

  const handleClearDeliveryLocation = () => {
    setSelectedLocation(null);
    if (onDeliveryLocationSelect) {
      onDeliveryLocationSelect(null);
    }
  };


  const markerOptions = {
    driver: {
      icon: {
        path: 'M 0, -1 C -2.76228, -1 -5, -3.13401 -5, -5.5 C -5, -8.5663 -2.68629, -12 0, -12 C 2.68629, -12 5, -8.5663 5, -5.5 C 5, -3.13401 2.76228, -1 0, -1 Z',
        scale: 2,
        fillColor: '#4285F4',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 1,
      },
    },
    delivery: {
      icon: {
        path: 'M 0, -1 C -2.76228, -1 -5, -3.13401 -5, -5.5 C -5, -8.5663 -2.68629, -12 0, -12 C 2.68629, -12 5, -8.5663 5, -5.5 C 5, -3.13401 2.76228, -1 0, -1 Z',
        scale: 2.5,
        fillColor: '#EA4335',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 1,
      },
    },
    pickup: {
      icon: {
        path: 'M 0, -1 C -2.76228, -1 -5, -3.13401 -5, -5.5 C -5, -8.5663 -2.68629, -12 0, -12 C 2.68629, -12 5, -8.5663 5, -5.5 C 5, -3.13401 2.76228, -1 0, -1 Z',
        scale: 2.5,
        fillColor: '#34A853',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 1,
      },
    },
  };

  if (!GOOGLE_MAPS_API_KEY) {
    return <Alert message="Google Maps API key not configured" type="error" />;
  }

  return (
    <div style={{ marginBottom: '20px' }}>
      {onDeliveryLocationSelect && (
        <Alert
          message="Click on the map to select delivery location"
          type="info"
          style={{ marginBottom: '10px' }}
          showIcon
        />
      )}
      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={mapCenter}
          zoom={15}
          options={mapOptions}
          onClick={onDeliveryLocationSelect ? handleMapClick : undefined}
        >
          {driverLocation?.latitude && driverLocation?.longitude && (
            <MarkerF
              position={{
                lat: driverLocation.latitude,
                lng: driverLocation.longitude,
              }}
              title="Driver Location"
              icon={markerOptions.driver.icon}
            />
          )}

          {(selectedLocation || deliveryLocation)?.latitude && (selectedLocation || deliveryLocation)?.longitude && (
            <MarkerF
              position={{
                lat: (selectedLocation || deliveryLocation).latitude,
                lng: (selectedLocation || deliveryLocation).longitude,
              }}
              title="Delivery Location"
              icon={markerOptions.delivery.icon}
            />
          )}

          {pickupLocation?.latitude && pickupLocation?.longitude && (
            <MarkerF
              position={{
                lat: pickupLocation.latitude,
                lng: pickupLocation.longitude,
              }}
              title="Pickup Location"
              icon={markerOptions.pickup.icon}
            />
          )}
          {/* Draw line from driver to delivery location if both exist */}
          {driverLocation?.latitude && driverLocation?.longitude && (selectedLocation || deliveryLocation)?.latitude && (selectedLocation || deliveryLocation)?.longitude && (
            <Polyline
              path={[
                { lat: driverLocation.latitude, lng: driverLocation.longitude },
                { lat: (selectedLocation || deliveryLocation).latitude, lng: (selectedLocation || deliveryLocation).longitude }
              ]}
              options={{
                strokeColor: '#EA4335',
                strokeOpacity: 0.8,
                strokeWeight: 4,
                clickable: false,
                geodesic: true,
              }}
            />
          )}
        </GoogleMap>
      </LoadScript>
      {onDeliveryLocationSelect && selectedLocation && (
        <div style={{ marginTop: '10px' }}>
          <Space>
            <Alert
              message={`Selected: ${selectedLocation.latitude.toFixed(4)}, ${selectedLocation.longitude.toFixed(4)}`}
              type="success"
              style={{ marginBottom: 0 }}
            />
            <Button danger size="small" onClick={handleClearDeliveryLocation}>
              Clear
            </Button>
          </Space>
        </div>
      )}
    </div>
  );
}

export default TrackingMap;

import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { Alert } from 'antd';

function DeliveryMap({ pickupLocation, deliveryLocation, driverLocation, showDriverMarker }) {
  const [directions, setDirections] = useState(null);
  const [map, setMap] = useState(null);
  const [mapError, setMapError] = useState(null);

  const containerStyle = {
    width: '100%',
    height: '500px',
  };

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const center = driverLocation || pickupLocation || { lat: 6.5244, lng: 3.3792 };

  useEffect(() => {
    if (!apiKey) {
      setMapError('Google Maps API key not configured. Please add VITE_GOOGLE_MAPS_API_KEY to .env.local');
    }
  }, [apiKey]);

  useEffect(() => {
    if (pickupLocation && deliveryLocation && map) {
      const directionsService = new window.google.maps.DirectionsService();

      directionsService.route(
        {
          origin: pickupLocation,
          destination: deliveryLocation,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === 'OK') {
            setDirections(result);
          } else {
            console.error('Directions request failed:', status);
          }
        }
      );
    }
  }, [pickupLocation, deliveryLocation, map]);

  useEffect(() => {
    if (map && driverLocation) {
      map.panTo(driverLocation);
    }
  }, [driverLocation, map]);

  if (mapError) {
    return <Alert message="Map Error" description={mapError} type="error" />;
  }

  if (!apiKey) {
    return <Alert message="Map Configuration" description="Google Maps API key is missing" type="warning" />;
  }

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
        onLoad={setMap}
      >
        {pickupLocation && (
          <Marker
            position={pickupLocation}
            label="A"
            title="Pickup Location"
            icon={{
              url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
            }}
          />
        )}

        {deliveryLocation && (
          <Marker
            position={deliveryLocation}
            label="B"
            title="Delivery Location"
            icon={{
              url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
            }}
          />
        )}

        {showDriverMarker && driverLocation && window.google && (
          <Marker
            position={driverLocation}
            title="Driver"
            icon={{
              url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
              scaledSize: new window.google.maps.Size(40, 40),
            }}
            animation={window.google.maps.Animation.BOUNCE}
          />
        )}  
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              polylineOptions: {
                strokeColor: '#4285F4',
                strokeWeight: 5,
              },
            }}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
}

export default DeliveryMap;
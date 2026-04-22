import { API_URL } from '../config/api';

export const getGeolocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date()
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
};

export const watchGeolocation = (callback) => {
  if (!navigator.geolocation) {
    console.error('Geolocation not supported');
    return null;
  }

  return navigator.geolocation.watchPosition(
    (position) => {
      callback({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: new Date()
      });
    },
    (error) => {
      console.error('Geolocation error:', error);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
};

export const updateOrderLocation = async (orderId, latitude, longitude) => {
  try {
    const response = await fetch(`${API_URL}/order/update-location/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        latitude: latitude,
        longitude: longitude
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to update location');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating location:', error);
    throw error;
  }
};

export const updateTrackingStatus = async (orderId, isTrackingActive) => {
  try {
    const response = await fetch(`${API_URL}/order/update-tracking/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        isTrackingActive: isTrackingActive
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to update tracking status');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating tracking status:', error);
    throw error;
  }
};

export const getTrackingInfo = async (orderId) => {
  try {
    const response = await fetch(`${API_URL}/order/tracking-info/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch tracking info');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching tracking info:', error);
    throw error;
  }
};

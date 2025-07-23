// components/ui/Map.js

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import NearbyPlaces from '../map/NearbyPlaces'; // ✅ correct relative path based on your structure

export default function Map() {
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        console.error('Geolocation error:', error);
        alert('Location access denied');
      }
    );
  }, []);

  if (!userLocation) {
    return <p>Getting your location...</p>;
  }

  return (
    <MapContainer
      center={[userLocation.lat, userLocation.lng]}
      zoom={15}
      style={{ height: '100vh', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {/* User marker */}
      <UserMarker location={userLocation} />

      {/* Nearby restaurants & hotels */}
      <NearbyPlaces userLocation={userLocation} />
    </MapContainer>
  );
}

// Marker that shows where the user is
function UserMarker({ location }) {
  const map = useMap();

  useEffect(() => {
    map.setView([location.lat, location.lng], 15);
  }, [location, map]);

  return (
    <Marker position={[location.lat, location.lng]}>
      <Popup>You are here</Popup>
    </Marker>
  );
}

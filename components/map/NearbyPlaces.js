import React, { useState } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const placeIcons = {
  restaurant: new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  }),
  hotel: new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/139/139899.png',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  })
};

export default function NearbyPlaces({ userLocation, radius = 1200 }) {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (!userLocation) return;
    setLoading(true);
    setError('');
    // Overpass QL query for restaurants and hotels
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"="restaurant"](around:${radius},${userLocation.lat},${userLocation.lng});
        node["tourism"="hotel"](around:${radius},${userLocation.lat},${userLocation.lng});
      );
      out body;
    `;
    fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (data && data.elements) {
          setPlaces(data.elements);
        } else {
          setPlaces([]);
        }
      })
      .catch(() => {
        setLoading(false);
        setError('Failed to fetch nearby places.');
      });
  }, [userLocation, radius]);

  if (!userLocation) return null;
  if (loading) return <div className="nearby-loading">Loading nearby places...</div>;
  if (error) return <div className="nearby-error">{error}</div>;
  if (places.length === 0) return <div className="nearby-none">No nearby restaurants or hotels found.</div>;

  return <>
    {places.map(place => (
      <Marker
        key={place.id}
        position={[place.lat, place.lon]}
        icon={place.tags.amenity === 'restaurant' ? placeIcons.restaurant : placeIcons.hotel}
      >
        <Popup>
          <strong>{place.tags.name || (place.tags.amenity === 'restaurant' ? 'Restaurant' : 'Hotel')}</strong><br/>
          {place.tags.cuisine && <span>Cuisine: {place.tags.cuisine}<br/></span>}
          {place.tags['addr:street'] && <span>{place.tags['addr:street']}<br/></span>}
          {place.tags['addr:city'] && <span>{place.tags['addr:city']}<br/></span>}
        </Popup>
      </Marker>
    ))}
  </>;
}
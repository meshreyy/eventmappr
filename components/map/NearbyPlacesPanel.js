import React, { useEffect, useState } from 'react';
import NearbyPlaces from './NearbyPlaces';

export default function NearbyPlacesPanel({ userLocation, onClose }) {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch places using the same Overpass API logic as NearbyPlaces
  useEffect(() => {
    if (!userLocation) return;
    setLoading(true);
    setError('');
    const radius = 1200;
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
          // Filter to only restaurants and hotels
          const filtered = data.elements.filter(el =>
          (el.tags &&
            (
              el.tags.amenity === 'restaurant' ||
              el.tags.tourism === 'hotel'
            )
          )
          );

          setPlaces(filteredPlaces);
        } else {
          setPlaces([]);
        }
      })
      .catch(() => {
        setLoading(false);
        setError('Failed to fetch nearby places.');
      });
  }, [userLocation]);

  return (
    <>
      <div className="nearby-modal-overlay" onClick={onClose}></div>
      <div className="nearby-modal">
        <div className="nearby-modal-header">
          <span>Nearby Restaurants & Hotels</span>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="nearby-modal-content">
          {loading && <div>Loading...</div>}
          {error && <div style={{ color: 'red' }}>{error}</div>}
          {!loading && !error && places.length === 0 && <div>No nearby places found.</div>}
          {!loading && !error && places.length > 0 && (
            <ul className="nearby-places-list">
              {places.map(place => (
                <li key={place.id} className="nearby-place-item">
                  <strong>{place.tags.name || (place.tags.amenity === 'restaurant' ? 'Restaurant' : 'Hotel')}</strong><br />
                  {place.tags.cuisine && <span>Cuisine: {place.tags.cuisine}<br /></span>}
                  {place.tags['addr:street'] && <span>{place.tags['addr:street']}<br /></span>}
                  {place.tags['addr:city'] && <span>{place.tags['addr:city']}<br /></span>}
                  <span style={{ color: '#888' }}>{place.tags.amenity === 'restaurant' ? '🍽️ Restaurant' : '🏨 Hotel'}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <style jsx>{`
        .nearby-modal-overlay {
          position: fixed !important;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0,0,0,0.45);
          z-index: 2147483647 !important;
          pointer-events: auto !important;
        }
        .nearby-modal {
          position: fixed !important;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 95vw;
          max-width: 420px;
          max-height: 85vh;
          background: #fff;
          color: #111;
          border-radius: 12px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.35);
          z-index: 2147483647 !important;
          display: flex;
          flex-direction: column;
          opacity: 1;
          pointer-events: auto !important;
        }
        .nearby-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem 1rem 1.5rem;
          font-size: 1.2rem;
          font-weight: bold;
          border-bottom: 1px solid #eee;
          color: #111;
        }
        .close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #111;
        }
        .nearby-modal-content {
          flex: 1;
          padding: 1rem 1.5rem;
          overflow-y: auto;
          color: #111;
        }
        .nearby-places-list {
          list-style: none;
          padding: 0;
        }
        .nearby-place-item {
          margin-bottom: 1.25rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #f2f2f2;
          color: #111;
        }
      `}</style>
    </>
  );
}

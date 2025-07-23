import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';


export default function NearbyPage() {
  const [userLocation, setUserLocation] = useState(null);
  const MapContainer = dynamic(() =>
    import('react-leaflet').then(mod => mod.MapContainer),
    { ssr: false }
  );
  const NearbyPlaces = dynamic(
  () => import('../components/map/NearbyPlaces'),
  { ssr: false }  // ✅ disables server-side rendering for NearbyPlaces
);
const SearchBox = dynamic(() => import('../components/map/SearchBox'), { ssr: false });


  const TileLayer = dynamic(() =>
    import('react-leaflet').then(mod => mod.TileLayer),
    { ssr: false }
  );

  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Animation on scroll for Nearby Places page
    const animateOnScroll = () => {
      const elementsToAnimate = [
        { selector: '.nearby-page', threshold: 1.3 },
        { selector: '.btn-find', threshold: 1.3 },
        { selector: '.nearby-places-list', threshold: 1.3 }
      ];

      elementsToAnimate.forEach(element => {
        const el = document.querySelector(element.selector);
        if (el) {
          const elementPosition = el.getBoundingClientRect().top;
          const screenPosition = window.innerHeight / element.threshold;

          if (elementPosition < screenPosition) {
            el.classList.add('animate');
          }
        }
      });
    };

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on load

    return () => {
      window.removeEventListener('scroll', animateOnScroll);
    };
  }, []);

  useEffect(() => {
    if (!userLocation) return;
    setLoading(true);
    setError('');
    const radius = 3000;
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
  }, [userLocation]);

  const handleFindNearby = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        setError('');
      },
      () => {
        setError('Unable to retrieve your location. Please check your browser permissions.');
      }
    );
  };

  return (
    <div className="nearby-page" style={{
      position: 'relative',
      zIndex: 1,
      marginTop: '100px'
    }}>
      <h2 style={{
        position: 'relative',
        zIndex: 2,
        marginBottom: '1.5rem',
        textAlign: 'center',
        color: '#222'
      }}>Nearby Restaurants & Hotels</h2>
      <button className="btn-find" onClick={handleFindNearby} disabled={loading}>
        {userLocation ? 'Refresh Location' : 'Find Nearby Places'}
      </button>
      {error && <div style={{ color: 'red', marginTop: '1rem' }}>{error}</div>}
      {loading && <div style={{ marginTop: '1rem' }}>Loading...</div>}
      {!loading && !error && userLocation && (
        <>
          {/* 1️⃣ Map block */}
          <div
            style={{
              height: '400px',
              width: '100%',
              margin: '2rem 0',
              borderRadius: '12px',
              overflow: 'hidden',
            }}
          >
            <MapContainer
              center={[userLocation.lat, userLocation.lng]}
              zoom={15}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <SearchBox onSearch={(coords) => setUserLocation(coords)} />
              <NearbyPlaces userLocation={userLocation} />
            </MapContainer>
          </div>

          {/* 2️⃣ List of place cards */}
          <ul className="nearby-places-list">
            {places.length === 0 && <li>No nearby places found.</li>}
            {places.map((place, index) => (
              <li
                key={place.id}
                className="nearby-place-item"
                style={{
                  opacity: 0,
                  transform: `translateY(${(index + 1) * 20}px)`,
                  transition: 'all 0.6s ease',
                  transitionDelay: `${index * 0.1}s`,
                }}
              >
                <strong>
                  {place.tags.name ||
                    (place.tags.amenity === 'restaurant' ? 'Restaurant' : 'Hotel')}
                </strong>
                <br />
                {place.tags.cuisine && (
                  <span>
                    Cuisine: {place.tags.cuisine}
                    <br />
                  </span>
                )}
                {place.tags['addr:street'] && (
                  <span>
                    {place.tags['addr:street']}
                    <br />
                  </span>
                )}
                {place.tags['addr:city'] && (
                  <span>
                    {place.tags['addr:city']}
                    <br />
                  </span>
                )}
                <span style={{ color: '#888' }}>
                  {place.tags.amenity === 'restaurant'
                    ? '🍽️ Restaurant'
                    : '🏨 Hotel'}
                </span>
                <br />
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lon}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="get-location-btn"
                >
                  Get Location
                </a>
              </li>
            ))}
          </ul>
        </>
      )}

      <style jsx>{`
        .nearby-page {
          max-width: 600px;
          margin: 2rem auto;
          padding: 2rem;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.08);
          color: #222;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s ease;
          position: relative;
          z-index: 1;
        }

        .nearby-page.animate {
          opacity: 1;
          transform: translateY(0);
        }

        h2 {
          margin-bottom: 1.5rem;
          text-align: center;
          color: #222;
        }

        .btn-find {
          display: block;
          margin: 0 auto 1.5rem auto;
          padding: 0.75rem 2rem;
          border: none;
          border-radius: 6px;
          background: #22223b;
          color: #fff;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s ease;
        }

        .btn-find.animate {
          opacity: 1;
          transform: translateY(0);
        }

        .btn-find:disabled {
          background: #aaa;
          cursor: not-allowed;
        }

        .nearby-places-list {
          list-style: none;
          padding: 0;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s ease;
        }

        .nearby-places-list.animate {
          opacity: 1;
          transform: translateY(0);
        }

        .nearby-place-item {
          margin-bottom: 1.25rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #f2f2f2;
          color: #222;
        }

        .get-location-btn {
          display: inline-block;
          margin-top: 0.5rem;
          padding: 0.4rem 1.1rem;
          background: #22223b;
          color: #fff;
          border-radius: 5px;
          font-size: 0.96rem;
          text-decoration: none;
          font-weight: 500;
          transition: background 0.2s;
        }

        .get-location-btn:hover {
          background: #3a3a5a;
        }

        @media (prefers-color-scheme: dark) {
          .nearby-page, .nearby-place-item {
            background: #181824;
            color: #fff;
          }
          h2 {
            color: #fff;
          }
        }
      `}</style>
    </div>
  );
}

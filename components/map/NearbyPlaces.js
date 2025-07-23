import React, { useState, useEffect } from 'react';
import { Marker, Popup } from 'react-leaflet';


export default function NearbyPlaces({ userLocation, radius = 1200 }) {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [icons, setIcons] = useState(null); // ✅ store icons after client-safe load

  // ✅ Load icons after client-side mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('leaflet').then((L) => {
        setIcons({
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
          }),
        });
      });
    }
  }, []);

  // ✅ Fetch Overpass places
  useEffect(() => {
    if (!userLocation) return;
    setLoading(true);
    setError('');
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
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ data: query }).toString(),
    })


      .then((res) => res.json())
      .then((data) => {
        setLoading(false);

        // 👇 ADD LOG HERE - this is where you see all the raw elements
        console.log('Raw Overpass Elements:', data.elements);

        if (data?.elements) {
          const filtered = data.elements.filter((el) => (
            el.tags?.amenity === 'restaurant' || el.tags?.tourism === 'hotel'
          ));
          setPlaces(filtered);
        } else {
          setPlaces([]);
        }
      })
      .catch(() => {
        setLoading(false);
        setError('Failed to fetch nearby places.');
      });
  }, [userLocation, radius]);


  // ✅ Render guard
  if (!userLocation || loading || error || !icons) return null;

  return (
    <>
      {places.map((place) => {
        if (
          place.tags.amenity !== 'restaurant' &&
          place.tags.tourism !== 'hotel'
        ) return null; // skips non-matching tags

        const icon = place.tags.amenity === 'restaurant' ? icons.restaurant : icons.hotel;
        return (
          <Marker key={place.id} position={[place.lat, place.lon]} icon={icon}>
            <Popup>
              <strong>
                {place.tags.name || (place.tags.amenity === 'restaurant' ? 'Restaurant' : 'Hotel')}
              </strong>
              <br />
              {place.tags.cuisine && <span>Cuisine: {place.tags.cuisine}<br /></span>}
              {place.tags['addr:street'] && <span>{place.tags['addr:street']}<br /></span>}
              {place.tags['addr:city'] && <span>{place.tags['addr:city']}<br /></span>}
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}

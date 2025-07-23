import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { FiChevronLeft, FiMenu } from "react-icons/fi";
import L from "leaflet";

// Fix for Leaflet icon loading in Webpack/Next.js
if (typeof window !== "undefined") {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  });
}

const MapController = ({ center }) => {
  const map = useMap();
  React.useEffect(() => {
    if (center) {
      map.flyTo(center, 15);
    }
  }, [center, map]);
  return null;
};

export default function TouristPlacesMap({
  attractions,
  userLocation,
  selectedPlace,
  sidebarOpen,
  setSidebarOpen
}) {
  const [searchInput, setSearchInput] = useState("");
  const [searchPosition, setSearchPosition] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchInput) return;

    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchInput)}&format=json`);
    const results = await res.json();

    if (results && results.length > 0) {
      const result = results[0];
      setSearchPosition([parseFloat(result.lat), parseFloat(result.lon)]);
    }
  };

  return (
    <main className="flex-1 relative">
      {/* Search bar */}
      <form onSubmit={handleSearch} className="absolute z-30 top-4 right-4 bg-white p-2 rounded-md shadow-md flex gap-2">
        <input
          type="text"
          placeholder="Search a location..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="px-3 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      {/* Sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute top-4 left-4 z-20 bg-white p-2 rounded-full shadow-md text-slate-700 hover:bg-slate-100 md:hidden"
      >
        {sidebarOpen ? <FiChevronLeft /> : <FiMenu />}
      </button>

      <MapContainer center={userLocation || [51.505, -0.09]} zoom={13} className="w-full h-full z-10">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* fly to selected/search location */}
        <MapController center={searchPosition || selectedPlace?.position || userLocation} />

        {/* Marker on user */}
        {userLocation && (
          <Marker position={userLocation}>
            <Popup>Your Location</Popup>
          </Marker>
        )}

        {/* Marker on searched location */}
        {searchPosition && (
          <Marker position={searchPosition}>
            <Popup>Search result</Popup>
          </Marker>
        )}

        {/* Tourist attractions markers */}
        {attractions.map(place => (
          <Marker key={place.id} position={place.position}>
            <Popup>
              <div className="font-sans">
                <h4 className="font-bold">{place.name}</h4>
                <p className="capitalize">{place.type.replace(/_/g, " ")}</p>
                {place.website && (
                  <a
                    href={place.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Website
                  </a>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </main>
  );
}

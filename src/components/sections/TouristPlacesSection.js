"use client";

import { useState, useRef, useEffect } from "react";
import {
  FiLoader,
  FiAlertCircle,
  FiCompass,
  FiMapPin,
  FiExternalLink,
  FiNavigation,
  FiClock,
} from "react-icons/fi";
import dynamic from "next/dynamic";
import Places from "./places";

const TouristPlacesMap = dynamic(() => import("./TouristPlacesMap"), {
  ssr: false,
});

export default function TouristPlacesSection() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingFind, setLoadingFind] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [attractions, setAttractions] = useState([]);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(
    "Click the button to find historical places near you."
  );
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleFindAttractions = () => {
    setLoadingFind(true);
    setError(null);
    setAttractions([]);
    setSelectedPlace(null);

    if (!navigator.geolocation) {
      setStatus("Geolocation not supported.");
      setError("Geolocation is not supported by your browser.");
      setLoadingFind(false);
      return;
    }

    setStatus("Getting your location...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const location = [latitude, longitude];
        setUserLocation(location);
        setStatus(
          `Location found: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
        );
        fetchAttractions(latitude, longitude);
      },
      (err) => {
        setError(
          "Unable to retrieve your location. Please enable location permissions."
        );
        setStatus("Location error: " + err.message);
        setLoadingFind(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

   const handleSearch = () => {
    console.log("handleSearch callled");
    setLoadingSearch(true);
  setError(null);
  setAttractions([]);
  setSelectedPlace(null);
  setStatus("Locating...");

  if (!navigator.geolocation) {
    setStatus("Geolocation is not supported");
    setError("Geolocation is not supported by your browser.");
    setLoadingSearch(false);
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      const location = [latitude, longitude];
      setUserLocation(location);
      setStatus(`Location found: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
      fetchAttractions(latitude, longitude)
        .then(() => setLoadingSearch(false))
        .catch((err) => {
          setError("Failed to fetch attractions: " + err.message);
          setLoadingSearch(false);
        });
    },
    (error) => {
      setError("Unable to retrieve your location. Please enable location permissions.");
      setStatus("Location error: " + error.message);
      setLoadingSearch(false);
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
  };

  const fetchAttractions = async (lat, lon) => {
    
    const query = `[out:json][timeout:25];(node["historic"](around:30000,${lat},${lon}););out body;`;

    try {
      const response = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `data=${encodeURIComponent(query)}`,
      });

      if (!response.ok)
        throw new Error(`Network response was not ok (${response.status})`);

      const data = await response.json();
      const formatted = data.elements
        .filter((e) => e.tags && e.tags.name)
        .map((e) => ({
          id: e.id,
          name: e.tags.name,
          position: [e.lat, e.lon],
          type: e.tags.historic || "Historic Site",
          description: e.tags.description || e.tags.wikipedia || null,
          website: e.tags.website || null,
          address: e.tags["addr:street"] || null,
        }))
        .slice(0, 20);

      setAttractions(formatted);
      setStatus(
        formatted.length > 0
          ? `Found ${formatted.length} historical places`
          : "No historical places found within 5km."
      );
    } catch (err) {
      setError(
        "Failed to fetch attractions. The service might be temporarily unavailable."
      );
      setStatus("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  // Animation state for header
  const [headerVisible, setHeaderVisible] = useState(false);
  const headerRef = useRef(null);

  // Theme detection effect
  useEffect(() => {
    const checkTheme = () => {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      setIsDarkMode(currentTheme === "dark");
    };

    checkTheme();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "data-theme"
        ) {
          checkTheme();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const animateHeading = () => {
      if (!headerRef.current) return;
      const rect = headerRef.current.getBoundingClientRect();
      const screenPosition = window.innerHeight / 1.3;
      if (rect.top < screenPosition) {
        headerRef.current.classList.add("animate");
      }
    };
    window.addEventListener("scroll", animateHeading);
    animateHeading();

    const animateOnScroll = () => {
      const elementsToAnimate = [
        { selector: ".tourist-places-container", threshold: 1.3 },
        { selector: ".tp-sidebar", threshold: 1.3 },
        { selector: ".tp-list-grid", threshold: 1.3 },
        { selector: ".tp-list-card", threshold: 1.3 },
      ];

      elementsToAnimate.forEach((element) => {
        const els = document.querySelectorAll(element.selector);
        els.forEach((el, index) => {
          const elementPosition = el.getBoundingClientRect().top;
          const screenPosition = window.innerHeight / element.threshold;

          if (elementPosition < screenPosition) {
            const delay =
              element.selector === ".tp-list-card" ? index * 100 : 0;
            setTimeout(() => {
              el.classList.add("animate");
            }, delay);
          }
        });
      });
    };

    setTimeout(() => {
      window.addEventListener("scroll", animateOnScroll, { passive: true });
      animateOnScroll();
    }, 200);

    return () => {
      window.removeEventListener("scroll", animateOnScroll);
    };
  }, []);

  return (
    <>
      <div
        className={`main-content font-sans ${isDarkMode ? "dark-theme" : ""
          }`}
        style={{ position: "relative" }}
      >
        <style jsx>{`
        /* Clean Modern Variables */
        :root {
          --blue-50: #eff6ff;
          --blue-100: #dbeafe;
          --blue-500: #3b82f6;
          --blue-600: #2563eb;
          --blue-700: #1d4ed8;
          
          --gray-50: #f8fafc;
          --gray-100: #f1f5f9;
          --gray-200: #e2e8f0;
          --gray-300: #cbd5e1;
          --gray-400: #94a3b8;
          --gray-500: #64748b;
          --gray-600: #475569;
          --gray-700: #334155;
          --gray-800: #1e293b;
          --gray-900: #0f172a;
        }

        .main-content {
          min-height: 100vh;
          background: var(--gray-50);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        /* Hero Section - Clean & Simple */
        .hero-section {
          position: relative;
          height: 60vh;
          min-height: 400px;
          background: linear-gradient(135deg, var(--blue-600), var(--blue-700));
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero-video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.3;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          text-align: center;
          padding: 0 24px;
          max-width: 600px;
        }

        .hero-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 40px 32px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .hero-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(black);
          margin-bottom: 16px;
          line-height: 1.2;
        }

        .hero-subtitle {
          color: var(--gray-600);
          font-size: 1.125rem;
          margin-bottom: 32px;
          line-height: 1.6;
        }

        .hero-button {
          background: #82aae9ff;
          color: black;
          border: 2px solid #5f8edaff;
          padding: 14px 28px;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 0 2px #457dd6ff;
        }

        .hero-button:hover {
          transform: translateY(-1px);
        }

        .hero-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        /* Main Container */
        .tourist-places-container {
  display: flex;
  width: 100%;
  max-width: 1200px; /* wider for breathing room */
  margin: -40px auto 0;
  padding: 0 20px 40px;
  gap: 24px;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease;
}

.tourist-places-container.animate {
  opacity: 1;
  transform: translateY(0);
}

/* Sidebar */
.tp-sidebar {
  flex: 1;
  background: white;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.sidebar-header {
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
}

.sidebar-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.status-text {
  font-size: 0.9rem;
  color: #6b7280;
  margin-top: 4px;
}

.list-places {
  max-height: 500px;
  overflow-y: auto;
  padding: 16px;
}

.list-places::-webkit-scrollbar {
  width: 6px;
}
.list-places::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.tp-list-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
  list-style: none;
  margin: 0;
  padding: 0;
}

/* Modern Card */
.tp-list-card {
  background: #f9fafb;
  border-radius: 10px;
  padding: 12px 14px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.tp-list-card:hover {
  background: #f3f4f6;
}

.tp-list-card.selected {
  background: #e0f2fe;
}

.place-header {
  display: flex;
  gap: 14px; /* more gap between map & text */
  align-items: flex-start;
  margin-bottom: 8px; /* space between header and meta */
}

.place-map-container {
  width: 60px; /* slightly bigger map preview */
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.place-map-container iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.place-info {
  flex: 1;
}

.place-title {
  font-size: 1.05rem; /* slightly bigger for readability */
  font-weight: 600;
  color: #111827;
  margin: 0 0 4px 0; /* bottom space before meta */
}

.place-meta {
  font-size: 0.85rem;
  color: #6b7280;
  margin-top: 4px; /* more space from title */
}

.directions-link {
  display: inline-flex;
  align-items: center;
  gap: 6px; /* more space between icon & text */
  font-size: 0.85rem;
  font-weight: 500;
  color: #2563eb;
  text-decoration: none;
  margin-top: 10px; /* space from meta info */
}

.directions-link:hover {
  text-decoration: underline;
}

/* Map Area */
.tp-map-area {
  flex: 1;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  background: white;
}

        /* States - Clean & Simple */
        .error-alert {
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-left: 4px solid #ef4444;
          color: #dc2626;
          padding: 12px 16px;
          border-radius: 8px;
          margin: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.875rem;
        }

        .loading-state,
        .empty-state {
          text-align: center;
          padding: 32px 16px;
          color: var(--gray-500);
        }

        .empty-state {
          background: var(--gray-50);
          border: 1px dashed var(--gray-300);
          border-radius: 8px;
          margin: 16px;
        }

        .loading-spinner {
          color: var(--blue-500);
          margin-bottom: 8px;
        }

        /* Responsive - Simplified */
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2rem;
          }
          
          .hero-card {
            padding: 24px 20px;
          }

          .tourist-places-container {
            flex-direction: column;
            margin-top: -20px;
            padding: 0 16px 32px;
          }

          .tp-sidebar {
            flex: none;
            max-width: none;
          }

          .tp-map-area {
            min-height: 400px;
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 1.75rem;
          }

          .tp-list-card {
            padding: 12px;
          }

          .place-map-container {
            width: 50px;
            height: 50px;
          }
        }

        /* Dark Theme - Simplified */
        .dark-theme .main-content {
          background: var(--gray-900);
        }

        .dark-theme .hero-card {
          background: rgba(30, 41, 59, 0.95);
        }

        .dark-theme .hero-title {
          color: white;
        }

        .dark-theme .hero-subtitle {
          color: var(--gray-300);
        }

        .dark-theme .tp-sidebar {
          background: var(--gray-800);
          border-color: var(--gray-700);
        }

        .dark-theme .sidebar-header {
          background: var(--gray-700);
          border-color: var(--gray-600);
        }

        .dark-theme .sidebar-title {
          color: white;
        }

        .dark-theme .status-text {
          color: var(--gray-400);
        }

        .dark-theme .tp-list-card {
          background: var(--gray-700);
          border-color: var(--gray-600);
          color: white;
        }

        .dark-theme .tp-list-card:hover {
          border-color: var(--blue-400);
        }

        .dark-theme .tp-list-card.selected {
          background: var(--gray-600);
          border-color: var(--blue-500);
        }

        .dark-theme .place-title {
          color: white;
        }

        .dark-theme .place-type-badge {
          background: var(--blue-900);
          color: var(--blue-200);
        }

        .dark-theme .tp-map-area {
          background: var(--gray-800);
          border-color: var(--gray-700);
        }

        .dark-theme .empty-state {
          background: var(--gray-800);
          border-color: var(--gray-600);
          color: var(--gray-400);
        }
          }

          .tp-map-area {
            width: 100%;
            min-height: 500px;
          }
        }

        @media (max-width: 768px) {
          .hero-content {
            padding: 80px 16px 60px;
          }

          .hero-card {
            padding: 32px 24px;
            border-radius: 20px;
          }

          .hero-title {
            font-size: 2.25rem;
          }

          .hero-subtitle {
            font-size: 1.1rem;
          }

          .tourist-places-container {
            padding: 0 16px 40px;
            margin-top: -30px;
          }

          .tp-list-card {
            padding: 16px;
          }

          .place-header {
            gap: 12px;
          }

          .place-map-container {
            width: 60px;
            height: 60px;
          }

          .place-title {
            font-size: 1rem;
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 2rem;
          }

          .hero-button {
            padding: 14px 24px;
            font-size: 1rem;
          }

          .place-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .place-map-container {
            align-self: center;
            width: 70px;
            height: 70px;
          }

          .place-actions {
            width: 100%;
          }
          

          .directions-link {
            flex: 1;
            justify-content: center;
          }
        }

        /* Dark Theme */
        .dark-theme {
          --glass-bg: rgba(15, 23, 42, 0.8);
          --glass-border: rgba(148, 163, 184, 0.2);
        }

        .dark-theme .main-content {
          background: linear-gradient(135deg, var(--neutral-900) 0%, var(--primary-900) 100%);
        }

        .dark-theme .tp-sidebar {
          background: rgba(30, 41, 59, 0.9);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(148, 163, 184, 0.2);
        }

        .dark-theme .sidebar-header {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(30, 41, 59, 0.8));
          border-color: rgba(148, 163, 184, 0.2);
        }

        .dark-theme .sidebar-title {
          color: var(--neutral-100);
        }

        .dark-theme .status-text {
          color: var(--neutral-300);
        }

        .dark-theme .tp-list-card {
          background: rgba(30, 41, 59, 0.6);
          border-color: rgba(148, 163, 184, 0.2);
          color: var(--neutral-100);
        }

        .dark-theme .tp-list-card:hover {
          background: rgba(30, 41, 59, 0.8);
          border-color: var(--primary-400);
        }

        .dark-theme .tp-list-card.selected {
          background: rgba(59, 130, 246, 0.2);
          border-color: var(--primary-400);
        }

        .dark-theme .place-title {
          color: var(--neutral-100);
        }

        .dark-theme .place-type-badge {
          background: rgba(59, 130, 246, 0.2);
          color: var(--primary-300);
          border-color: var(--primary-400);
        }

        .dark-theme .place-distance {
          color: var(--neutral-400);
        }

        .dark-theme .tp-map-area {
          background: rgba(30, 41, 59, 0.9);
          border-color: rgba(148, 163, 184, 0.2);
        }

        .dark-theme .error-alert {
          background: rgba(239, 68, 68, 0.1);
          border-color: rgba(239, 68, 68, 0.3);
          color: #fca5a5;
        }

        .dark-theme .empty-state {
          background: rgba(30, 41, 59, 0.4);
          border-color: rgba(148, 163, 184, 0.3);
          color: var(--neutral-400);
        }
      `}</style>
        <div className="hero-section">
          <video
            className="hero-video"
            autoPlay
            loop
            muted
            playsInline
          >
            <source
              src="https://videos.pexels.com/video-files/5243307/5243307-hd_1280_720_25fps.mp4"
              type="video/mp4"
            />
          </video>
          <div className="hero-overlay"></div>
          <div className="hero-content" ref={headerRef}>
            <div className="hero-card">
              <h1 className="hero-title">Historical Places Explorer</h1>
              <p className="hero-subtitle">
                Discover fascinating historical landmarks and cultural sites near you.
                Explore centuries of history right in your neighborhood.
              </p>

              <input
                type="text"
                placeholder="Search for a place..."
                className="hero-search-input"
              />
            
              <button
                onClick={handleFindAttractions}
                disabled={loadingFind}
                className="hero-button"
              >
                {loadingFind ? (
                  <>
                    <FiLoader className="animate-spin" size={20} />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <FiCompass size={20} />
                    <span>Find Places Near Me</span>

                  </>
                )}
              </button>
              &nbsp; &nbsp; &nbsp; &nbsp;
              <button
                onClick={handleSearch}
                disabled={loadingSearch}
                className="hero-button"
              >
                {loadingSearch ? (
                  <>
                    <FiLoader className="animate-spin" size={20} />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <FiCompass size={20} />
                    <span>Search</span>

                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="tourist-places-container">
          {/* Sidebar */}
          <div className="tp-sidebar">
            <div className="sidebar-header">
              <h2 className="sidebar-title">
                <FiNavigation /> Nearby Places
              </h2>
              <p className="status-text">{status}</p>
            </div>

            {error && (
              <div className="error-alert">
                <FiAlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            <div className="list-places">
              {loading && attractions.length === 0 && (
                <div className="loading-state">
                  <FiLoader className="loading-spinner animate-spin" size={32} />
                  <p>Discovering historical places near you...</p>
                </div>
              )}

              {!loading && attractions.length === 0 && !error && (
                <div className="empty-state">
                  <FiMapPin
                    size={48}
                    style={{
                      margin: "0 auto 16px",
                      display: "block",
                      color: "var(--neutral-400)"
                    }}
                  />
                  <p><strong>No places found yet</strong></p>
                  <p>Click the search button above to find historical places near your location.</p>
                </div>
              )}

              <ul className="tp-list-grid">
                {attractions.map((place, index) => (
                  <li key={place.id}>
                    <div
                      className={`tp-list-card${selectedPlace?.id === place.id ? " selected" : ""
                        }`}
                      onClick={() => setSelectedPlace(place)}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="place-header">
                        <div className="place-map-container">
                          <iframe
                            title={place.name}
                            width="80"
                            height="80"
                            frameBorder="0"
                            src={`https://www.openstreetmap.org/export/embed.html?bbox=${place.position[1] - 0.005
                              }%2C${place.position[0] - 0.005}%2C${place.position[1] + 0.005
                              }%2C${place.position[0] + 0.005}&layer=mapnik&marker=${place.position[0]
                              }%2C${place.position[1]}`}
                            allowFullScreen=""
                            loading="lazy"
                          />
                          <span className="map-pin-icon">
                            <FiMapPin size={16} />
                          </span>
                        </div>

                        <div className="place-info">
                          <h3 className="place-title">{place.name}</h3>
                          <div className="place-meta">
                            <span className="place-type-badge">
                              {place.type.replace(/_/g, " ")}
                            </span>
                            <span className="place-distance">
                              ◦ Historic Site
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="place-actions">
                        <a
                          className="directions-link"
                          href={`https://www.google.com/maps/search/?api=1&query=${place.position[0]},${place.position[1]}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FiExternalLink size={16} />
                          Get Directions
                        </a>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
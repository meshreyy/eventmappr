import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import gpsIcon from '../../assets/gps.png';

const HeroSection = () => {
  useEffect(() => {
    // Initialize Leaflet map
    const initMap = () => {
      if (!window.L) return; // Exit if Leaflet is not loaded
      
      // Create map centered on a default location
      const map = window.L.map('preview-map').setView([40.7128, -74.0060], 13);
      
      // Add OpenStreetMap tile layer
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      
      // Sample event data
      const events = [
        
        { lat: 40.7128, lng: -74.0060, title: "Tech Meetup", category: "tech" },
        { lat: 40.7200, lng: -73.9950, title: "Jazz Concert", category: "music" },
        { lat: 40.7080, lng: -74.0100, title: "Community Cleanup", category: "volunteer" },
        { lat: 40.7150, lng: -74.0200, title: "Farmers Market", category: "market" },
        { lat: 40.7220, lng: -74.0000, title: "Art Exhibition", category: "art" }
      ];
      
      // Custom marker icons for different categories
      const icons = {
        tech: window.L.divIcon({
          html: '<i class="fas fa-laptop-code" style="color: #38BDF8;"></i>',
          className: 'event-marker tech-marker',
          iconSize: [30, 30]
        }),
        music: window.L.divIcon({
          html: '<i class="fas fa-music" style="color: #FF6B6B;"></i>',
          className: 'event-marker music-marker',
          iconSize: [30, 30]
        }),
        volunteer: window.L.divIcon({
          html: '<i class="fas fa-hands-helping" style="color: #4CAF50;"></i>',
          className: 'event-marker volunteer-marker',
          iconSize: [30, 30]
        }),
        market: window.L.divIcon({
          html: '<i class="fas fa-store" style="color: #FACC15;"></i>',
          className: 'event-marker market-marker',
          iconSize: [30, 30]
        }),
        art: window.L.divIcon({
          html: '<i class="fas fa-palette" style="color: #9C27B0;"></i>',
          className: 'event-marker art-marker',
          iconSize: [30, 30]
        })
      };
      
      // Add markers for each event
      events.forEach(event => {
        const marker = window.L.marker([event.lat, event.lng], {
          icon: icons[event.category]
        }).addTo(map);
        
        marker.bindPopup(`<b>${event.title}</b>`);
      });
      
      // Add click event to add new markers
      map.on('click', function(e) {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        console.log(`New event at: ${lat}, ${lng}`);
        
        // For demo purposes, add a marker when clicking
        const marker = window.L.marker([lat, lng], {
          icon: icons.tech
        }).addTo(map);
        
        marker.bindPopup('<b>New Event</b><br>Click to edit').openPopup();
      });

      // Add center button functionality
      document.querySelector('.center-button-js')?.addEventListener('click', () => {
        if (!navigator.geolocation) {
          alert("Unable to retrieve your location.");
          return;
        }
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLat = position.coords.latitude || undefined;
            const userLng = position.coords.longitude || undefined;
            map.setView([userLat, userLng], 13);
          },
          () => {
            alert("Unable to retrieve your location.");
          }
        );
      });
    };

    // Initialize map after component mounts
    setTimeout(initMap, 100); // Small delay to ensure DOM is ready
    
    // Cleanup function
    return () => {
      // Cleanup Leaflet map if needed
    };
  }, []);

  return (
    <section className="hero">
      <div className="hero-content">
        <h1>EventMappr</h1>
        <p className="tagline">Pin Your City's Pulse</p>
        <p className="description">Discover and share local events on an interactive map</p>
        <Link to="/explore" className="cta-button">Explore Events</Link>
      </div>
      <div className="hero-image">
        <div id="preview-map"></div>
        <button className="center-button-css center-button-js">
          <img className="gps-icon" src={gpsIcon} alt="Center" />
        </button>
      </div>
    </section>
  );
};

export default HeroSection; 
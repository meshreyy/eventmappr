import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Client-side only imports
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

let L = null;

// Client-only wrapper component
const ClientOnly = ({ children }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
};

// Enhanced scroll-based animations
const animateOnScroll = () => {
  // Animate the section itself
  const section = document.querySelector('.contact-section');
  if (section) {
    const sectionPosition = section.getBoundingClientRect().top;
    const screenPosition = window.innerHeight / 1.3;
    if (sectionPosition < screenPosition && !section.classList.contains('animate')) {
      section.classList.add('animate');
    }
  }
  console.log('animateOnScroll called');
  // Stagger all elements in a single sequence
  let delay = 0;
  const delayStep = 150;

  // Heading
  const heading = document.querySelector('.contact-heading');
  if (heading) {
    const elementPosition = heading.getBoundingClientRect().top;
    const screenPosition = window.innerHeight / 1.3;
    if (elementPosition < screenPosition && !heading.classList.contains('animate')) {
      setTimeout(() => {
        heading.classList.add('animate');
      }, delay);
      delay += delayStep;
    }
  }

  // Info cards
  const infoCards = document.querySelectorAll('.info-card');
  infoCards.forEach((el) => {
    const elementPosition = el.getBoundingClientRect().top;
    const screenPosition = window.innerHeight / 1.3;
    if (elementPosition < screenPosition && !el.classList.contains('animate')) {
      setTimeout(() => {
        el.classList.add('animate');
      }, delay);
      delay += delayStep;
    }
  });

  // Social links
  const socialLinks = document.querySelectorAll('.social-link');
  socialLinks.forEach((el) => {
    const elementPosition = el.getBoundingClientRect().top;
    const screenPosition = window.innerHeight / 1.3;
    if (elementPosition < screenPosition && !el.classList.contains('animate')) {
      setTimeout(() => {
        el.classList.add('animate');
      }, delay);
      delay += delayStep;
    }
  });

  // Contact form
  const contactForm = document.querySelector('.contact-form-container');
  if (contactForm) {
    const elementPosition = contactForm.getBoundingClientRect().top;
    const screenPosition = window.innerHeight / 1.3;
    if (elementPosition < screenPosition && !contactForm.classList.contains('animate')) {
      setTimeout(() => {
        contactForm.classList.add('animate');
      }, delay);
      delay += delayStep;
    }
  }

  // Map
  const mapContainer = document.querySelector('.map-container-full');
  if (mapContainer) {
    const elementPosition = mapContainer.getBoundingClientRect().top;
    const screenPosition = window.innerHeight / 1.3;
    if (elementPosition < screenPosition && !mapContainer.classList.contains('animate')) {
      setTimeout(() => {
        mapContainer.classList.add('animate');
      }, delay);
      // delay += delayStep; // not needed after last
    }
  }
};

if (typeof window !== 'undefined') {
  // Load leaflet only on client side
  L = require('leaflet');
  
  // Fix default icon issue for leaflet in React
  if (L && L.Icon && L.Icon.Default) {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
      iconUrl: require('leaflet/dist/images/marker-icon.png'),
      shadowUrl: require('leaflet/dist/images/marker-shadow.png')
    });
  }

  // Initialize AOS
  AOS.init({
    duration: 800,
    once: true,
    offset: 100,
    easing: 'ease-out-cubic'
  });
}

const markerIcon = L && new L.Icon({
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const ContactSection = () => {
  useEffect(() => {
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Call once on mount
    return () => window.removeEventListener('scroll', animateOnScroll);
  }, []);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    error: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus({
        submitted: true,
        error: true
      });
      return;
    }
    
    // In a real app, you would send the form data to a server here
    console.log('Form submitted:', formData);
    
    // Reset form and show success message
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    
    setFormStatus({
      submitted: true,
      error: false
    });
    
    // Reset status after 5 seconds
    setTimeout(() => {
      setFormStatus({
        submitted: false,
        error: false
      });
    }, 5000);
  };

  return (
    <section className="contact-section" id="contact">
      <div className="container">
        {/* HERO SECTION (two columns) */}
        <div className="contact-hero-row">
          <div className="contact-hero-content" data-aos="fade-right" data-aos-duration="900">
            <h2 className="contact-heading" data-aos="fade-right">Contact Us</h2>
            <p className="contact-hero-intro" data-aos="fade-right" data-aos-delay="100">
              Have questions, suggestions, or want to collaborate? Our team is here to help you. Reach out to us and we'll respond as soon as possible.
            </p>
          </div>
          <div className="contact-hero-image" data-aos="fade-left" data-aos-delay="150">
            <img src="https://wanakaanimation.com/wp-content/uploads/2023/02/76817-contact-us.gif" alt="Contact Us" style={{width: '100%', maxWidth: 380, borderRadius: '16px', boxShadow: '0 4px 32px rgba(0,0,0,0.08)'}} />
          </div>
        </div>
        {/* END HERO SECTION */}
        <div className="contact-container">
          <div className="contact-info-row" data-aos="fade-right">
  <div className="info-card" data-aos="fade-up" data-aos-delay="100">
    <div className="info-icon">✉️</div>
    <h3>Email Us</h3>
    <p>Our friendly team is here to help.</p>
    <a href="mailto:info@eventmappr.com">info@eventmappr.com</a>
  </div>
  <div className="info-card" data-aos="fade-up" data-aos-delay="200">
    <div className="info-icon">📞</div>
    <h3>Call Us</h3>
    <p>Mon-Fri from 8am to 5pm.</p>
    <a href="tel:+15551234567">(555) 123-4567</a>
  </div>
  <div className="info-card" data-aos="fade-up" data-aos-delay="300">
    <div className="info-icon">📍</div>
    <h3>Visit Us</h3>
    <p>Come say hello at our office.</p>
    <address>123 Event St, San Francisco, CA 94101</address>
  </div>
</div>
<div className="social-links" data-aos="fade-up" data-aos-delay="400">
              <a href="https://facebook.com/eventmappr" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="social-link">
                 <FaFacebookF size={25} />
              </a>
              <a href="https://twitter.com/eventmappr" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="social-link">
                <FaTwitter  size={25}/>
              </a>
              <a href="https://instagram.com/eventmappr" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-link">

                  <FaInstagram  size={25} />

                  <svg class="size-6" xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24"><path fill="currentColor" d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3"></path></svg>

              </a>
              <a href="https://linkedin.com/company/eventmappr" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="social-link">
                   <FaLinkedinIn size={25} />
              </a>
            </div>
          </div>
          
          <div className="contact-form-container" data-aos="fade-left">
            <h2>Send Us a Message</h2>
            <p>Have questions or suggestions? Fill out the form below and we'll get back to you as soon as possible.</p>
            
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input 
                  type="text" 
                  id="subject" 
                  name="subject" 
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea 
                  id="message" 
                  name="message" 
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  required
                  rows="5"
                ></textarea>
              </div>
              
              <button type="submit" className="btn-submit">
                <span>Send Message</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
              
              {formStatus.submitted && (
                <div className={`form-message ${formStatus.error ? 'error' : 'success'}`}>
                  {formStatus.error 
                    ? 'Please fill out all required fields.' 
                    : 'Message sent successfully! We\'ll get back to you soon.'}
                </div>
              )}
            </form>
          </div>
        </div>
      
      {/* Office Location Map Section */}
      <ClientOnly>
        {markerIcon && (
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '48px 0 0 0' }}>
            <div style={{ width: '100%', maxWidth: '1200px', padding: '0 1rem' }}>
              <h2 style={{ textAlign: 'center', marginBottom: '18px', fontWeight: 700, fontSize: '2rem' }}>Office Location</h2>
              <div className="map-container-full responsive-map">
                <MapContainer
                  center={[37.7825, -122.416389]} 
                  zoom={15}
                  style={{ height: '350px', width: '100%' }}
                  scrollWheelZoom={false}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[37.7825, -122.416389]} icon={markerIcon}>
                    <Popup>
                      123 Event St, San Francisco, CA 94101
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          </div>
        )}
      </ClientOnly>
  

      <style jsx>{`
        .contact-section {
          padding: 5rem 0;
          background-color: var(--background);
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

      .contact-section.animate {
        opacity: 1;
        transform: translateY(0);
      }

      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
      }

      .contact-container {
        display: grid;
        grid-template-columns: 1fr 1.5fr;
        gap: 4rem;
        align-items: flex-start;
      }

      .contact-info-row {
        display: flex;
        flex-direction: row;
        gap: 2rem;
        justify-content: space-between;
        margin-bottom: 2.5rem;
      }
      @media (max-width: 900px) {
        .contact-info-row {
          flex-direction: column;
          gap: 1.5rem;
        }
      }
      .info-card {
        background: #fff;
        padding: 2.5rem 1.5rem;
        border-radius: 18px;
        border: 2.5px solid #b3b8c2;
        box-shadow: 0 4px 24px rgba(0,0,0,0.10);
        flex: 1 1 0%;
        min-width: 240px;
        max-width: 350px;
        margin: 0 0.5rem 1.5rem 0.5rem;
        display: flex;
        flex-direction: column;
      }
      .contact-info-row {
        background: #f3f6fa;
        border-radius: 22px;
        padding: 2rem 0.5rem;
      }
        align-items: center;
        text-align: center;
        transition: transform 0.22s cubic-bezier(.4,0,.2,1), box-shadow 0.22s cubic-bezier(.4,0,.2,1);
      }
      .info-card:hover {
        transform: translateY(-8px) scale(1.035);
        box-shadow: 0 8px 32px rgba(0,0,0,0.14);
        border-color: #b3b8c2;
      }
      .info-card:hover {
        transform: translateY(-6px) scale(1.03);
        box-shadow: 0 4px 32px rgba(0,0,0,0.13);
      }

      .info-card:hover {
        transform: translateY(-5px);
      }

      .info-icon {
        font-size: 2rem;
        margin-bottom: 1rem;
        color: var(--primary);
      }

      .info-card h3 {
        color: var(--text);
        margin-bottom: 0.75rem;
      }

      .info-card p {
        color: var(--text-muted);
        margin-bottom: 1rem;
      }

      .info-card a {
        color: var(--primary);
        text-decoration: none;
        font-weight: 500;
      }

      .info-card a:hover {
        text-decoration: underline;
      }

      .social-links {
        display: flex;
        gap: 1.5rem;
        margin-top: 2rem;
      }

      .social-link {
        color: var(--text);
        font-size: 1.5rem;
        transition: color 0.3s ease;
      }

      .social-link:hover {
        color: var(--primary);
      }

      .contact-form-container {
        background: var(--card-bg);
        padding: 2.5rem;
        border-radius: 12px;
        box-shadow: var(--shadow);
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .contact-form-container.animate {
        opacity: 1;
        transform: translateY(0);
      }

      .contact-form-container h2 {
        color: var(--text);
        margin-bottom: 1rem;
        font-size: 1.8rem;
      }

      .contact-form-container p {
        color: var(--text-muted);
        margin-bottom: 2rem;
        line-height: 1.6;
      }

      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
        margin-bottom: 2rem;
      }

      .form-group {
        margin-bottom: 1.5rem;
      }

      label {
        display: block;
        margin-bottom: 0.5rem;
        color: var(--text);
      }

      input, textarea {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid var(--border);
        border-radius: 6px;
        background: var(--input-bg);
        color: var(--text);
        transition: border-color 0.3s ease;
      }

      input:focus, textarea:focus {
        outline: none;
        border-color: var(--primary);
      }

      textarea {
        resize: vertical;
        min-height: 150px;
      }

      .btn-submit {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
        width: 100%;
        padding: 1rem;
        background: var(--primary);
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      .btn-submit:hover {
        background: var(--primary-dark);
      }

      .form-message {
        margin-top: 1.5rem;
        padding: 1rem;
        border-radius: 6px;
        text-align: center;
      }

      .form-message.success {
        background: var(--success-bg);
        color: var(--success);
      }

      .form-message.error {
        background: var(--error-bg);
        color: var(--error);
      }

      @media (max-width: 768px) {
        .contact-container {
          grid-template-columns: 1fr;
        }

        .form-row {
          grid-template-columns: 1fr;
        }

        .contact-form-container {
          padding: 1.5rem;
        }
      }

      .map-container-full {
        width: 100%;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 2px 16px rgba(0,0,0,0.10);
      }
      @media (max-width: 768px) {
        @media (max-width: 992px) {
          .contact-container {
            grid-template-columns: 1fr;
          }
          
          .contact-info {
            order: 2;
          }
          
          .contact-form-container {
            order: 1;
          }
        }
        
        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }
        
        .map-container-full {
          width: 100%;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 2px 16px rgba(0,0,0,0.10);
        }
        @media (max-width: 768px) {
          .map-container-full {
            border-radius: 8px;
          }
          .responsive-map :global(.leaflet-container) {
            height: 220px !important;
          }
        }
      .info-card,
      .social-link,
      .contact-form-container,
      .map-container-full {
        opacity: 1 !important;
        transform: none !important;
        transition: opacity 0.8s cubic-bezier(0.4,0,0.2,1), transform 0.8s cubic-bezier(0.4,0,0.2,1);
      }
      .container,
      .contact-container,
      .contact-info,
      .contact-section {
        display: block !important;
        height: auto !important;
        min-height: 100px !important;
        opacity: 1 !important;
        visibility: visible !important;
      }
        .contact-heading {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          text-align: center;
          margin-bottom: 2.5rem;
        }
        .contact-heading.animate {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </section>
  );
};

export default ContactSection; 
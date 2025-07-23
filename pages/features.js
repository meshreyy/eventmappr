import React, { useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/layout/Layout';
import FeaturesSection from '../components/sections/FeaturesSection';
import Link from 'next/link';
import AOS from 'aos';
import { initAOS } from '../utils/aos-config';

const FeaturesPage = () => {
  useEffect(() => {
    initAOS();
  }, []);

  return (
    <>
      <Head>
        <title>Features | EventMappr</title>
        <meta name="description" content="Discover all the powerful features that make EventMappr the best platform for finding and sharing local events." />
      </Head>
      <Layout>
        <div className="features-page">
          <div className="features-header" data-aos="fade-up">
            <div className="container">
              <h1 data-aos="fade-up" data-aos-delay="200">EventMappr Features</h1>
              <p data-aos="fade-up" data-aos-delay="400">Discover the tools that make finding and sharing local events easier than ever</p>
            </div>
          </div>
          
          <div className="container">
            <FeaturesSection data-aos="fade-up" data-aos-delay="600" />
            
            <div className="additional-features">
              <h2>More Powerful Features</h2>
              
              <div className="features-grid" data-aos="fade-up">
                <div className="feature-card" data-aos="fade-up" data-aos-delay="200">
                  <div className="feature-icon">🔍</div>
                  <h3>Advanced Search</h3>
                  <p>Find events by location, date, category, or keywords to discover exactly what you're looking for.</p>
                </div>
                
                <div className="feature-card" data-aos="fade-up" data-aos-delay="200">
                  <div className="feature-icon">📱</div>
                  <h3>Mobile Optimized</h3>
                  <p>Access EventMappr on any device with our responsive design that works seamlessly on desktop and mobile.</p>
                </div>
                
                <div className="feature-card" data-aos="fade-up" data-aos-delay="200">
                  <div className="feature-icon">🔔</div>
                  <h3>Event Notifications</h3>
                  <p>Get notified about upcoming events that match your interests so you never miss out.</p>
                </div>
                
                <div className="feature-card" data-aos="fade-up" data-aos-delay="200">
                  <div className="feature-icon">👥</div>
                  <h3>Community Building</h3>
                  <p>Connect with like-minded individuals in your area who share your interests and passions.</p>
                </div>
                
                <div className="feature-card" data-aos="fade-up" data-aos-delay="200">
                  <div className="feature-icon">📊</div>
                  <h3>Event Analytics</h3>
                  <p>Track attendance and engagement for events you create to improve future gatherings.</p>
                </div>
                
                <div className="feature-card" data-aos="fade-up" data-aos-delay="200">
                  <div className="feature-icon">🔄</div>
                  <h3>Recurring Events</h3>
                  <p>Easily set up and manage recurring events without having to recreate them each time.</p>
                </div>
              </div>
            </div>
            
            <div className="features-cta">
              <div className="cta-content">
                <h2>Ready to explore events near you?</h2>
                <p>Join thousands of users who are discovering local events every day with EventMappr.</p>
                <div className="cta-buttons">
                  <Link href="/explore" legacyBehavior>
                    <span className="cta-btn primary-btn">Open Map</span>
                  </Link>
                  <Link href="/how-it-works" legacyBehavior>
                    <span className="cta-btn secondary-btn">Learn How It Works</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
      <style jsx>{`
        .features-page {
          min-height: 100vh;
        }
        
        .features-header {
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          color: white;
          padding: 8rem 0 4rem;
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .features-header h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        
        .features-header p {
          font-size: 1.2rem;
          max-width: 600px;
          margin: 0 auto;
          opacity: 0.9;
        }
        
        .additional-features {
          margin: 5rem 0;
        }
        
        .additional-features h2 {
          text-align: center;
          font-size: 2.2rem;
          margin-bottom: 3rem;
          position: relative;
        }
        
        .additional-features h2::after {
          content: '';
          position: absolute;
          bottom: -15px;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 4px;
          background: linear-gradient(90deg, var(--primary) 0%, var(--primary-light) 100%);
          border-radius: 2px;
        }
        
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }
        
        .feature-card {
          background: var(--background);
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border: 1px solid var(--border);
        }
        
        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          border-color: var(--primary-light);
        }
        
        .feature-icon {
          font-size: 2.5rem;
          margin-bottom: 1.5rem;
          display: inline-block;
        }
        
        .feature-card h3 {
          font-size: 1.4rem;
          margin-bottom: 1rem;
          color: var(--text);
        }
        
        .feature-card p {
          color: var(--text-light);
          line-height: 1.6;
        }
        
        .features-cta {
          background: var(--background-alt);
          border-radius: 12px;
          padding: 4rem 2rem;
          margin: 5rem 0;
          text-align: center;
        }
        
        .cta-content h2 {
          font-size: 2rem;
          margin-bottom: 1rem;
          color: var(--text);
        }
        
        .cta-content p {
          font-size: 1.1rem;
          color: var(--text-light);
          max-width: 600px;
          margin: 0 auto 2rem;
        }
        
        .cta-buttons {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
        }
        
        .cta-btn {
          display: inline-block;
          padding: 1rem 2rem;
          border-radius: 30px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .primary-btn {
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          color: white;
          box-shadow: 0 8px 20px rgba(var(--primary-rgb), 0.3);
        }
        
        .primary-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 25px rgba(var(--primary-rgb), 0.4);
        }
        
        .secondary-btn {
          background: var(--background);
          color: var(--text);
          border: 1px solid var(--border);
        }
        
        .secondary-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
        }
        
        @media (max-width: 768px) {
          .features-header {
            padding: 6rem 0 3rem;
          }
          
          .features-header h1 {
            font-size: 2.5rem;
          }
          
          .additional-features h2 {
            font-size: 1.8rem;
          }
          
          .cta-buttons {
            flex-direction: column;
            gap: 1rem;
            max-width: 300px;
            margin: 0 auto;
          }
        }
      `}</style>
    </>
  );
};

export default FeaturesPage; 
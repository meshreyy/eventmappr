import React from 'react';
import Head from 'next/head';
import Layout from '../components/layout/Layout';
import Image from 'next/image';
import Link from 'next/link';

const HowItWorksPage = () => {
  const steps = [
    {
      id: 1,
      title: 'Discover Events',
      description: 'Browse the interactive map to find events happening in your area. Filter by categories to find events that match your interests.',
      icon: '🗺️'
    },
    {
      id: 2,
      title: 'Create an Account',
      description: 'Sign up for a free account to add your own events and save your favorites for later.',
      icon: '👤'
    },
    {
      id: 3,
      title: 'Add Your Events',
      description: 'Click on the map to add your own events. Include all the details to help others discover what you\'re organizing.',
      icon: '📌'
    },
    {
      id: 4,
      title: 'Connect with Others',
      description: 'Attend events, meet new people, and build your community network. Share events with friends to grow attendance.',
      icon: '🤝'
    }
  ];

  return (
    <>
      <Head>
        <title>How It Works | EventMappr</title>
        <meta name="description" content="Learn how to use EventMappr to discover and share local events in your community." />
      </Head>
      <Layout>
        <div className="how-it-works-page">
          <div className="how-it-works-header">
            <div className="container">
              <h1>How EventMappr Works</h1>
              <p>Your guide to discovering and sharing local events</p>
            </div>
          </div>
          
          <div className="container">
            <div className="steps-container">
              {steps.map((step) => (
                <div className="step-card" key={step.id}>
                  <div className="step-icon">{step.icon}</div>
                  <div className="step-number">Step {step.id}</div>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-description">{step.description}</p>
                </div>
              ))}
            </div>
            
            <div className="features-overview">
              <div className="features-content">
                <h2>Powerful Features</h2>
                <p>EventMappr makes it easy to discover and share events in your community with these powerful features:</p>
                
                <ul className="features-list">
                  <li>
                    <span className="feature-icon">🌍</span>
                    <div className="feature-text">
                      <h4>Interactive Map</h4>
                      <p>Visualize events happening around you with our easy-to-use map interface.</p>
                    </div>
                  </li>
                  <li>
                    <span className="feature-icon">🔍</span>
                    <div className="feature-text">
                      <h4>Advanced Filtering</h4>
                      <p>Find exactly what you're looking for with category and date filters.</p>
                    </div>
                  </li>
                  <li>
                    <span className="feature-icon">📱</span>
                    <div className="feature-text">
                      <h4>Mobile Friendly</h4>
                      <p>Access EventMappr on any device, anywhere, anytime.</p>
                    </div>
                  </li>
                  <li>
                    <span className="feature-icon">🔔</span>
                    <div className="feature-text">
                      <h4>Event Notifications</h4>
                      <p>Get notified about upcoming events that match your interests.</p>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="features-image">
                <div className="image-wrapper">
                  <Image 
                    src="/images/gps.png" 
                    alt="EventMappr interface showing map with event pins" 
                    width={500} 
                    height={400}
                    className="feature-img"
                    style={{ width: "auto" }}
                  />
                </div>
              </div>
            </div>
            
            <div className="cta-section">
              <h2>Ready to Get Started?</h2>
              <p>Join thousands of users who are already discovering and sharing events in their communities.</p>
              <div className="cta-buttons">
                <Link href="/explore" legacyBehavior>
                  <span className="cta-btn primary-btn">Explore the Map</span>
                </Link>
                <Link href="/auth" legacyBehavior>
                  <span className="cta-btn secondary-btn">Create Account</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Layout>
      <style jsx>{`
        .how-it-works-page {
          min-height: 100vh;
        }
        
        .how-it-works-header {
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          color: white;
          padding: 8rem 0 4rem;
          text-align: center;
        }
        
        .how-it-works-header h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        
        .how-it-works-header p {
          font-size: 1.2rem;
          max-width: 600px;
          margin: 0 auto;
          opacity: 0.9;
        }
        
        .steps-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin: -4rem auto 4rem;
          position: relative;
          z-index: 10;
        }
        
        .step-card {
          background: var(--background);
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          text-align: center;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .step-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
        }
        
        .step-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }
        
        .step-number {
          display: inline-block;
          background: var(--primary-light);
          color: white;
          padding: 0.3rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        
        .step-title {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: var(--text);
        }
        
        .step-description {
          color: var(--text-light);
          line-height: 1.6;
        }
        
        .features-overview {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: center;
          margin: 5rem 0;
        }
        
        .features-content h2 {
          font-size: 2rem;
          margin-bottom: 1rem;
          color: var(--text);
        }
        
        .features-content > p {
          font-size: 1.1rem;
          color: var(--text-light);
          margin-bottom: 2rem;
          line-height: 1.6;
        }
        
        .features-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .features-list li {
          display: flex;
          align-items: flex-start;
          margin-bottom: 1.5rem;
        }
        
        .feature-icon {
          font-size: 1.5rem;
          margin-right: 1rem;
          background: var(--background-alt);
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          flex-shrink: 0;
        }
        
        .feature-text h4 {
          margin: 0 0 0.5rem;
          font-size: 1.2rem;
          color: var(--text);
        }
        
        .feature-text p {
          margin: 0;
          color: var(--text-light);
          line-height: 1.5;
        }
        
        .image-wrapper {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
        }
        
        :global(.feature-img) {
          width: 100%;
          height: auto;
          display: block;
          border-radius: 12px;
          transition: transform 0.5s ease;
        }
        
        .image-wrapper:hover :global(.feature-img) {
          transform: scale(1.03);
        }
        
        .cta-section {
          text-align: center;
          padding: 4rem 0;
          margin: 3rem 0;
          background: var(--background-alt);
          border-radius: 12px;
        }
        
        .cta-section h2 {
          font-size: 2rem;
          margin-bottom: 1rem;
          color: var(--text);
        }
        
        .cta-section p {
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
        
        @media (max-width: 992px) {
          .features-overview {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          
          .features-image {
            order: -1;
          }
        }
        
        @media (max-width: 768px) {
          .how-it-works-header {
            padding: 6rem 0 3rem;
          }
          
          .how-it-works-header h1 {
            font-size: 2.5rem;
          }
          
          .steps-container {
            margin-top: -2rem;
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

export default HowItWorksPage; 
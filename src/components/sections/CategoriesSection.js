import React, { useEffect } from 'react';

const CategoriesSection = () => {
  useEffect(() => {
    // Animation on scroll
    const animateOnScroll = () => {
      const elements = document.querySelectorAll('.category-item');
      
      elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (elementPosition < screenPosition) {
          element.classList.add('animate');
        }
      });
    };
      
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on load
    
    return () => {
      window.removeEventListener('scroll', animateOnScroll);
    };
  }, []);

  return (
    <section className="categories" id="categories">
      <h2>Explore by Category</h2>
      <div className="category-container">
        <div className="category-item music">
          <i className="fas fa-music"></i>
          <span>Music</span>
        </div>
        <div className="category-item tech">
          <i className="fas fa-laptop-code"></i>
          <span>Tech</span>
        </div>
        <div className="category-item volunteer">
          <i className="fas fa-hands-helping"></i>
          <span>Volunteering</span>
        </div>
        <div className="category-item market">
          <i className="fas fa-store"></i>
          <span>Market</span>
        </div>
        <div className="category-item art">
          <i className="fas fa-palette"></i>
          <span>Art</span>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection; 
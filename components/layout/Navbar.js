import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { NAV_ITEMS, ROUTES } from '../../utils/routes';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);

    if (!localStorage.getItem('theme')) localStorage.setItem('theme', 'dark');

    // Check for saved theme preference
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        setIsDarkMode(true);
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    }

    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // Initial scroll position check
    handleScroll();

    window.addEventListener('scroll', handleScroll);

    // Ensure navbar is visible by forcing a reflow
    const navbarElement = document.querySelector('.navbar');
    if (navbarElement) {
      // Force a reflow
      void navbarElement.offsetHeight;

      // Add a class to ensure visibility
      navbarElement.classList.add('navbar-visible');
    }

    // Check if Firebase is initialized
    try {
      const auth = getAuth();
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
      });

      return () => {
        window.removeEventListener('scroll', handleScroll);
        unsubscribe();
      };
    } catch (error) {
      console.error("Firebase auth not initialized yet");
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSignOut = async () => {
    try {
      const auth = getAuth();
      await auth.signOut();
      router.push('/');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const toggleTheme = () => {
    const newTheme = !isDarkMode ? 'dark' : 'light';
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleSignIn = () => {
    router.push(ROUTES.AUTH);
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [router.pathname]);

  // Don't render until after client-side hydration
  if (!mounted) {
    return null;
  }

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''} ${isDarkMode ? 'dark' : ''}`}>
      <div className="navbar-blur"></div>
      <div className="container navbar-container">
        <Link href={ROUTES.HOME}>
          <span className="logo flex items-center space-x-2">
            {/* <img src="/logg.svg" alt="EventMappr Logo" className="block dark:hidden h-8 w-auto" /> */}

            <img src={isDarkMode ? '/loggd.svg' : '/logg.svg'} alt="EventMappr Logo" className="hidden dark:block h-8 w-auto" style={{ width: '200px' }} />

            <img src="/loggd.svg" alt="EventMappr Logo" className="h-8 w-auto" style={{ width: '400px' }} />
          </span>
        </Link>


        <div className={`mobile-toggle ${isOpen ? 'active' : ''}`} onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <ul className={`nav-links ${isOpen ? 'active' : ''}`}>
          {/* Navigation Items from utils */}
          {NAV_ITEMS.map((item, index) => (
            <li key={index}>
              <Link href={item.path}>
                <span className={router.pathname === item.path ? 'active' : ''}>
                  {item.name}
                </span>
              </Link>
            </li>
          ))}

          {/* Currency Converter */}
          <li>
            <Link href="/currency-converter">
              <span className={router.pathname === '/currency-converter' ? 'active' : ''}>
                <i className="fas fa-coins" style={{ marginRight: '6px' }} />
                Currency Converter
              </span>
            </Link>
          </li>

          {/* Nearby */}
          <li>
            <Link href="/nearby">
              <span className={router.pathname === '/nearby' ? 'active' : ''}>
                Nearby
              </span>
            </Link>
          </li>

          {/* Theme toggle */}
          <li className="theme-toggle">
            <button onClick={toggleTheme} aria-label="Toggle theme" className="theme-btn">
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </li>

          {/* Conditional Auth Links */}
          {user ? (
            <>
              <li className="profile-link">
                <Link href={ROUTES.PROFILE}>
                  <span className={router.pathname === ROUTES.PROFILE ? 'active' : ''}>
                    Profile
                  </span>
                </Link>
              </li>
              <li>
                <button onClick={handleSignOut} className="btn-sign-out">
                  Sign Out
                </button>
              </li>
            </>
          ) : (
            <li className="auth-link">
              <button onClick={handleSignIn} className="btn-sign-in">
                <span className="btn-text">Sign In</span>
                <span className="btn-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                    <polyline points="10 17 15 12 10 7"></polyline>
                    <line x1="15" y1="12" x2="3" y2="12"></line>
                  </svg>
                </span>
              </button>
            </li>
          )}
        </ul>

      </div>
      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: auto;
          min-height: 60px;
          z-index: 1000;
          padding: 0.8rem 0;
          transition: all 0.3s ease;
          will-change: transform;
          opacity: 1;
          visibility: visible;
          transition-delay: 0.1s;
        }
        
        .navbar-blur {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          backdrop-filter: blur(var(--navbar-blur));
          -webkit-backdrop-filter: blur(var(--navbar-blur));
          background: ${isDarkMode
          ? 'linear-gradient(to bottom, rgba(18, 18, 24, 0.75), rgba(18, 18, 24, 0.65))'
          : 'linear-gradient(to bottom, rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0.65))'};
          border-bottom: 1px solid ${isDarkMode
          ? 'rgba(255, 255, 255, 0.05)'
          : 'rgba(0, 0, 0, 0.05)'};
          z-index: -1;
        }
        
        .navbar.dark {
          color: #fff;
        }
        
        .navbar.scrolled {
          padding: 0.5rem 0;
        }
        
        .navbar.scrolled .navbar-blur {
          box-shadow: 0 4px 30px ${isDarkMode
          ? 'rgba(0, 0, 0, 0.3)'
          : 'rgba(0, 0, 0, 0.1)'};
          background: ${isDarkMode
          ? 'linear-gradient(to bottom, rgba(18, 18, 24, 0.8), rgba(18, 18, 24, 0.75))'
          : 'linear-gradient(to bottom, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.75))'};
        }
        
        .navbar-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 1.5rem;
          position: relative;
          height: 100%;
        }
        
        .logo {
          display: flex;
          align-items: center;
          cursor: pointer;
          position: relative;
          z-index: 2;
          text-decoration: none;
          flex-shrink: 0;
  max-width: 160px;
  overflow: hidden;
        }
        
        .logo-icon {
          font-size: 1.5rem;
          margin-right: 0.5rem;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
          transition: transform 0.3s ease;
        }
        
        .logo:hover .logo-icon {
          transform: scale(1.1) rotate(5deg);
        }
        
        .logo-text {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text);
          background: ${isDarkMode
          ? 'linear-gradient(to right, #fff, #ccc)'
          : 'linear-gradient(to right, var(--primary), var(--primary-dark))'};
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-fill-color: transparent;
          transition: all 0.3s ease;
        }
        
        .navbar.dark .logo-text {
          background: linear-gradient(to right, #fff, #ccc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-fill-color: transparent;
        }
        
        .nav-links {
           display: flex;
           align-items: center;
           list-style: none;
           margin: 0;
           padding: 0;
           position: relative;
         z-index: 2;
          
  
        }
        
        .nav-links li {
          margin-left: 2rem;
          position: relative;
        }
        
        .nav-links li a {
          color: var(--text);
          font-weight: 500;
          transition: color 0.2s ease;
          padding: 0.5rem 0;
          position: relative;
          text-decoration: none;
          display: block;
        }
        
        .nav-links li a::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(to right, var(--primary), var(--primary-light));
          transition: width 0.3s ease;
          border-radius: 2px;
        }
        
        .nav-links li a:hover::after,
        .nav-links li a.active::after {
          width: 100%;
        }
        
        .navbar.dark .nav-links li a {
          color: #fff;
        }
        
        .nav-links li a:hover,
        .nav-links li a.active {
          color: var(--primary);
        }
        
        .navbar.dark .nav-links li a:hover,
        .navbar.dark .nav-links li a.active {
          color: var(--primary-light);
        }
        
        .theme-toggle {
          display: flex;
          align-items: center;
        }
        
        .theme-btn {
          background: none;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          background-color: ${isDarkMode
          ? 'rgba(255, 255, 255, 0.1)'
          : 'rgba(0, 0, 0, 0.05)'};
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
        }
        
        .theme-btn:hover {
          transform: rotate(15deg);
          background-color: ${isDarkMode
          ? 'rgba(255, 255, 255, 0.2)'
          : 'rgba(0, 0, 0, 0.1)'};
        }
        
        .btn-sign-in {
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          color: white;
          padding: 0.5rem 1.25rem;
          border: none;
          border-radius: 30px;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 10px rgba(var(--primary-rgb), 0.3);
          position: relative;
          overflow: hidden;
        }
        
        .btn-sign-in::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 50%);
          transform: translateX(-100%) rotate(45deg);
          transition: transform 0.6s ease;
        }
        
        .btn-sign-in:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(var(--primary-rgb), 0.4);
        }
        
        .btn-sign-in:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.3);
        }
        
        .btn-sign-in:hover::before {
          transform: translateX(100%) rotate(45deg);
        }
        
        .btn-text {
          margin-right: 0.5rem;
        }
        
        .btn-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s ease;
        }
        
        .btn-sign-in:hover .btn-icon {
          transform: translateX(3px);
        }
        
        .btn-sign-out {
          background: none;
          border: 1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'};
          color: var(--text);
          padding: 0.5rem 1.25rem;
          border-radius: 30px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .navbar.dark .btn-sign-out {
          color: #fff;
        }
        
        .btn-sign-out:hover {
          background-color: ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
          transform: translateY(-2px);
        }
        
        .mobile-toggle {
          display: none;
          flex-direction: column;
          justify-content: space-between;
          width: 30px;
          height: 21px;
          cursor: pointer;
          z-index: 10;
        }
        
        .mobile-toggle span {
          display: block;
          width: 100%;
          height: 3px;
          background-color: var(--text);
          border-radius: 3px;
          transition: all 0.3s ease;
        }
        
        .navbar.dark .mobile-toggle span {
          background-color: #fff;
        }
        
        @media (max-width: 768px) {
          .mobile-toggle {
            display: flex;
          }
          
          .nav-links {
            position: fixed;
            top: 0;
            right: -100%;
            width: 80%;
            max-width: 300px;
            height: 100vh;
            flex-direction: column;
            justify-content: center;
            background: ${isDarkMode
          ? 'rgba(18, 18, 24, 0.95)'
          : 'rgba(255, 255, 255, 0.95)'};
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            padding: 2rem;
            transition: right 0.3s ease;
            box-shadow: -5px 0 30px rgba(0, 0, 0, 0.1);
          }
          
          .nav-links.active {
            right: 0;
          }
          
          .nav-links li {
            margin: 1.5rem 0;
            width: 100%;
            text-align: center;
          }
          
          .nav-links li a {
            display: block;
            padding: 0.5rem 0;
          }
          
          .mobile-toggle.active span:nth-child(1) {
            transform: translateY(9px) rotate(45deg);
          }
          
          .mobile-toggle.active span:nth-child(2) {
            opacity: 0;
          }
          
          .mobile-toggle.active span:nth-child(3) {
            transform: translateY(-9px) rotate(-45deg);
          }
          
          .btn-sign-in {
            width: 100%;
            margin-top: 1rem;
            justify-content: center;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar; 
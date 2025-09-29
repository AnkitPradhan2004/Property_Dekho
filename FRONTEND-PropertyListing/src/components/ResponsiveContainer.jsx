import { useState, useEffect } from 'react';

const ResponsiveContainer = ({ children, className = '' }) => {
  const [screenSize, setScreenSize] = useState('desktop');
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      
      if (width < 480) {
        setScreenSize('mobile-xs');
        setIsMobile(true);
        setIsTablet(false);
      } else if (width < 640) {
        setScreenSize('mobile');
        setIsMobile(true);
        setIsTablet(false);
      } else if (width < 768) {
        setScreenSize('mobile-lg');
        setIsMobile(true);
        setIsTablet(false);
      } else if (width < 1024) {
        setScreenSize('tablet');
        setIsMobile(false);
        setIsTablet(true);
      } else if (width < 1280) {
        setScreenSize('desktop');
        setIsMobile(false);
        setIsTablet(false);
      } else {
        setScreenSize('desktop-lg');
        setIsMobile(false);
        setIsTablet(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div 
      className={`responsive-container ${className}`}
      data-screen-size={screenSize}
      data-is-mobile={isMobile}
      data-is-tablet={isTablet}
    >
      {children}
    </div>
  );
};

export default ResponsiveContainer;


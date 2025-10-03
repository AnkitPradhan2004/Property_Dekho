import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Home, Heart, Scale, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FloatingMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();
  const { user } = useAuth();

  const menuItems = [
    {
      icon: Home,
      label: 'Browse',
      action: () => navigate('/browse'),
      color: 'bg-orange-600 hover:bg-orange-700'
    },
    {
      icon: Heart,
      label: 'Favorites',
      action: () => {
        if (!user) {
          navigate('/login');
          return;
        }
        navigate('/dashboard');
        setTimeout(() => {
          const favoritesTab = document.querySelector('[data-tab="favorites"]');
          favoritesTab?.click();
        }, 100);
      },
      color: 'bg-red-500 hover:bg-red-600'
    },
    {
      icon: Scale,
      label: 'Compare',
      action: () => {
        if (!user) {
          navigate('/login');
          return;
        }
        navigate('/dashboard');
        setTimeout(() => {
          const comparisonsTab = document.querySelector('[data-tab="comparisons"]');
          comparisonsTab?.click();
        }, 100);
      },
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      icon: Filter,
      label: 'Filter',
      action: () => {
        // Find and click the filter button
        const filterButton = document.querySelector('button.lg\\:hidden');
        if (filterButton && filterButton.textContent.includes('Filter')) {
          filterButton.click();
        }
      },
      color: 'bg-purple-500 hover:bg-purple-600'
    }
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <motion.div 
      className="fixed bottom-6 right-6 z-50"
      drag
      dragMomentum={false}
      dragElastic={0.1}
      dragConstraints={{
        left: -window.innerWidth + 100,
        right: 0,
        top: -window.innerHeight + 100,
        bottom: 0
      }}
      style={{ x: position.x, y: position.y }}
      onDragEnd={(event, info) => {
        setPosition({ x: info.offset.x, y: info.offset.y });
      }}
    >
      {/* Menu Items */}
      <AnimatePresence>
        {isOpen && (
          <>
            {menuItems.map((item, index) => {
              const angle = (index * 45) + 135; // Simple arc starting from top-left
              const radius = 60;
              const x = Math.cos((angle * Math.PI) / 180) * radius;
              const y = Math.sin((angle * Math.PI) / 180) * radius;

              return (
                <motion.button
                  key={item.label}
                  initial={{ scale: 0, x: 0, y: 0 }}
                  animate={{ 
                    scale: 1, 
                    x: x, 
                    y: y 
                  }}
                  exit={{ scale: 0, x: 0, y: 0 }}
                  transition={{ 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                  }}
                  onClick={() => {
                    item.action();
                    setIsOpen(false);
                  }}
                  className={`absolute bottom-0 right-0 w-10 h-10 ${item.color} text-white rounded-full shadow-lg flex items-center justify-center transition-colors z-50 pointer-events-auto`}
                  title={item.label}
                >
                  <item.icon className="w-4 h-4" />
                </motion.button>
              );
            })}
          </>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        onClick={toggleMenu}
        className="w-12 h-12 bg-orange-600 hover:bg-orange-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors cursor-grab active:cursor-grabbing"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: isOpen ? 45 : 0 }}
        transition={{ duration: 0.2 }}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
      </motion.button>
    </motion.div>
  );
};

export default FloatingMenu;
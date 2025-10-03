import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Search, Filter, Heart, Map } from 'lucide-react';

const FloatingActionButton = ({ 
  onSearchClick,
  onFilterClick,
  onFavoritesClick,
  onMapClick,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    {
      icon: Search,
      label: 'Search',
      onClick: onSearchClick,
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      icon: Filter,
      label: 'Filters',
      onClick: onFilterClick,
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      icon: Heart,
      label: 'Favorites',
      onClick: onFavoritesClick,
      color: 'bg-red-500 hover:bg-red-600'
    },
    {
      icon: Map,
      label: 'Map',
      onClick: onMapClick,
      color: 'bg-purple-500 hover:bg-purple-600'
    }
  ];

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="mb-4 space-y-3"
          >
            {actions.map((action, index) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, x: 50, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 50, scale: 0.8 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-end"
              >
                <motion.span
                  className="mr-3 px-3 py-1 bg-gray-800 text-white text-sm rounded-full whitespace-nowrap"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ delay: index * 0.1 + 0.1 }}
                >
                  {action.label}
                </motion.span>
                <motion.button
                  onClick={() => {
                    action.onClick?.();
                    setIsOpen(false);
                  }}
                  className={`w-12 h-12 ${action.color} text-white rounded-full shadow-lg flex items-center justify-center transition-colors`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <action.icon className="w-6 h-6" />
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 ${
          isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
        } text-white rounded-full shadow-lg flex items-center justify-center transition-colors`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: isOpen ? 45 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isOpen ? 'close' : 'plus'}
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
          </motion.div>
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default FloatingActionButton;



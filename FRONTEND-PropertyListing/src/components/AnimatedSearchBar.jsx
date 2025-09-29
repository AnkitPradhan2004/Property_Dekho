import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Filter, MapPin } from 'lucide-react';

const AnimatedSearchBar = ({ 
  value, 
  onChange, 
  onSubmit, 
  placeholder = "Search properties...",
  showFilters = false,
  onFilterClick,
  className = ""
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isFocused) {
      setIsExpanded(true);
    } else if (!value) {
      setIsExpanded(false);
    }
  }, [isFocused, value]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(value);
  };

  const clearSearch = () => {
    onChange('');
    inputRef.current?.focus();
  };

  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSubmit} className="relative">
        <motion.div
          className={`relative bg-white rounded-lg shadow-sm border-2 transition-all duration-300 ${
            isFocused 
              ? 'border-blue-500 shadow-lg' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
          animate={{
            scale: isFocused ? 1.02 : 1,
            boxShadow: isFocused 
              ? '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
              : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
          }}
        >
          <div className="flex items-center">
            <motion.div
              className="pl-4 pr-2"
              animate={{ scale: isFocused ? 1.1 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <Search className={`w-5 h-5 transition-colors ${
                isFocused ? 'text-blue-500' : 'text-gray-400'
              }`} />
            </motion.div>

            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              className="flex-1 py-3 pr-4 text-gray-900 placeholder-gray-500 focus:outline-none bg-transparent"
            />

            <AnimatePresence>
              {value && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={clearSearch}
                  className="p-1 mr-2 text-gray-400 hover:text-gray-600 transition-colors"
                  type="button"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              )}
            </AnimatePresence>

            {showFilters && (
              <motion.button
                type="button"
                onClick={onFilterClick}
                className="p-3 mr-2 text-gray-400 hover:text-blue-500 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Filter className="w-5 h-5" />
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Search suggestions overlay */}
        <AnimatePresence>
          {isFocused && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
            >
              <div className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>Popular searches:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['Apartments in NYC', 'Houses in LA', 'Condos in Miami', 'Townhouses in Chicago'].map((suggestion) => (
                      <motion.button
                        key={suggestion}
                        onClick={() => onChange(suggestion)}
                        className="px-3 py-1 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 rounded-full text-sm transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {suggestion}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </motion.div>
  );
};

export default AnimatedSearchBar;



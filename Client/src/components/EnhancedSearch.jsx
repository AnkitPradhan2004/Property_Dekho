import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Home, DollarSign, X, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EnhancedSearch = ({ onSearch, onFilterChange, initialFilters = {} }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    location: '',
    ...initialFilters
  });
  const [showFilters, setShowFilters] = useState(false);
  const searchRef = useRef(null);

  // Mock suggestions data
  const mockSuggestions = [
    { type: 'location', value: 'New York, NY', icon: MapPin },
    { type: 'location', value: 'Los Angeles, CA', icon: MapPin },
    { type: 'location', value: 'Chicago, IL', icon: MapPin },
    { type: 'location', value: 'Miami, FL', icon: MapPin },
    { type: 'property', value: 'Modern Downtown Apartment', icon: Home },
    { type: 'property', value: 'Luxury Penthouse', icon: Home },
    { type: 'property', value: 'Spacious Family House', icon: Home },
    { type: 'property', value: 'Executive Office Space', icon: Home },
  ];

  useEffect(() => {
    if (searchQuery.length > 2) {
      const filtered = mockSuggestions.filter(item =>
        item.value.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 6));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch({ query: searchQuery, ...filters });
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.value);
    setShowSuggestions(false);
    onSearch({ query: suggestion.value, ...filters });
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      type: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      location: ''
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main Search Bar */}
      <div className="relative" ref={searchRef}>
        <form onSubmit={handleSearch} className="relative">
          <div className="flex items-center bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by location, property name, or features..."
                className="w-full pl-12 pr-4 py-4 text-gray-900 placeholder-gray-500 focus:outline-none"
              />
            </div>
            
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`hidden md:block px-4 py-4 border-l border-gray-200 hover:bg-gray-50 transition-colors ${
                hasActiveFilters ? 'text-orange-600 bg-orange-50' : 'text-gray-600'
              }`}
            >
              <Filter className="w-5 h-5" />
            </button>
            
            <button
              type="submit"
              className="px-6 py-4 bg-orange-600 text-white hover:bg-orange-700 transition-colors font-medium"
            >
              Search
            </button>
          </div>
        </form>

        {/* Search Suggestions */}
        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden"
            >
              {suggestions.map((suggestion, index) => {
                const Icon = suggestion.icon;
                return (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                  >
                    <Icon className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{suggestion.value}</span>
                    <span className="ml-auto text-xs text-gray-500 capitalize">
                      {suggestion.type}
                    </span>
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Property Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Type
                  </label>
                  <select
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Any Type</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="office">Office</option>
                  </select>
                </div>

                {/* Min Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Price
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      placeholder="0"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Max Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Price
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      placeholder="Any"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bedrooms
                  </label>
                  <select
                    value={filters.bedrooms}
                    onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                    <option value="5">5+</option>
                  </select>
                </div>
              </div>

              {/* Location Filter */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    placeholder="Enter city, neighborhood, or address"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Quick Filters */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Quick Filters
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Under $300K', filter: { maxPrice: '300000' } },
                    { label: '$300K - $500K', filter: { minPrice: '300000', maxPrice: '500000' } },
                    { label: 'Over $500K', filter: { minPrice: '500000' } },
                    { label: 'New Listings', filter: { sortBy: 'newest' } },
                    { label: 'Price: Low to High', filter: { sortBy: 'price_asc' } },
                    { label: 'Price: High to Low', filter: { sortBy: 'price_desc' } },
                  ].map((quickFilter, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        const newFilters = { ...filters, ...quickFilter.filter };
                        setFilters(newFilters);
                        onFilterChange(newFilters);
                      }}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      {quickFilter.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-3 flex flex-wrap gap-2">
          {Object.entries(filters).map(([key, value]) => {
            if (!value) return null;
            return (
              <span
                key={key}
                className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full"
              >
                {key === 'type' && 'Type: '}
                {key === 'minPrice' && 'Min: $'}
                {key === 'maxPrice' && 'Max: $'}
                {key === 'bedrooms' && 'Beds: '}
                {key === 'location' && 'Location: '}
                {value}
                <button
                  onClick={() => handleFilterChange(key, '')}
                  className="ml-1 hover:text-orange-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EnhancedSearch;
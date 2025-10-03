import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, TrendingUp, MapPin, DollarSign, Star, ArrowRight, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { propertyAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PropertyCard from './PropertyCard';
import toast from 'react-hot-toast';

const AISuggestions = ({ onClose, isOpen }) => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState({
    budget: { min: 0, max: 1000000 },
    location: '',
    propertyType: '',
    bedrooms: 0,
    amenities: []
  });
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock AI suggestions based on user preferences
  const { data: suggestions = [], isLoading, refetch } = useQuery({
    queryKey: ['ai-suggestions', preferences],
    queryFn: async () => {
      setIsGenerating(true);
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock AI suggestions based on preferences
      try {
        const mockSuggestions = await propertyAPI.getProperties({
          type: preferences.propertyType || undefined,
          minPrice: preferences.budget.min || undefined,
          maxPrice: preferences.budget.max || undefined,
          city: preferences.location || undefined,
          bedrooms: preferences.bedrooms || undefined,
          amenities: preferences.amenities.join(',') || undefined,
          limit: 6
        }).then(res => res.data.properties);
        
        setIsGenerating(false);
        return mockSuggestions;
      } catch (error) {
        console.error('Failed to fetch AI suggestions:', error);
        setIsGenerating(false);
        throw new Error('Failed to generate suggestions');
      }

    },
    enabled: isOpen && !!user,
  });

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setPreferences(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const generateSuggestions = () => {
    refetch();
    toast.success('Generating AI-powered suggestions...');
  };

  const amenities = [
    'Pool', 'Garden', 'Garage', 'Elevator', 'Balcony', 'Terrace',
    'Air Conditioning', 'Heating', 'Security', 'Gym', 'Parking'
  ];

  const propertyTypes = [
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'office', label: 'Office' }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">AI Property Suggestions</h2>
                  <p className="text-blue-100">Get personalized property recommendations</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row h-[calc(90vh-120px)]">
            {/* Preferences Panel */}
            <div className="lg:w-80 bg-gray-50 p-6 overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Preferences</h3>
              
              {/* Budget Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Budget Range
                </label>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Min Price</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        placeholder="Min"
                        value={preferences.budget.min}
                        onChange={(e) => handlePreferenceChange('budget', {
                          ...preferences.budget,
                          min: parseInt(e.target.value) || 0
                        })}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Max Price</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        placeholder="Max"
                        value={preferences.budget.max}
                        onChange={(e) => handlePreferenceChange('budget', {
                          ...preferences.budget,
                          max: parseInt(e.target.value) || 1000000
                        })}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Preferred Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="City or Area"
                    value={preferences.location}
                    onChange={(e) => handlePreferenceChange('location', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Property Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Property Type
                </label>
                <select
                  value={preferences.propertyType}
                  onChange={(e) => handlePreferenceChange('propertyType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Any Type</option>
                  {propertyTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bedrooms */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Bedrooms
                </label>
                <select
                  value={preferences.bedrooms}
                  onChange={(e) => handlePreferenceChange('bedrooms', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={0}>Any</option>
                  <option value={1}>1+</option>
                  <option value={2}>2+</option>
                  <option value={3}>3+</option>
                  <option value={4}>4+</option>
                  <option value={5}>5+</option>
                </select>
              </div>

              {/* Amenities */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Must-Have Amenities
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {amenities.map(amenity => (
                    <button
                      key={amenity}
                      onClick={() => handleAmenityToggle(amenity)}
                      className={`flex items-center gap-2 p-2 rounded-lg border text-sm transition-colors ${
                        preferences.amenities.includes(amenity)
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                        preferences.amenities.includes(amenity)
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {preferences.amenities.includes(amenity) && (
                          <div className="w-2 h-2 bg-white rounded-sm"></div>
                        )}
                      </div>
                      <span className="truncate">{amenity}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={generateSuggestions}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate AI Suggestions</span>
                  </>
                )}
              </button>
            </div>

            {/* Results Panel */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  AI Recommendations
                </h3>
                {suggestions.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <TrendingUp className="w-4 h-4" />
                    <span>Based on your preferences</span>
                  </div>
                )}
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">AI is analyzing your preferences...</p>
                  </div>
                </div>
              ) : suggestions.length === 0 ? (
                <div className="text-center py-12">
                  <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No suggestions yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Set your preferences and generate AI-powered recommendations
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {suggestions.map((property, index) => (
                    <motion.div
                      key={property._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <PropertyCard
                        property={property}
                        viewMode="grid"
                        isFavorite={false}
                        isInComparison={false}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AISuggestions;


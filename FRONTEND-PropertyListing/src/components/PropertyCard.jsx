import { useState } from 'react';
import { Link } from "react-router-dom";
import { Heart, Scale, MapPin, Bed, Bath, Square, Calendar, Eye, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import toast from 'react-hot-toast';
import AnimatedCard from './AnimatedCard';
import AnimatedSkeleton from './AnimatedSkeleton';

const PropertyCard = ({ property, viewMode = 'grid', onToggleFavorite, onToggleComparison, isFavorite = false, isInComparison = false }) => {
  const { user } = useAuth();
  const [imageIndex, setImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please login to save favorites');
      return;
    }

    setIsLoading(true);
    try {
      await userAPI.toggleFavorite(property._id);
      onToggleFavorite?.(property._id);
      toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
    } catch (error) {
      toast.error('Failed to update favorites');
    } finally {
      setIsLoading(false);
    }
  };

  const handleComparison = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please login to compare properties');
      return;
    }

    setIsLoading(true);
    try {
      await userAPI.toggleComparison(property._id);
      onToggleComparison?.(property._id);
      toast.success(isInComparison ? 'Removed from comparison' : 'Added to comparison');
    } catch (error) {
      toast.error('Failed to update comparison');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: property.description,
          url: window.location.origin + `/property/${property._id}`,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.origin + `/property/${property._id}`);
      toast.success('Link copied to clipboard');
    }
  };

  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  if (viewMode === 'list') {
    return (
      <AnimatedCard
        className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden w-full"
        hover={true}
      >
        <div className="flex flex-col sm:flex-row">
          <div className="relative sm:w-80 h-48 sm:h-auto flex-shrink-0">
            {imageLoading && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                <AnimatedSkeleton variant="image" className="w-full h-full" />
              </div>
            )}
            <img 
              src={property.images[imageIndex] || '/placeholder-property.jpg'} 
              alt={property.title} 
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoading ? 'opacity-0' : 'opacity-100'
              }`}
              onLoad={() => setImageLoading(false)}
            />
            {property.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70"
                >
                  ←
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70"
                >
                  →
                </button>
              </>
            )}
            <motion.div 
              className="absolute top-2 left-2 flex gap-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleFavorite}
                disabled={isLoading}
                className={`p-2 rounded-full transition-colors ${
                  isFavorite ? 'bg-red-500 text-white' : 'bg-white bg-opacity-80 text-gray-600 hover:bg-opacity-100'
                } ${isLoading ? 'opacity-50' : ''}`}
              >
                {isLoading ? (
                  <AnimatedSkeleton variant="avatar" className="w-4 h-4" />
                ) : (
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleComparison}
                disabled={isLoading}
                className={`p-2 rounded-full transition-colors ${
                  isInComparison ? 'bg-blue-500 text-white' : 'bg-white bg-opacity-80 text-gray-600 hover:bg-opacity-100'
                } ${isLoading ? 'opacity-50' : ''}`}
              >
                <Scale className={`w-4 h-4 ${isInComparison ? 'fill-current' : ''}`} />
              </motion.button>
            </motion.div>
            <motion.div 
              className="absolute top-2 right-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleShare}
                className="p-2 bg-white bg-opacity-80 text-gray-600 rounded-full hover:bg-opacity-100 transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </motion.button>
            </motion.div>
          </div>
          
          <div className="flex-1 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 line-clamp-1">{property.title}</h3>
              <span className="text-xl sm:text-2xl font-bold text-blue-600">{formatPrice(property.price)}</span>
            </div>
            
            <div className="flex items-center text-gray-600 mb-3">
              <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="text-sm sm:text-base truncate">{property.location.city}, {property.location.region}</span>
            </div>
            
            <p className="text-gray-600 mb-4 line-clamp-2 text-sm sm:text-base">{property.description}</p>
            
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-4">
              <div className="flex items-center text-gray-600">
                <Bed className="w-4 h-4 mr-1 flex-shrink-0" />
                <span className="text-sm sm:text-base">{property.bedrooms || 'N/A'}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Bath className="w-4 h-4 mr-1 flex-shrink-0" />
                <span className="text-sm sm:text-base">{property.bathrooms || 'N/A'}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Square className="w-4 h-4 mr-1 flex-shrink-0" />
                <span className="text-sm sm:text-base">{property.squareFootage ? `${property.squareFootage} sq ft` : 'N/A'}</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center text-xs sm:text-sm text-gray-500">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                <span>Added {formatDate(property.createdAt)}</span>
              </div>
              <Link
                to={`/property/${property._id}`}
                className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base w-full sm:w-auto"
              >
                <Eye className="w-4 h-4" />
                <span className="hidden xs:inline">View Details</span>
                <span className="xs:hidden">View</span>
              </Link>
            </div>
          </div>
        </div>
      </AnimatedCard>
    );
  }

  return (
    <AnimatedCard
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group w-full"
      hover={true}
    >
      <div className="relative">
        {imageLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <AnimatedSkeleton variant="image" className="w-full h-full" />
          </div>
        )}
        <img 
          src={property.images[imageIndex] || '/placeholder-property.jpg'} 
          alt={property.title} 
          className={`w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-all duration-300 ${
            imageLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={() => setImageLoading(false)}
        />
        
        {/* Image Navigation */}
        {property.images.length > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-between p-2"
          >
            <button
              onClick={prevImage}
              className="bg-white bg-opacity-80 text-gray-800 p-2 rounded-full hover:bg-opacity-100 transition-colors"
            >
              ←
            </button>
            <button
              onClick={nextImage}
              className="bg-white bg-opacity-80 text-gray-800 p-2 rounded-full hover:bg-opacity-100 transition-colors"
            >
              →
            </button>
          </motion.div>
        )}
        
        {/* Image Counter */}
        {property.images.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
            {imageIndex + 1}/{property.images.length}
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="absolute top-2 left-2 flex gap-1">
          <button
            onClick={handleFavorite}
            className={`p-2 rounded-full transition-colors ${
              isFavorite ? 'bg-red-500 text-white' : 'bg-white bg-opacity-80 text-gray-600 hover:bg-opacity-100'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleComparison}
            className={`p-2 rounded-full transition-colors ${
              isInComparison ? 'bg-blue-500 text-white' : 'bg-white bg-opacity-80 text-gray-600 hover:bg-opacity-100'
            }`}
          >
            <Scale className={`w-4 h-4 ${isInComparison ? 'fill-current' : ''}`} />
          </button>
        </div>
        
        <div className="absolute top-2 right-2">
          <button
            onClick={handleShare}
            className="p-2 bg-white bg-opacity-80 text-gray-600 rounded-full hover:bg-opacity-100 transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
        
        {/* Property Type Badge */}
        <div className="absolute bottom-2 left-2">
          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full capitalize">
            {property.type}
          </span>
        </div>
      </div>
      
      <div className="p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-1">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 line-clamp-1">{property.title}</h3>
          <span className="text-lg sm:text-xl font-bold text-blue-600">{formatPrice(property.price)}</span>
        </div>
        
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
          <span className="text-xs sm:text-sm truncate">{property.location.city}, {property.location.region}</span>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-3">
          <div className="flex items-center text-gray-600">
            <Bed className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
            <span className="text-xs sm:text-sm">{property.bedrooms || 'N/A'}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Bath className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
            <span className="text-xs sm:text-sm">{property.bathrooms || 'N/A'}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Square className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
            <span className="text-xs sm:text-sm">{property.squareFootage ? `${property.squareFootage} sq ft` : 'N/A'}</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="w-3 h-3 mr-1 flex-shrink-0" />
            <span className="truncate">{formatDate(property.createdAt)}</span>
          </div>
          <Link
            to={`/property/${property._id}`}
            className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium self-start sm:self-auto"
          >
            View Details →
          </Link>
        </div>
      </div>
    </AnimatedCard>
  );
};

export default PropertyCard;

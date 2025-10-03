import { useState, useEffect } from 'react';
import { X, MapPin, Bed, Bath, Square, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ComparisonModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [comparisons, setComparisons] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      fetchComparisons();
    }
  }, [isOpen, user]);

  const fetchComparisons = async () => {
    setLoading(true);
    try {
      const response = await userAPI.getComparisons();
      setComparisons(response.data);
    } catch (error) {
      console.error('Failed to fetch comparisons:', error);
      toast.error('Failed to load comparisons');
    } finally {
      setLoading(false);
    }
  };

  const removeFromComparison = async (propertyId) => {
    try {
      await userAPI.toggleComparison(propertyId);
      setComparisons(prev => prev.filter(p => p._id !== propertyId));
      toast.success('Property removed from comparison');
    } catch (error) {
      console.error('Failed to remove from comparison:', error);
      toast.error('Failed to remove property');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

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
              <div>
                <h2 className="text-2xl font-bold">Property Comparison</h2>
                <p className="text-blue-100">Compare up to 4 properties side by side</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : comparisons.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Square className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No properties to compare
                </h3>
                <p className="text-gray-600">
                  Add properties to comparison from the property listings to see them here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr>
                      <td className="p-4 font-semibold text-gray-700 border-b">Property</td>
                      {comparisons.map((property) => (
                        <td key={property._id} className="p-4 border-b">
                          <div className="relative">
                            <button
                              onClick={() => removeFromComparison(property._id)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <img
                              src={property.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&h=200&fit=crop'}
                              alt={property.title}
                              className="w-full h-32 object-cover rounded-lg mb-2"
                            />
                            <h3 className="font-semibold text-sm">{property.title}</h3>
                          </div>
                        </td>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Price */}
                    <tr>
                      <td className="p-4 font-medium text-gray-700 border-b">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          Price
                        </div>
                      </td>
                      {comparisons.map((property) => (
                        <td key={property._id} className="p-4 border-b">
                          <span className="text-lg font-bold text-green-600">
                            {formatPrice(property.price)}
                          </span>
                        </td>
                      ))}
                    </tr>

                    {/* Location */}
                    <tr>
                      <td className="p-4 font-medium text-gray-700 border-b">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Location
                        </div>
                      </td>
                      {comparisons.map((property) => (
                        <td key={property._id} className="p-4 border-b">
                          <div className="text-sm">
                            {property.location?.city && property.location?.region
                              ? `${property.location.city}, ${property.location.region}`
                              : 'Location not specified'}
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Type */}
                    <tr>
                      <td className="p-4 font-medium text-gray-700 border-b">Type</td>
                      {comparisons.map((property) => (
                        <td key={property._id} className="p-4 border-b">
                          <span className="capitalize bg-gray-100 px-2 py-1 rounded text-sm">
                            {property.type}
                          </span>
                        </td>
                      ))}
                    </tr>

                    {/* Bedrooms */}
                    <tr>
                      <td className="p-4 font-medium text-gray-700 border-b">
                        <div className="flex items-center gap-2">
                          <Bed className="w-4 h-4" />
                          Bedrooms
                        </div>
                      </td>
                      {comparisons.map((property) => (
                        <td key={property._id} className="p-4 border-b">
                          {property.bedrooms || 'N/A'}
                        </td>
                      ))}
                    </tr>

                    {/* Bathrooms */}
                    <tr>
                      <td className="p-4 font-medium text-gray-700 border-b">
                        <div className="flex items-center gap-2">
                          <Bath className="w-4 h-4" />
                          Bathrooms
                        </div>
                      </td>
                      {comparisons.map((property) => (
                        <td key={property._id} className="p-4 border-b">
                          {property.bathrooms || 'N/A'}
                        </td>
                      ))}
                    </tr>

                    {/* Square Footage */}
                    <tr>
                      <td className="p-4 font-medium text-gray-700 border-b">
                        <div className="flex items-center gap-2">
                          <Square className="w-4 h-4" />
                          Square Footage
                        </div>
                      </td>
                      {comparisons.map((property) => (
                        <td key={property._id} className="p-4 border-b">
                          {property.squareFootage ? `${property.squareFootage.toLocaleString()} sq ft` : 'N/A'}
                        </td>
                      ))}
                    </tr>

                    {/* Amenities */}
                    <tr>
                      <td className="p-4 font-medium text-gray-700 border-b">Amenities</td>
                      {comparisons.map((property) => (
                        <td key={property._id} className="p-4 border-b">
                          <div className="flex flex-wrap gap-1">
                            {property.amenities?.length > 0 ? (
                              property.amenities.slice(0, 3).map((amenity, index) => (
                                <span
                                  key={index}
                                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                                >
                                  {amenity}
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-500 text-sm">None listed</span>
                            )}
                            {property.amenities?.length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{property.amenities.length - 3} more
                              </span>
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ComparisonModal;
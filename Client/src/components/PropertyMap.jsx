import { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Layers } from 'lucide-react';

const PropertyMap = ({ properties = [], center = [-74.006, 40.7128], onPropertySelect, selectedProperty }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [mapStyle, setMapStyle] = useState('streets-v11');

  // Fallback map implementation without Mapbox API
  const [selectedMarker, setSelectedMarker] = useState(null);

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.longitude, position.coords.latitude]);
        },
        (error) => console.log('Location access denied')
      );
    }
  }, []);

  const handleMarkerClick = (property) => {
    setSelectedMarker(property._id);
    onPropertySelect?.(property);
  };

  const getPropertyIcon = (type) => {
    switch (type) {
      case 'house': return '🏠';
      case 'apartment': return '🏢';
      case 'office': return '🏢';
      default: return '📍';
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Simple map implementation
  return (
    <div className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden">
      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <button
          onClick={() => setMapStyle(mapStyle === 'streets-v11' ? 'satellite-v9' : 'streets-v11')}
          className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-50"
          title="Toggle map style"
        >
          <Layers className="w-4 h-4" />
        </button>
        {userLocation && (
          <button
            onClick={() => {
              // Center map on user location
              console.log('Center on user location:', userLocation);
            }}
            className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-50"
            title="My location"
          >
            <Navigation className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Fallback Map View */}
      <div className="w-full h-full relative bg-gradient-to-br from-blue-100 to-green-100">
        {/* Map Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ccc" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Property Markers */}
        <div className="absolute inset-0">
          {properties.map((property, index) => {
            const x = 20 + (index % 5) * 15; // Distribute horizontally
            const y = 20 + Math.floor(index / 5) * 15; // Distribute vertically
            
            return (
              <div
                key={property._id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 ${
                  selectedMarker === property._id ? 'scale-125 z-20' : 'hover:scale-110 z-10'
                }`}
                style={{ left: `${x}%`, top: `${y}%` }}
                onClick={() => handleMarkerClick(property)}
              >
                {/* Marker */}
                <div className={`relative ${selectedMarker === property._id ? 'animate-bounce' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg shadow-lg ${
                    selectedMarker === property._id 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-700 border-2 border-blue-500'
                  }`}>
                    {getPropertyIcon(property.type)}
                  </div>
                  
                  {/* Price Tag */}
                  <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded text-xs font-semibold whitespace-nowrap transition-opacity ${
                    selectedMarker === property._id 
                      ? 'bg-blue-600 text-white opacity-100' 
                      : 'bg-white text-gray-700 shadow-md opacity-0 hover:opacity-100'
                  }`}>
                    {formatPrice(property.price)}
                  </div>
                </div>

                {/* Property Info Popup */}
                {selectedMarker === property._id && (
                  <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-xl p-3 min-w-48 z-30">
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rotate-45"></div>
                    
                    {property.images?.[0] && (
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-24 object-cover rounded mb-2"
                      />
                    )}
                    
                    <h3 className="font-semibold text-sm mb-1 line-clamp-2">{property.title}</h3>
                    <p className="text-xs text-gray-600 mb-2">
                      {property.location?.city}, {property.location?.region}
                    </p>
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-green-600">{formatPrice(property.price)}</span>
                      <span className="text-gray-500 capitalize">{property.type}</span>
                    </div>
                    
                    {property.bedrooms && (
                      <div className="mt-2 text-xs text-gray-600">
                        {property.bedrooms} bed • {property.bathrooms} bath
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* User Location Marker */}
        {userLocation && (
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
            style={{ left: '50%', top: '50%' }}
          >
            <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
            <div className="absolute -top-1 -left-1 w-6 h-6 bg-blue-600 rounded-full opacity-25 animate-ping"></div>
          </div>
        )}

        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3 text-xs">
          <div className="font-semibold mb-2">Legend</div>
          <div className="flex items-center gap-2 mb-1">
            <span>🏠</span>
            <span>House</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <span>🏢</span>
            <span>Apartment/Office</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span>Your Location</span>
          </div>
        </div>

        {/* No Properties Message */}
        {properties.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No properties to display on map</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyMap;
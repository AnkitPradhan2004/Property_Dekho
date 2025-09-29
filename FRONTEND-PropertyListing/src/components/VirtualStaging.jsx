import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Palette, Wand2, RotateCcw, Download, Upload, 
  Home, Sofa, Bed, Kitchen, Bath, Car, TreePine,
  ArrowLeft, ArrowRight, X, Check
} from 'lucide-react';

const VirtualStaging = ({ property, isOpen, onClose }) => {
  const [currentRoom, setCurrentRoom] = useState('living');
  const [selectedFurniture, setSelectedFurniture] = useState({});
  const [roomLayout, setRoomLayout] = useState({});
  const [isStaging, setIsStaging] = useState(false);
  const canvasRef = useRef(null);

  const rooms = [
    { id: 'living', name: 'Living Room', icon: Sofa, color: 'bg-blue-100' },
    { id: 'bedroom', name: 'Bedroom', icon: Bed, color: 'bg-pink-100' },
    { id: 'kitchen', name: 'Kitchen', icon: Kitchen, color: 'bg-yellow-100' },
    { id: 'bathroom', name: 'Bathroom', icon: Bath, color: 'bg-green-100' },
    { id: 'garage', name: 'Garage', icon: Car, color: 'bg-gray-100' },
    { id: 'garden', name: 'Garden', icon: TreePine, color: 'bg-emerald-100' }
  ];

  const furnitureCategories = {
    living: [
      { id: 'sofa1', name: 'Modern Sofa', image: '/furniture/sofa1.jpg', category: 'seating' },
      { id: 'coffee_table', name: 'Coffee Table', image: '/furniture/coffee_table.jpg', category: 'tables' },
      { id: 'tv_stand', name: 'TV Stand', image: '/furniture/tv_stand.jpg', category: 'storage' },
      { id: 'lamp1', name: 'Floor Lamp', image: '/furniture/lamp1.jpg', category: 'lighting' },
      { id: 'rug1', name: 'Area Rug', image: '/furniture/rug1.jpg', category: 'decor' }
    ],
    bedroom: [
      { id: 'bed1', name: 'Queen Bed', image: '/furniture/bed1.jpg', category: 'bedding' },
      { id: 'dresser', name: 'Dresser', image: '/furniture/dresser.jpg', category: 'storage' },
      { id: 'nightstand', name: 'Nightstand', image: '/furniture/nightstand.jpg', category: 'tables' },
      { id: 'mirror', name: 'Mirror', image: '/furniture/mirror.jpg', category: 'decor' },
      { id: 'lamp2', name: 'Bedside Lamp', image: '/furniture/lamp2.jpg', category: 'lighting' }
    ],
    kitchen: [
      { id: 'dining_table', name: 'Dining Table', image: '/furniture/dining_table.jpg', category: 'tables' },
      { id: 'chairs', name: 'Dining Chairs', image: '/furniture/chairs.jpg', category: 'seating' },
      { id: 'island', name: 'Kitchen Island', image: '/furniture/island.jpg', category: 'storage' },
      { id: 'stools', name: 'Bar Stools', image: '/furniture/stools.jpg', category: 'seating' },
      { id: 'pantry', name: 'Pantry', image: '/furniture/pantry.jpg', category: 'storage' }
    ],
    bathroom: [
      { id: 'vanity', name: 'Vanity', image: '/furniture/vanity.jpg', category: 'storage' },
      { id: 'mirror2', name: 'Bathroom Mirror', image: '/furniture/mirror2.jpg', category: 'decor' },
      { id: 'towel_rack', name: 'Towel Rack', image: '/furniture/towel_rack.jpg', category: 'storage' },
      { id: 'shower_curtain', name: 'Shower Curtain', image: '/furniture/shower_curtain.jpg', category: 'decor' },
      { id: 'bath_mat', name: 'Bath Mat', image: '/furniture/bath_mat.jpg', category: 'decor' }
    ],
    garage: [
      { id: 'workbench', name: 'Workbench', image: '/furniture/workbench.jpg', category: 'work' },
      { id: 'storage_cabinets', name: 'Storage Cabinets', image: '/furniture/storage_cabinets.jpg', category: 'storage' },
      { id: 'tool_rack', name: 'Tool Rack', image: '/furniture/tool_rack.jpg', category: 'work' },
      { id: 'floor_epoxy', name: 'Epoxy Floor', image: '/furniture/floor_epoxy.jpg', category: 'flooring' }
    ],
    garden: [
      { id: 'patio_set', name: 'Patio Set', image: '/furniture/patio_set.jpg', category: 'outdoor' },
      { id: 'planters', name: 'Planters', image: '/furniture/planters.jpg', category: 'plants' },
      { id: 'garden_shed', name: 'Garden Shed', image: '/furniture/garden_shed.jpg', category: 'storage' },
      { id: 'fire_pit', name: 'Fire Pit', image: '/furniture/fire_pit.jpg', category: 'outdoor' }
    ]
  };

  const colorSchemes = [
    { name: 'Modern White', colors: ['#FFFFFF', '#F8F9FA', '#E9ECEF'] },
    { name: 'Warm Beige', colors: ['#F5F5DC', '#DEB887', '#D2B48C'] },
    { name: 'Cool Gray', colors: ['#F8F9FA', '#E9ECEF', '#DEE2E6'] },
    { name: 'Cozy Brown', colors: ['#8B4513', '#A0522D', '#CD853F'] },
    { name: 'Fresh Green', colors: ['#F0FFF0', '#98FB98', '#90EE90'] },
    { name: 'Ocean Blue', colors: ['#F0F8FF', '#B0E0E6', '#87CEEB'] }
  ];

  const handleFurnitureSelect = (furniture) => {
    setSelectedFurniture(prev => ({
      ...prev,
      [currentRoom]: furniture
    }));
  };

  const handleColorSchemeSelect = (scheme) => {
    setRoomLayout(prev => ({
      ...prev,
      [currentRoom]: {
        ...prev[currentRoom],
        colorScheme: scheme
      }
    }));
  };

  const handleStaging = async () => {
    setIsStaging(true);
    // Simulate AI staging process
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsStaging(false);
    // Here you would integrate with actual AI staging service
  };

  const resetRoom = () => {
    setSelectedFurniture(prev => ({
      ...prev,
      [currentRoom]: null
    }));
    setRoomLayout(prev => ({
      ...prev,
      [currentRoom]: null
    }));
  };

  const downloadStagedImage = () => {
    // Simulate downloading staged image
    const link = document.createElement('a');
    link.download = `staged-${property.title}-${currentRoom}.jpg`;
    link.href = '#';
    link.click();
  };

  if (!isOpen || !property) return null;

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
          className="bg-white rounded-lg shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                  <Wand2 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Virtual Staging</h2>
                  <p className="text-purple-100">Decorate and visualize your space</p>
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
            {/* Room Selection */}
            <div className="lg:w-64 bg-gray-50 p-4 border-r">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Rooms</h3>
              <div className="space-y-2">
                {rooms.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => setCurrentRoom(room.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                      currentRoom === room.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <room.icon className="w-5 h-5" />
                    <span className="font-medium">{room.name}</span>
                    {selectedFurniture[room.id] && (
                      <Check className="w-4 h-4 ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Staging Area */}
            <div className="flex-1 flex flex-col">
              {/* Room Preview */}
              <div className="flex-1 bg-gray-100 p-6 flex items-center justify-center">
                <div className="relative w-full h-full max-w-4xl">
                  {/* Original Room Image */}
                  <div className="relative w-full h-96 bg-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={property.images[0] || '/placeholder-room.jpg'}
                      alt={`${rooms.find(r => r.id === currentRoom)?.name} - Original`}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Staging Overlay */}
                    {selectedFurniture[currentRoom] && (
                      <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                        <div className="bg-white bg-opacity-90 p-4 rounded-lg text-center">
                          <Wand2 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                          <p className="text-sm font-medium">Staging in progress...</p>
                          <p className="text-xs text-gray-600">
                            {selectedFurniture[currentRoom]?.name} will be added
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Room Controls */}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                    <button
                      onClick={resetRoom}
                      className="flex items-center gap-2 bg-white bg-opacity-90 text-gray-700 px-3 py-2 rounded-lg hover:bg-opacity-100 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reset
                    </button>
                    <button
                      onClick={downloadStagedImage}
                      className="flex items-center gap-2 bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </div>
              </div>

              {/* Furniture Selection */}
              <div className="border-t bg-white p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Furniture & Decor
                  </h3>
                  <button
                    onClick={handleStaging}
                    disabled={isStaging || !selectedFurniture[currentRoom]}
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isStaging ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>Staging...</span>
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4" />
                        <span>Apply Staging</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {furnitureCategories[currentRoom]?.map((furniture) => (
                    <button
                      key={furniture.id}
                      onClick={() => handleFurnitureSelect(furniture)}
                      className={`p-3 rounded-lg border text-left transition-colors ${
                        selectedFurniture[currentRoom]?.id === furniture.id
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="w-full h-20 bg-gray-100 rounded mb-2 flex items-center justify-center">
                        <Home className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-sm font-medium">{furniture.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{furniture.category}</p>
                    </button>
                  ))}
                </div>

                {/* Color Schemes */}
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Color Schemes</h4>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {colorSchemes.map((scheme, index) => (
                      <button
                        key={index}
                        onClick={() => handleColorSchemeSelect(scheme)}
                        className="p-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                      >
                        <div className="flex gap-1 mb-1">
                          {scheme.colors.map((color, i) => (
                            <div
                              key={i}
                              className="w-4 h-4 rounded"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-gray-600">{scheme.name}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VirtualStaging;


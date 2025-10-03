import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Heart, Scale, User, LogOut, Plus, Grid, List, Home, Edit, Trash2, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { userAPI, propertyAPI, messageAPI } from '../services/api';
import PropertyCard from '../components/PropertyCard';
import MessageScreen from '../components/MessageScreen';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('myProperties');
  const [viewMode, setViewMode] = useState('grid');
  const [showMessageScreen, setShowMessageScreen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);

  const { data: favorites = [] } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => userAPI.getFavorites().then(res => res.data),
    enabled: !!user,
  });

  const { data: comparisons = [] } = useQuery({
    queryKey: ['comparisons'],
    queryFn: () => userAPI.getComparisons().then(res => res.data),
    enabled: !!user,
  });

  const { data: myProperties = [], isLoading: propertiesLoading } = useQuery({
    queryKey: ['myProperties', user?._id],
    queryFn: () => propertyAPI.getUserProperties(user._id).then(res => res.data),
    enabled: !!user,
  });

  const { data: conversationsData = { inquired: [], property: [] } } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => messageAPI.getConversations().then(res => res.data),
    enabled: !!user,
  });

  const totalMessages = conversationsData.inquired.length + conversationsData.property.length;

  const deletePropertyMutation = useMutation({
    mutationFn: propertyAPI.deleteProperty,
    onSuccess: () => {
      queryClient.invalidateQueries(['myProperties']);
      toast.success('Property deleted successfully');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to delete property');
    },
  });

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const handleDeleteProperty = (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      deletePropertyMutation.mutate(propertyId);
    }
  };

  const handleEditProperty = (propertyId) => {
    navigate(`/edit-property/${propertyId}`);
  };

  const tabs = [
    { id: 'myProperties', label: 'My Properties', icon: Home, count: myProperties.length },
    { id: 'messages', label: 'Messages', icon: MessageCircle, count: totalMessages },
    { id: 'favorites', label: 'Favorites', icon: Heart, count: favorites.length },
    { id: 'comparisons', label: 'Comparisons', icon: Scale, count: comparisons.length },
    { id: 'profile', label: 'Profile', icon: User, count: null },
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h2>
          <p className="text-gray-600 mb-4">You need to be logged in to access the dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6"
      >
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="lg:w-64 w-full"
          >
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">
                    {user.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-600">Welcome back!</p>
                </div>
              </div>
              
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    data-tab={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-orange-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                    {tab.count !== null && (
                      <span className={`ml-auto text-xs px-2 py-1 rounded-full ${
                        activeTab === tab.id
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex-1"
          >
            {activeTab === 'myProperties' && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">My Properties</h2>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                    <button
                      onClick={() => navigate('/create-listing')}
                      className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm sm:text-base"
                    >
                      <Plus className="w-4 h-4" />
                      Add Property
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                      >
                        <Grid className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                      >
                        <List className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                {propertiesLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your properties...</p>
                  </div>
                ) : myProperties.length === 0 ? (
                  <div className="text-center py-12">
                    <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No properties yet</h3>
                    <p className="text-gray-600 mb-4">Start by creating your first property listing</p>
                    <button
                      onClick={() => navigate('/create-listing')}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Create First Property
                    </button>
                  </div>
                ) : (
                  <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 justify-items-center' : 'space-y-4 sm:space-y-6 max-w-4xl mx-auto'}>
                    {myProperties.map((property) => (
                      <div key={property._id} className="relative">
                        <PropertyCard
                          property={property}
                          viewMode={viewMode}
                          isFavorite={favorites.some(fav => fav._id === property._id)}
                          isInComparison={comparisons.some(comp => comp._id === property._id)}
                        />
                        <div className="absolute top-2 right-2 flex gap-2">
                          <button
                            onClick={() => handleEditProperty(property._id)}
                            className="bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-colors"
                            title="Edit Property"
                          >
                            <Edit className="w-4 h-4 text-blue-600" />
                          </button>
                          <button
                            onClick={() => handleDeleteProperty(property._id)}
                            className="bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-colors"
                            title="Delete Property"
                            disabled={deletePropertyMutation.isLoading}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'messages' && (
              <div>
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Messages</h2>
                </div>
                
                {totalMessages === 0 ? (
                  <div className="text-center py-12">
                    <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No messages yet</h3>
                    <p className="text-gray-600">Messages from property inquiries will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Inquired Properties */}
                    {conversationsData.inquired.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Properties You Inquired About</h3>
                        <div className="space-y-3">
                          {conversationsData.inquired.map((conversation) => (
                            <div 
                              key={`inquired-${conversation.property._id}-${conversation.otherUser._id}`} 
                              className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
                              onClick={() => {
                                setSelectedConversation({
                                  property: conversation.property,
                                  otherUser: conversation.otherUser,
                                  type: 'inquired'
                                });
                                setShowMessageScreen(true);
                              }}
                            >
                              <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                  <span className="text-blue-600 font-semibold">
                                    {conversation.otherUser.name?.charAt(0) || 'U'}
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between mb-2">
                                    <div>
                                      <h4 className="font-semibold text-gray-900">{conversation.otherUser.name}</h4>
                                      <p className="text-sm text-gray-600">{conversation.property.title}</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-xs text-gray-500">
                                        {new Date(conversation.lastMessageDate).toLocaleDateString()}
                                      </p>
                                      {conversation.unreadCount > 0 && (
                                        <span className="inline-block bg-orange-600 text-white text-xs px-2 py-1 rounded-full mt-1">
                                          {conversation.unreadCount}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Property Messages */}
                    {conversationsData.property.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Messages for Your Properties</h3>
                        <div className="space-y-3">
                          {conversationsData.property.map((conversation) => (
                            <div 
                              key={`property-${conversation.property._id}-${conversation.otherUser._id}`} 
                              className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
                              onClick={() => {
                                setSelectedConversation({
                                  property: conversation.property,
                                  otherUser: conversation.otherUser,
                                  type: 'property'
                                });
                                setShowMessageScreen(true);
                              }}
                            >
                              <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                  <span className="text-green-600 font-semibold">
                                    {conversation.otherUser.name?.charAt(0) || 'U'}
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between mb-2">
                                    <div>
                                      <h4 className="font-semibold text-gray-900">{conversation.otherUser.name}</h4>
                                      <p className="text-sm text-gray-600">{conversation.property.title}</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-xs text-gray-500">
                                        {new Date(conversation.lastMessageDate).toLocaleDateString()}
                                      </p>
                                      {conversation.unreadCount > 0 && (
                                        <span className="inline-block bg-orange-600 text-white text-xs px-2 py-1 rounded-full mt-1">
                                          {conversation.unreadCount}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'favorites' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Favorite Properties</h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {favorites.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No favorites yet</h3>
                    <p className="text-gray-600">Properties you save will appear here</p>
                  </div>
                ) : (
                  <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 justify-items-center' : 'space-y-4 sm:space-y-6 max-w-4xl mx-auto'}>
                    {favorites.map((property) => (
                      <PropertyCard
                        key={property._id}
                        property={property}
                        viewMode={viewMode}
                        isFavorite={true}
                        isInComparison={comparisons.some(comp => comp._id === property._id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'comparisons' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Property Comparisons</h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
          <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                    >
                      <List className="w-4 h-4" />
          </button>
        </div>
                </div>
                
                {comparisons.length === 0 ? (
                  <div className="text-center py-12">
                    <Scale className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No comparisons yet</h3>
                    <p className="text-gray-600">Properties you add to comparison will appear here</p>
                  </div>
                ) : (
                  <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 justify-items-center' : 'space-y-4 sm:space-y-6 max-w-4xl mx-auto'}>
                    {comparisons.map((property) => (
                      <PropertyCard
                        key={property._id}
                        property={property}
                        viewMode={viewMode}
                        isFavorite={favorites.some(fav => fav._id === property._id)}
                        isInComparison={true}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h2>
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-2xl font-semibold">
                        {user?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{user?.name || 'User'}</h3>
                      <p className="text-gray-600">{user?.email}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        defaultValue={user?.name || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        defaultValue={user?.email || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex gap-4">
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                        Save Changes
                      </button>
                      <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Message Screen */}
      <MessageScreen
        isOpen={showMessageScreen}
        onClose={() => {
          setShowMessageScreen(false);
          setSelectedConversation(null);
        }}
        property={selectedConversation?.property}
        otherUser={selectedConversation?.otherUser}
        type={selectedConversation?.type}
      />
    </div>
  );
};

export default Dashboard;
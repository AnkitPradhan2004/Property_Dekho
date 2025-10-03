import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Grid, List, Map, Filter, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import PropertyCard from "../components/PropertyCard";
import AdvancedFilter from "../components/AdvancedFilter";
import EnhancedSearch from "../components/EnhancedSearch";
import PropertyMap from "../components/PropertyMap";
import Footer from "../components/Footer";
import { propertyAPI, userAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

const BrowseProperties = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [favorites, setFavorites] = useState(new Set());
  const [comparisons, setComparisons] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);

  const { data: userFavoriteIds = [] } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => userAPI.getFavorites().then(res => res.data),
    select: (list) => Array.isArray(list) ? list.map(p => p._id) : [],
    enabled: !!user,
  });

  const { data: userComparisonIds = [] } = useQuery({
    queryKey: ['comparisons'],
    queryFn: () => userAPI.getComparisons().then(res => res.data),
    select: (list) => Array.isArray(list) ? list.map(p => p._id) : [],
    enabled: !!user,
  });

  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['properties', JSON.stringify(filters ?? {}), searchQuery, currentPage],
    queryFn: () => {
      const params = {
        ...filters,
        page: currentPage,
        limit: 10,
        search: searchQuery
      };
      return propertyAPI.getProperties(params).then(res => res.data);
    },
  });

  const properties = data?.properties || [];
  const totalPages = data?.pages || 1;
  const totalProperties = data?.total || 0;

  const handleFilterChange = useCallback((newFilters) => {
    setCurrentPage(1);
    setFilters(newFilters);
  }, []);

  const handleToggleFavorite = useCallback((propertyId) => {
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(propertyId)) {
        newSet.delete(propertyId);
      } else {
        newSet.add(propertyId);
      }
      return newSet;
    });
  }, []);

  const handleToggleComparison = useCallback((propertyId) => {
    setComparisons(prev => {
      const newSet = new Set(prev);
      if (newSet.has(propertyId)) {
        newSet.delete(propertyId);
      } else {
        newSet.add(propertyId);
      }
      return newSet;
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-sm border-b"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Browse Properties</h1>
              <p className="text-gray-600 mt-1">Find your perfect property</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex-1 max-w-2xl"
            >
              <EnhancedSearch
                onSearch={(searchData) => {
                  setSearchQuery(searchData.query || '');
                  setFilters(searchData);
                  setCurrentPage(1);
                  refetch();
                }}
                onFilterChange={(newFilters) => {
                  setFilters(newFilters);
                  setCurrentPage(1);
                  refetch();
                }}
                initialFilters={filters}
              />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="lg:w-80 flex-shrink-0"
          >
            <AdvancedFilter
              onFilterChange={handleFilterChange}
              isOpen={isFilterOpen}
              onToggle={() => setIsFilterOpen(!isFilterOpen)}
            />
          </motion.div>

          {/* Properties */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex-1 min-w-0"
          >
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  {totalProperties} properties found
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 mr-2 hidden sm:inline">View:</span>
                {['grid', 'list', 'map'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                      viewMode === mode
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {mode === 'grid' && <Grid className="w-4 h-4" />}
                    {mode === 'list' && <List className="w-4 h-4" />}
                    {mode === 'map' && <Map className="w-4 h-4" />}
                    <span className="capitalize hidden sm:inline">{mode}</span>
                  </button>
                ))}
                
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="lg:hidden flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors text-sm"
                >
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Properties Display */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600">Loading properties...</p>
                </div>
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters</p>
                <button
                  onClick={() => {
                    setFilters({});
                    setSearchQuery("");
                    setCurrentPage(1);
                    refetch();
                  }}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
                >
                  Clear Filters
                </button>
              </div>
            ) : viewMode === 'map' ? (
              <div className="h-96 lg:h-[600px] rounded-lg overflow-hidden">
                <PropertyMap
                  properties={properties}
                  onPropertySelect={(property) => {
                    console.log('Selected property:', property);
                  }}
                  selectedProperty={null}
                />
              </div>
            ) : (
              <div>
                <div className={
                  viewMode === 'grid' 
                    ? 'grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto px-4' 
                    : 'space-y-6 max-w-4xl mx-auto'
                }>
                  {properties.map((property) => (
                    <PropertyCard
                      key={property._id}
                      property={property}
                      viewMode={viewMode}
                      onToggleFavorite={handleToggleFavorite}
                      onToggleComparison={handleToggleComparison}
                      isFavorite={favorites.has(property._id)}
                      isInComparison={comparisons.has(property._id)}
                    />
                  ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                      if (pageNum > totalPages) return null;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-2 rounded-lg ${
                            currentPage === pageNum
                              ? 'bg-orange-600 text-white'
                              : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BrowseProperties;
import { useState, useEffect, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Grid, List, Map, Filter, X, Loader2 } from "lucide-react";
import PropertyCard from "../components/PropertyCard";
import AdvancedFilter from "../components/AdvancedFilter";
import PageTransition from "../components/PageTransition";
import { Link } from "react-router-dom";
import AnimatedSkeleton from "../components/AnimatedSkeleton";
import ShimmerEffect from "../components/ShimmerEffect";
import AnimatedSearchBar from "../components/AnimatedSearchBar";
import EnhancedSearch from "../components/EnhancedSearch";
import PropertyMap from "../components/PropertyMap";
import FloatingActionButton from "../components/FloatingActionButton";
import FloatingMenu from "../components/FloatingMenu";
import ContactUs from "../components/ContactUs";
import Footer from "../components/Footer";
import { propertyAPI, userAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";


const Home = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [favorites, setFavorites] = useState(new Set());
  const [comparisons, setComparisons] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch user favorites and comparisons
  const { data: userFavoriteIds = [] } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => userAPI.getFavorites().then(res => res.data),
    select: (list) => Array.isArray(list) ? list.map(p => p._id) : [],
    enabled: !!user,
    retry: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 60_000,
  });

  const { data: userComparisonIds = [] } = useQuery({
    queryKey: ['comparisons'],
    queryFn: () => userAPI.getComparisons().then(res => res.data),
    select: (list) => Array.isArray(list) ? list.map(p => p._id) : [],
    enabled: !!user,
    retry: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 60_000,
  });

  // Update local state when data changes
  useEffect(() => {
    if (Array.isArray(userFavoriteIds)) {
      setFavorites(prev => {
        const next = new Set(userFavoriteIds);
        if (prev.size === next.size && [...prev].every(id => next.has(id))) return prev;
        return next;
      });
    }
  }, [userFavoriteIds]);

  useEffect(() => {
    if (Array.isArray(userComparisonIds)) {
      setComparisons(prev => {
        const next = new Set(userComparisonIds);
        if (prev.size === next.size && [...prev].every(id => next.has(id))) return prev;
        return next;
      });
    }
  }, [userComparisonIds]);

  // Properties query with pagination
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
    retry: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const properties = data?.properties || [];
  const totalPages = data?.pages || 1;
  const totalProperties = data?.total || 0;

  const handleFilterChange = useCallback((newFilters) => {
    setCurrentPage(1); // Reset to first page when filters change
    setFilters((prev) => {
      const prevStr = JSON.stringify(prev ?? {});
      const nextStr = JSON.stringify(newFilters ?? {});
      return prevStr === nextStr ? prev : newFilters;
    });
  }, []);

  const handleToggleFavorite = useCallback(async (propertyId) => {
    if (!user) {
      toast.error('Please login to save favorites');
      return;
    }

    console.log('Toggling favorite for property:', propertyId);
    try {
      const response = await userAPI.toggleFavorite(propertyId);
      console.log('Favorite toggle response:', response.data);
      
      // Update local state immediately for better UX
      setFavorites(prev => {
        const newSet = new Set(prev);
        if (newSet.has(propertyId)) {
          newSet.delete(propertyId);
        } else {
          newSet.add(propertyId);
        }
        console.log('Updated favorites set:', newSet);
        return newSet;
      });
      
      // Invalidate and refetch favorites query
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      
      toast.success(response.data.action === 'added' ? 'Added to favorites' : 'Removed from favorites');
    } catch (error) {
      console.error('Favorite toggle error:', error);
      toast.error(error.response?.data?.message || 'Failed to update favorites');
    }
  }, [user, queryClient]);

  const handleToggleComparison = useCallback(async (propertyId) => {
    if (!user) {
      toast.error('Please login to compare properties');
      return;
    }

    try {
      const response = await userAPI.toggleComparison(propertyId);
      
      // Update local state immediately for better UX
      setComparisons(prev => {
        const newSet = new Set(prev);
        if (newSet.has(propertyId)) {
          newSet.delete(propertyId);
        } else {
          newSet.add(propertyId);
        }
        return newSet;
      });
      
      // Invalidate and refetch comparisons query
      queryClient.invalidateQueries({ queryKey: ['comparisons'] });
      
      toast.success(response.data.action === 'added' ? 'Added to comparison' : 'Removed from comparison');
    } catch (error) {
      console.error('Comparison toggle error:', error);
      toast.error(error.response?.data?.message || 'Failed to update comparison');
    }
  }, [user, queryClient]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    refetch();
  };

  const getViewModeIcon = (mode) => {
    switch (mode) {
      case 'grid': return <Grid className="w-4 h-4" />;
      case 'list': return <List className="w-4 h-4" />;
      case 'map': return <Map className="w-4 h-4" />;
      default: return <Grid className="w-4 h-4" />;
    }
  };

  const getViewModeLabel = (mode) => {
    switch (mode) {
      case 'grid': return 'Grid';
      case 'list': return 'List';
      case 'map': return 'Map';
      default: return 'Grid';
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Properties</h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <button
            onClick={() => refetch()}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute -z-10 inset-0 bg-gradient-to-br from-orange-50 via-white to-orange-100" />
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-10 sm:py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-4">
                Find Real Estate & Get
                <span className="block text-gradient">Your Dream Place</span>
              </h1>
              <p className="text-gray-600 max-w-2xl mb-6">
                Explore verified listings with immersive visuals, smart filters, and real-time updates. Save favorites, compare properties, and contact agents instantly.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/browse" className="btn-primary">
                  Browse Properties
                </Link>
                {!user && (
                  <Link to="/signup" className="btn-secondary">Create Account</Link>
                )}
              </div>
              <div className="grid grid-cols-3 gap-6 mt-10">
                <div>
                  <div className="text-2xl font-bold text-gray-900">16+</div>
                  <div className="text-gray-600">Years of Experience</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">200</div>
                  <div className="text-gray-600">Awards Gained</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">2000+</div>
                  <div className="text-gray-600">Property Ready</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="pointer-events-none absolute -right-16 -top-10 w-72 h-72 rounded-full bg-purple-100 blur-2xl opacity-60" />
              <div className="pointer-events-none absolute -left-16 bottom-0 w-72 h-72 rounded-full bg-blue-100 blur-2xl opacity-60" />
              <div className="relative grid grid-cols-2 gap-6">
                <img src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop&crop=center" alt="Modern Tower" className="rounded-2xl shadow-large w-full h-56 object-cover" />
                <img src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=200&fit=crop&crop=center" alt="Glass Building" className="rounded-2xl shadow-large w-full h-40 object-cover mt-10" />
                <img src="https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=800&h=250&fit=crop&crop=center" alt="Modern Architecture" className="rounded-2xl shadow-large w-full h-48 object-cover col-span-2" />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-orange-600 via-orange-500 to-orange-700 bg-clip-text text-transparent truncate">
                🏠 Find Your Dream Property
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1 hidden sm:block flex items-center gap-2">
                <span className="inline-flex items-center gap-1">
                  ✨ Discover amazing properties with our
                  <span className="font-semibold text-orange-600">smart search</span>
                  & filters
                </span>
              </p>
            </div>
            
            {/* Enhanced Search Bar */}
            <div className="flex-1 max-w-2xl w-full">
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
            </div>
          </div>
        </div>
      </div>

      <div id="listings" className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Filter Sidebar */}
          <div className="lg:w-80">
            <AdvancedFilter
              onFilterChange={handleFilterChange}
              isOpen={isFilterOpen}
              onToggle={() => setIsFilterOpen(!isFilterOpen)}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="lg:hidden flex items-center gap-2 bg-orange-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-orange-700 text-sm sm:text-base"
                >
                  <Filter className="w-4 h-4" />
                  <span className="hidden xs:inline">Filters</span>
                  <span className="xs:hidden">Filter</span>
                </button>
                
                <div className="hidden lg:block text-sm text-gray-600">
                  {totalProperties} properties found
                </div>
                <div className="lg:hidden text-xs sm:text-sm text-gray-600">
                  {totalProperties} found
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="text-xs sm:text-sm text-gray-600 mr-1 sm:mr-2 hidden xs:inline">View:</span>
                {['grid', 'list', 'map'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg transition-colors text-xs sm:text-sm ${
                      viewMode === mode
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {getViewModeIcon(mode)}
                    <span className="hidden sm:inline">{getViewModeLabel(mode)}</span>
                  </button>
                ))}
                
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="lg:hidden flex items-center gap-1 px-2 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors text-xs"
                >
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Properties Grid/List */}
            {isLoading ? (
              <div className="space-y-6">
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <AnimatedSkeleton variant="image" className="w-16 h-16 mx-auto mb-4" />
                    <p className="text-gray-600">Loading properties...</p>
                  </div>
                </div>
                {/* Skeleton Loading */}
                <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md p-4 space-y-4">
                      <ShimmerEffect height="200px" className="rounded" />
                      <div className="space-y-2">
                        <ShimmerEffect height="20px" width="80%" />
                        <ShimmerEffect height="16px" width="60%" />
                        <ShimmerEffect height="16px" width="40%" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
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
            ) : (
              <div>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto px-4">
                    {properties.map((property, index) => (
                      <motion.div
                        key={property._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <PropertyCard
                          property={property}
                          viewMode={viewMode}
                          onToggleFavorite={handleToggleFavorite}
                          onToggleComparison={handleToggleComparison}
                          isFavorite={favorites.has(property._id)}
                          isInComparison={comparisons.has(property._id)}
                        />
                      </motion.div>
                    ))}
                  </div>
                ) : viewMode === 'list' ? (
                  <div className="space-y-3 sm:space-y-4 lg:space-y-6 max-w-4xl mx-auto">
                    {properties.map((property, index) => (
                      <motion.div
                        key={property._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <PropertyCard
                          property={property}
                          viewMode={viewMode}
                          onToggleFavorite={handleToggleFavorite}
                          onToggleComparison={handleToggleComparison}
                          isFavorite={favorites.has(property._id)}
                          isInComparison={comparisons.has(property._id)}
                        />
                      </motion.div>
                    ))}
                  </div>
                ) : null}
                
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

            {/* Map View */}
            {viewMode === 'map' && (
              <div className="h-96 lg:h-[600px]">
                <PropertyMap
                  properties={properties}
                  onPropertySelect={(property) => {
                    // Navigate to property details or show popup
                    console.log('Selected property:', property);
                  }}
                  selectedProperty={null}
                />
              </div>
            )}
          </div>
        </div>
      </div>


      {/* Contact + Footer */}
      <ContactUs />
      <Footer />
      
      {/* Floating Menu */}
      <FloatingMenu />
      </div>
    </PageTransition>
  );
};

export default Home;

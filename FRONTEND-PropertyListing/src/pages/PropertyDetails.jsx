import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, Scale, Share2, MapPin, Bed, Bath, Square, Calendar, 
  ArrowLeft, ArrowRight, Maximize2, Phone, Mail, 
  Star, Clock, ShoppingCart, Train, Plane, 
  GraduationCap, TreePine, Utensils
} from "lucide-react";
import { propertyAPI, userAPI, inquiryAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import AnimatedSkeleton from "../components/AnimatedSkeleton";
import AnimatedProgressBar from "../components/AnimatedProgressBar";

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInComparison, setIsInComparison] = useState(false);

  // Form validation schema
  const inquirySchema = yup.object({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    phone: yup.string().required('Phone is required'),
    message: yup.string().required('Message is required'),
  });

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(inquirySchema)
  });

  // Fetch property details
  const { data: property, isLoading, error } = useQuery({
    queryKey: ['property', id],
    queryFn: () => propertyAPI.getProperty(id).then(res => res.data),
  });

  // Check if property is in favorites/comparisons
  const { data: userFavorites = [] } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => userAPI.getFavorites().then(res => res.data),
    enabled: !!user,
  });

  const { data: userComparisons = [] } = useQuery({
    queryKey: ['comparisons'],
    queryFn: () => userAPI.getComparisons().then(res => res.data),
    enabled: !!user,
  });

  useEffect(() => {
    if (property && userFavorites) {
      setIsFavorite(userFavorites.some(fav => fav._id === property._id));
    }
  }, [property, userFavorites]);

  useEffect(() => {
    if (property && userComparisons) {
      setIsInComparison(userComparisons.some(comp => comp._id === property._id));
    }
  }, [property, userComparisons]);

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
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const handleFavorite = async () => {
    if (!user) {
      toast.error('Please login to save favorites');
      return;
    }

    try {
      await userAPI.toggleFavorite(property._id);
      setIsFavorite(!isFavorite);
      toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
    } catch (error) {
      toast.error('Failed to update favorites');
    }
  };

  const handleComparison = async () => {
    if (!user) {
      toast.error('Please login to compare properties');
      return;
    }

    try {
      await userAPI.toggleComparison(property._id);
      setIsInComparison(!isInComparison);
      toast.success(isInComparison ? 'Removed from comparison' : 'Added to comparison');
    } catch (error) {
      toast.error('Failed to update comparison');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: property.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  const onSubmitInquiry = async (data) => {
    try {
      await inquiryAPI.sendInquiry({
        propertyId: property._id,
        ...data
      });
      toast.success('Inquiry sent successfully!');
      reset();
    } catch (error) {
      toast.error('Failed to send inquiry');
    }
  };

  const nearbyPlaces = [
    { name: 'Downtown Mall', distance: '0.5 miles', icon: ShoppingCart },
    { name: 'Central Park', distance: '0.8 miles', icon: TreePine },
    { name: 'Metro Station', distance: '0.3 miles', icon: Train },
    { name: 'International Airport', distance: '12 miles', icon: Plane },
    { name: 'University', distance: '1.2 miles', icon: GraduationCap },
    { name: 'Restaurant District', distance: '0.6 miles', icon: Utensils },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <div className="text-center">
          <AnimatedSkeleton variant="image" className="w-16 h-16 mx-auto mb-4" />
          <p className="text-gray-600">Loading property details...</p>
        </div>
        <div className="mt-8 w-full max-w-md">
          <AnimatedProgressBar progress={75} color="blue" showPercentage={true} />
        </div>
        <div className="mt-8 w-full max-w-4xl space-y-4">
          <AnimatedSkeleton variant="image" height="400px" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <AnimatedSkeleton variant="title" height="40px" width="60%" />
              <AnimatedSkeleton variant="text" count={3} />
              <AnimatedSkeleton variant="card" height="200px" />
            </div>
            <div className="space-y-4">
              <AnimatedSkeleton variant="card" height="300px" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h2>
          <p className="text-gray-600 mb-4">The property you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleFavorite}
                className={`p-2 rounded-full transition-colors ${
                  isFavorite ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleComparison}
                className={`p-2 rounded-full transition-colors ${
                  isInComparison ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Scale className={`w-5 h-5 ${isInComparison ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleShare}
                className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Image Gallery */}
            <div className="relative">
              <div className="relative h-64 sm:h-80 lg:h-[500px] rounded-lg overflow-hidden">
                <img
                  src={property.images[currentImageIndex] || '/placeholder-property.jpg'}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Navigation Arrows */}
                {property.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </>
                )}
                
                {/* Fullscreen Button */}
                <button
                  onClick={() => setIsFullscreen(true)}
                  className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors"
                >
                  <Maximize2 className="w-5 h-5" />
                </button>
                
                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white text-sm px-3 py-1 rounded">
                  {currentImageIndex + 1} / {property.images.length}
                </div>
              </div>
              
              {/* Thumbnail Strip */}
              {property.images.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto">
                  {property.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        index === currentImageIndex ? 'border-blue-500' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${property.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Property Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>{property.location.address}, {property.location.city}, {property.location.region}</span>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>Listed {formatDate(property.createdAt)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>Updated 2 hours ago</span>
                    </div>
                  </div>
                </div>
                <div className="text-right mt-4 lg:mt-0">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {formatPrice(property.price)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
                  </div>
                </div>
              </div>

              {/* Key Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Bed className="w-6 h-6 mx-auto text-gray-600 mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{property.bedrooms || 'N/A'}</div>
                  <div className="text-sm text-gray-600">Bedrooms</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Bath className="w-6 h-6 mx-auto text-gray-600 mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{property.bathrooms || 'N/A'}</div>
                  <div className="text-sm text-gray-600">Bathrooms</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Square className="w-6 h-6 mx-auto text-gray-600 mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{property.squareFootage || 'N/A'}</div>
                  <div className="text-sm text-gray-600">Sq Ft</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Star className="w-6 h-6 mx-auto text-gray-600 mb-2" />
                  <div className="text-2xl font-bold text-gray-900">4.8</div>
                  <div className="text-sm text-gray-600">Rating</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed">{property.description}</p>
              </div>

              {/* Amenities */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.amenities?.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2 text-gray-600">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Virtual Tour */}
              {property.virtualTourUrl && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Virtual Tour</h3>
                  <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden">
                    <iframe
                      src={property.virtualTourUrl}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {/* Video Tour */}
              {property.videoTourUrl && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Video Tour</h3>
                  <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden">
                    <video
                      src={property.videoTourUrl}
                      controls
                      className="w-full h-full"
                    />
                  </div>
                </div>
              )}

              {/* Floor Plans */}
              {property.floorPlans && property.floorPlans.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Floor Plans</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {property.floorPlans.map((plan, index) => (
                      <div key={index} className="bg-gray-100 rounded-lg p-4">
                        <img
                          src={plan}
                          alt={`Floor plan ${index + 1}`}
                          className="w-full h-48 object-contain rounded"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Map */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Location</h3>
              <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Interactive map will be implemented here</p>
                </div>
              </div>
              
              {/* Nearby Places */}
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Nearby Places</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {nearbyPlaces.map((place, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <place.icon className="w-5 h-5 text-gray-600" />
                      <div>
                        <div className="font-medium text-gray-900">{place.name}</div>
                        <div className="text-sm text-gray-600">{place.distance}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Agent */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Agent</h3>
              {property.agent ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">
                        {property.agent.name?.charAt(0) || 'A'}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{property.agent.name}</div>
                      <div className="text-sm text-gray-600">Real Estate Agent</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <button className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                      <Phone className="w-4 h-4" />
                      Call Now
                    </button>
                    <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                      <Mail className="w-4 h-4" />
                      Send Email
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">No agent information available</p>
              )}
            </div>

            {/* Inquiry Form */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Send Inquiry</h3>
              <form onSubmit={handleSubmit(onSubmitInquiry)} className="space-y-4">
                <div>
                  <input
                    {...register('name')}
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>
                
                <div>
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="Your Email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>
                
                <div>
                  <input
                    {...register('phone')}
                    type="tel"
                    placeholder="Your Phone"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                </div>
                
                <div>
                  <textarea
                    {...register('message')}
                    placeholder="Your Message"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Send Inquiry
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Image Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={() => setIsFullscreen(false)}
          >
            <div className="relative max-w-4xl max-h-full">
              <img
                src={property.images[currentImageIndex]}
                alt={property.title}
                className="max-w-full max-h-full object-contain"
              />
              <button
                onClick={() => setIsFullscreen(false)}
                className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
              >
                ×
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default PropertyDetails;

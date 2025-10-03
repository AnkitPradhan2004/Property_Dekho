import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { propertyAPI, uploadAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const EditProperty = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    type: 'apartment',
    bedrooms: '',
    bathrooms: '',
    squareFootage: '',
    address: '',
    city: '',
    region: '',
    zip: '',
    amenities: []
  });
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [uploading, setUploading] = useState(false);

  const { data: property, isLoading } = useQuery({
    queryKey: ['property', id],
    queryFn: () => propertyAPI.getProperty(id).then(res => res.data),
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: (formData) => propertyAPI.updateProperty(id, formData),
    onSuccess: () => {
      toast.success('Property updated successfully!');
      navigate('/dashboard');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to update property');
    },
  });

  useEffect(() => {
    if (property) {
      setForm({
        title: property.title || '',
        description: property.description || '',
        price: property.price || '',
        type: property.type || 'apartment',
        bedrooms: property.bedrooms || '',
        bathrooms: property.bathrooms || '',
        squareFootage: property.squareFootage || '',
        address: property.location?.address || '',
        city: property.location?.city || '',
        region: property.location?.region || '',
        zip: property.location?.zip || '',
        amenities: property.amenities || []
      });
      setExistingImages(property.images || []);
    }
  }, [property]);

  if (!user) {
    navigate('/login');
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Property not found</h2>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Check if user owns this property or is admin
  if (user.role !== 'admin' && property.agent?._id !== user._id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">You can only edit your own properties</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const onAmenityChange = (amenity) => {
    const updatedAmenities = form.amenities.includes(amenity)
      ? form.amenities.filter(a => a !== amenity)
      : [...form.amenities, amenity];
    setForm({ ...form, amenities: updatedAmenities });
  };

  const onImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const uploadImages = async () => {
    if (images.length === 0) return [];
    
    setUploading(true);
    try {
      const response = await uploadAPI.uploadImages(images);
      const urls = response.data.images.map(img => img.url);
      setImageUrls(urls);
      toast.success('Images uploaded successfully');
      return urls;
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload images');
      return [];
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Upload new images if any
      let uploadedImageUrls = imageUrls;
      if (images.length > 0 && imageUrls.length === 0) {
        uploadedImageUrls = await uploadImages();
      }

      // Combine existing and new images
      const allImages = [...existingImages, ...uploadedImageUrls];

      // Create FormData for property update
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('price', form.price);
      formData.append('type', form.type);
      
      if (form.bedrooms) formData.append('bedrooms', form.bedrooms);
      if (form.bathrooms) formData.append('bathrooms', form.bathrooms);
      if (form.squareFootage) formData.append('squareFootage', form.squareFootage);
      
      formData.append('location', JSON.stringify({
        address: form.address,
        city: form.city,
        region: form.region,
        zip: form.zip
      }));
      
      formData.append('amenities', JSON.stringify(form.amenities));
      formData.append('images', JSON.stringify(allImages));

      updateMutation.mutate(formData);
    } catch (err) {
      console.error('Update property error:', err);
      toast.error('Failed to update property');
    }
  };

  const removeExistingImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const amenitiesList = [
    'Pool', 'Gym', 'Parking', 'Balcony', 'Garden', 'Garage',
    'Elevator', 'Security', 'Air Conditioning', 'Heating'
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Edit Property</h1>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-gray-600 hover:text-gray-800"
        >
          Back to Dashboard
        </button>
      </div>
      
      <form onSubmit={onSubmit} className="space-y-4">
        <input 
          name="title" 
          value={form.title} 
          onChange={onChange} 
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
          placeholder="Title" 
          required 
        />
        
        <textarea 
          name="description" 
          value={form.description} 
          onChange={onChange} 
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
          rows={5} 
          placeholder="Description" 
          required 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            name="price" 
            type="number" 
            value={form.price} 
            onChange={onChange} 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            placeholder="Price ($)" 
            required 
          />
          <select 
            name="type" 
            value={form.type} 
            onChange={onChange} 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="office">Office</option>
          </select>
          <input 
            name="bedrooms" 
            type="number" 
            value={form.bedrooms} 
            onChange={onChange} 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            placeholder="Bedrooms" 
          />
          <input 
            name="bathrooms" 
            type="number" 
            value={form.bathrooms} 
            onChange={onChange} 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            placeholder="Bathrooms" 
          />
          <input 
            name="squareFootage" 
            type="number" 
            value={form.squareFootage} 
            onChange={onChange} 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            placeholder="Square Footage" 
          />
          <input 
            name="address" 
            value={form.address} 
            onChange={onChange} 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            placeholder="Address" 
          />
          <input 
            name="city" 
            value={form.city} 
            onChange={onChange} 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            placeholder="City" 
            required 
          />
          <input 
            name="region" 
            value={form.region} 
            onChange={onChange} 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            placeholder="State/Region" 
          />
          <input 
            name="zip" 
            value={form.zip} 
            onChange={onChange} 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            placeholder="ZIP Code" 
          />
        </div>

        {/* Amenities */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Amenities</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {amenitiesList.map(amenity => (
              <label key={amenity} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={form.amenities.includes(amenity)}
                  onChange={() => onAmenityChange(amenity)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{amenity}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Existing Images */}
        {existingImages.length > 0 && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Current Images</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {existingImages.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Property ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(index)}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Image Upload */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Add New Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={onImageSelect}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {images.length > 0 && (
            <div className="text-sm text-gray-600">
              {images.length} new image(s) selected
            </div>
          )}
          {images.length > 0 && imageUrls.length === 0 && (
            <button
              type="button"
              onClick={uploadImages}
              disabled={uploading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Upload New Images'}
            </button>
          )}
          {imageUrls.length > 0 && (
            <div className="text-sm text-green-600">
              ✓ {imageUrls.length} new image(s) uploaded successfully
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button 
            type="submit" 
            disabled={updateMutation.isLoading || uploading} 
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {updateMutation.isLoading ? 'Updating...' : 'Update Property'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProperty;
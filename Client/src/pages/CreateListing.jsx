import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { propertyAPI, uploadAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CreateListing = () => {
  const navigate = useNavigate();
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
  const [imageUrls, setImageUrls] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
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
    
    // Basic validation
    if (!form.title.trim()) {
      toast.error('Title is required');
      return;
    }
    
    if (!form.price || parseFloat(form.price) <= 0) {
      toast.error('Valid price is required');
      return;
    }
    
    if (!form.city.trim()) {
      toast.error('City is required');
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Upload images first if any
      let uploadedImageUrls = imageUrls;
      if (images.length > 0 && imageUrls.length === 0) {
        uploadedImageUrls = await uploadImages();
        if (uploadedImageUrls.length === 0) {
          toast.error('Failed to upload images');
          return;
        }
      }

      // Create property data object
      const propertyData = {
        title: form.title.trim(),
        description: form.description.trim(),
        price: parseFloat(form.price),
        type: form.type,
        location: {
          address: form.address.trim(),
          city: form.city.trim(),
          region: form.region.trim(),
          zip: form.zip.trim(),
          coordinates: [0, 0] // Default coordinates
        },
        amenities: form.amenities,
        images: uploadedImageUrls
      };
      
      // Add optional numeric fields
      if (form.bedrooms && form.bedrooms !== '') {
        propertyData.bedrooms = parseInt(form.bedrooms);
      }
      if (form.bathrooms && form.bathrooms !== '') {
        propertyData.bathrooms = parseInt(form.bathrooms);
      }
      if (form.squareFootage && form.squareFootage !== '') {
        propertyData.squareFootage = parseFloat(form.squareFootage);
      }

      console.log('Sending property data:', propertyData);

      const response = await propertyAPI.createProperty(propertyData);
      console.log('Property created:', response.data);
      toast.success('Listing created successfully!');
      navigate('/');
    } catch (err) {
      console.error('Create listing error:', err);
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to create listing';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const amenitiesList = [
    'Pool', 'Gym', 'Parking', 'Balcony', 'Garden', 'Garage',
    'Elevator', 'Security', 'Air Conditioning', 'Heating'
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Create Listing</h1>
      <form onSubmit={onSubmit} className="space-y-4 sm:space-y-6">
        <input name="title" value={form.title} onChange={onChange} className="form-input" placeholder="Title" required />
        <textarea name="description" value={form.description} onChange={onChange} className="form-input" rows={5} placeholder="Description" required />
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

        {/* Image Upload */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Property Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={onImageSelect}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {images.length > 0 && (
            <div className="text-sm text-gray-600">
              {images.length} image(s) selected
            </div>
          )}
          {images.length > 0 && imageUrls.length === 0 && (
            <button
              type="button"
              onClick={uploadImages}
              disabled={uploading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Upload Images'}
            </button>
          )}
          {imageUrls.length > 0 && (
            <div className="text-sm text-green-600">
              ✓ {imageUrls.length} image(s) uploaded successfully
            </div>
          )}
        </div>
        <button 
          type="submit" 
          disabled={submitting || uploading} 
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {submitting ? 'Creating Listing...' : 'Create Listing'}
        </button>
      </form>
    </div>
  );
};

export default CreateListing;



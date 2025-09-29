import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { propertyAPI } from '../services/api';
import toast from 'react-hot-toast';

const CreateListing = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    type: 'apartment',
    bedrooms: '',
    bathrooms: '',
    squareFootage: '',
    city: '',
    region: '',
    images: ['']
  });
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onImageChange = (idx, value) => {
    const next = [...form.images];
    next[idx] = value;
    setForm({ ...form, images: next });
  };

  const addImage = () => setForm({ ...form, images: [...form.images, ''] });
  const removeImage = (idx) => setForm({ ...form, images: form.images.filter((_, i) => i !== idx) });

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        price: Number(form.price),
        type: form.type,
        bedrooms: Number(form.bedrooms) || undefined,
        bathrooms: Number(form.bathrooms) || undefined,
        squareFootage: Number(form.squareFootage) || undefined,
        location: { city: form.city, region: form.region },
        images: form.images.filter(Boolean)
      };
      await propertyAPI.createProperty(payload);
      toast.success('Listing created');
      navigate('/');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to create listing');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-4 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Create Listing</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input name="title" value={form.title} onChange={onChange} className="form-input" placeholder="Title" required />
        <textarea name="description" value={form.description} onChange={onChange} className="form-input" rows={5} placeholder="Description" required />
        <div className="grid grid-cols-2 gap-3">
          <input name="price" value={form.price} onChange={onChange} className="form-input" placeholder="Price" required />
          <select name="type" value={form.type} onChange={onChange} className="form-input">
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="villa">Villa</option>
          </select>
          <input name="bedrooms" value={form.bedrooms} onChange={onChange} className="form-input" placeholder="Bedrooms" />
          <input name="bathrooms" value={form.bathrooms} onChange={onChange} className="form-input" placeholder="Bathrooms" />
          <input name="squareFootage" value={form.squareFootage} onChange={onChange} className="form-input" placeholder="Square Footage" />
          <input name="city" value={form.city} onChange={onChange} className="form-input" placeholder="City" />
          <input name="region" value={form.region} onChange={onChange} className="form-input" placeholder="Region" />
        </div>
        <div className="space-y-2">
          <div className="font-medium">Images</div>
          {form.images.map((url, idx) => (
            <div key={idx} className="flex gap-2">
              <input value={url} onChange={(e) => onImageChange(idx, e.target.value)} className="form-input flex-1" placeholder="Image URL" />
              <button type="button" onClick={() => removeImage(idx)} className="btn-secondary">Remove</button>
            </div>
          ))}
          <button type="button" onClick={addImage} className="btn-outline">Add Image</button>
        </div>
        <button disabled={submitting} className="btn-primary">{submitting ? 'Creating…' : 'Create Listing'}</button>
      </form>
    </div>
  );
};

export default CreateListing;



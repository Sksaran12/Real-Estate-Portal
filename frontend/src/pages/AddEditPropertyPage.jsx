import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import AIDescriptionGenerator from '../components/ai/AIDescriptionGenerator';
import { Building2, MapPin, CheckCircle, Plus, Trash2, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

const AddEditPropertyPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    propertyType: 'sale',
    category: 'apartment',
    address: '',
    city: 'Guwahati',
    state: 'Assam',
    zipcode: '781005',
    bedrooms: 2,
    bathrooms: 2,
    areaSqFt: 1200,
    amenities: ['Elevator', 'Power Backup', '24/7 Security', 'Covered Parking'],
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200'],
  });

  const [imageUrlInput, setImageUrlInput] = useState('');
  const [loading, setLoading] = useState(false);

  const availableAmenities = [
    'Elevator',
    'Power Backup',
    'Covered Parking',
    '24/7 Security',
    'Gym',
    'Swimming Pool',
    'Balcony',
    'Water Storage 24/7',
    'CCTV Surveillance',
    'Gated Community',
    'High Speed Wifi',
    'Modular Kitchen',
  ];

  // Sanitize text to prevent SSIT / XSS payload injection
  const sanitizeText = (str) => {
    if (!str) return '';
    return str
      .replace(/{{|}}|{%.*?%}/g, '') // Strip template syntax (SSIT)
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ''); // Strip script tags
  };

  const handleAmenityToggle = (amenity) => {
    setFormData((prev) => {
      const exists = prev.amenities.includes(amenity);
      if (exists) {
        return { ...prev, amenities: prev.amenities.filter((a) => a !== amenity) };
      } else {
        return { ...prev, amenities: [...prev.amenities, amenity] };
      }
    });
  };

  const handleAddImage = () => {
    if (!imageUrlInput.trim()) return;

    // Validate URL format
    try {
      const parsedUrl = new URL(imageUrlInput.trim());
      if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
        toast.error('Only HTTP and HTTPS image URLs are permitted');
        return;
      }
    } catch (e) {
      toast.error('Please enter a valid image URL');
      return;
    }

    setFormData((prev) => ({ ...prev, images: [...prev.images, imageUrlInput.trim()] }));
    setImageUrlInput('');
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || (user.role !== 'owner' && user.role !== 'admin')) {
      toast.error('Only Property Owners and Admins can post listings');
      return;
    }

    // Input Validation Guard
    if (Number(formData.price) <= 0 || Number(formData.areaSqFt) <= 0) {
      toast.error('Price and Area must be positive numbers');
      return;
    }

    const sanitizedPayload = {
      ...formData,
      title: sanitizeText(formData.title),
      description: sanitizeText(formData.description),
      address: sanitizeText(formData.address),
      city: sanitizeText(formData.city),
    };

    setLoading(true);
    try {
      const { data } = await API.post('/properties', sanitizedPayload);
      if (data.success) {
        toast.success(data.message || 'Listing submitted!');
        navigate(user.role === 'admin' ? '/admin' : '/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Post New Property Listing in Guwahati</h1>
        <p className="text-sm text-slate-500 mt-1">
          Provide accurate street address details, photos, and use AI to auto-generate a polished description.
        </p>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
        {/* Basic Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">1. Basic Information</h3>
          <div>
            <label className="text-xs font-bold uppercase text-slate-600">Property Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Premium 3BHK Luxury Flat in GS Road"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full mt-1 px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-slate-600">Listing Purpose</label>
              <select
                value={formData.propertyType}
                onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                className="w-full mt-1 px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white font-medium"
              >
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-slate-600">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full mt-1 px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white font-medium"
              >
                <option value="apartment">Apartment / Flat</option>
                <option value="house">Bungalow / Independent House</option>
                <option value="villa">Villa</option>
                <option value="commercial">Commercial Office</option>
                <option value="studio">Studio Flat</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-slate-600">Price (₹)</label>
              <input
                type="number"
                required
                min="1000"
                placeholder="e.g. 8500000 for ₹85 Lakhs"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full mt-1 px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Location Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">2. Exact Address & Landmark Details</h3>
          <div>
            <label className="text-xs font-bold uppercase text-slate-600">Street Address & Landmark</label>
            <input
              type="text"
              required
              placeholder="e.g. Flat 4B, Royal Enclave, GS Road, Opposite The Hub Mall, Christian Basti"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full mt-1 px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-slate-600">City / Locality</label>
              <input
                type="text"
                required
                placeholder="Guwahati"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full mt-1 px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-slate-600">State</label>
              <input
                type="text"
                required
                placeholder="Assam"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full mt-1 px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-slate-600">PIN Code</label>
              <input
                type="text"
                placeholder="781005"
                value={formData.zipcode}
                onChange={(e) => setFormData({ ...formData, zipcode: e.target.value })}
                className="w-full mt-1 px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">3. Specifications</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-slate-600">Bedrooms (BHK)</label>
              <input
                type="number"
                required
                min="0"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                className="w-full mt-1 px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-slate-600">Bathrooms</label>
              <input
                type="number"
                required
                min="0"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                className="w-full mt-1 px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-slate-600">Area (Sq Ft)</label>
              <input
                type="number"
                required
                min="50"
                value={formData.areaSqFt}
                onChange={(e) => setFormData({ ...formData, areaSqFt: e.target.value })}
                className="w-full mt-1 px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Amenities Selector */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">4. Select Amenities</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {availableAmenities.map((amenity) => {
              const selected = formData.amenities.includes(amenity);
              return (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => handleAmenityToggle(amenity)}
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center space-x-2 transition-all ${
                    selected
                      ? 'bg-brand-50 border-brand-500 text-brand-700 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <CheckCircle className={`w-4 h-4 ${selected ? 'text-brand-600' : 'text-slate-300'}`} />
                  <span>{amenity}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Property Description & AI Generator */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-2 gap-2">
            <h3 className="text-lg font-bold text-slate-900">5. Property Description</h3>
            <AIDescriptionGenerator
              propertyData={formData}
              onGenerated={(desc) => setFormData((prev) => ({ ...prev, description: desc }))}
            />
          </div>

          <textarea
            rows="5"
            required
            placeholder="Write a descriptive copy or click the AI generator button above..."
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            className="w-full p-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-normal leading-relaxed resize-none"
          />
        </div>

        {/* Images */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">6. Photo Gallery</h3>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Paste Image URL (Unsplash or Cloudinary)..."
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
            <button
              type="button"
              onClick={handleAddImage}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-900 flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add URL</span>
            </button>
          </div>

          {/* Added Image previews */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {formData.images.map((img, idx) => (
              <div key={idx} className="relative aspect-[16/10] rounded-xl overflow-hidden group border border-slate-200">
                <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-base shadow-xl shadow-brand-500/25 transition-all"
        >
          {loading ? 'Submitting Listing...' : user?.role === 'admin' ? 'Publish Property' : 'Submit Property for Approval'}
        </button>
      </form>
    </div>
  );
};

export default AddEditPropertyPage;

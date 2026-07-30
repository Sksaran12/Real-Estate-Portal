import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import { useFavorite } from '../context/FavoriteContext';
import OwnerContactModal from '../components/properties/OwnerContactModal';
import {
  Bed,
  Bath,
  Maximize2,
  MapPin,
  Heart,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Eye,
  Calendar,
  Sparkles,
  ArrowLeft,
  Building,
  Navigation,
  Compass,
  ExternalLink,
} from 'lucide-react';
import toast from 'react-hot-toast';

const PropertyDetailPage = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  const { isFavorite, toggleFavorite } = useFavorite();
  const favStatus = property ? isFavorite(property._id) : false;

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/properties/${id}`);
        if (data.success) {
          setProperty(data.data);
        }
      } catch (error) {
        toast.error('Failed to load property details');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-sm text-slate-500 font-medium">Loading property details...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Listing Not Found</h2>
        <p className="text-slate-500 text-sm">The property you are looking for does not exist or has been removed.</p>
        <Link to="/properties" className="inline-block px-6 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-sm">
          Back to Listings
        </Link>
      </div>
    );
  }

  // Format price in Indian Rupee (Lakhs & Crores)
  const formatPrice = (price, type) => {
    let formatted = '';
    if (price >= 10000000) {
      formatted = `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      formatted = `₹${(price / 100000).toFixed(2)} Lakhs`;
    } else {
      formatted = `₹${price.toLocaleString('en-IN')}`;
    }
    return type === 'rent' ? `${formatted} / month` : formatted;
  };

  const images = property.images && property.images.length > 0 ? property.images : [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200'
  ];

  const fullAddressString = `${property.location?.address}, ${property.location?.city}, ${property.location?.state} PIN: ${property.location?.zipcode || '781005'}`;
  const mapSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddressString)}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back Link */}
      <Link
        to="/properties"
        className="inline-flex items-center space-x-2 text-sm font-semibold text-slate-600 hover:text-brand-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to search listings</span>
      </Link>

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <span
              className={`px-3 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wide ${
                property.propertyType === 'rent' ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white'
              }`}
            >
              For {property.propertyType}
            </span>
            <span className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 capitalize">
              {property.category}
            </span>
            {property.status === 'approved' && (
              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Guwahati Property</span>
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">{property.title}</h1>
          <p className="text-sm font-semibold text-slate-600 flex items-center space-x-1.5">
            <MapPin className="w-4 h-4 text-brand-500 flex-shrink-0" />
            <span>{fullAddressString}</span>
          </p>
        </div>

        {/* Price & Favorite Action */}
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-xs text-slate-400 font-bold uppercase">Asking Price</p>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {formatPrice(property.price, property.propertyType)}
            </p>
          </div>
          <button
            onClick={() => toggleFavorite(property._id)}
            className={`p-3.5 rounded-2xl border transition-all ${
              favStatus
                ? 'bg-red-50 border-red-200 text-red-500'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
            title="Save to Favorites"
          >
            <Heart className={`w-6 h-6 ${favStatus ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Image Gallery Showcase */}
      <div className="space-y-4">
        <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden bg-slate-900 shadow-xl border border-slate-200">
          <img
            src={images[activeImage]}
            alt={property.title}
            className="w-full h-full object-cover transition-all duration-300"
          />
        </div>

        {/* Thumbnails list */}
        {images.length > 1 && (
          <div className="flex items-center space-x-3 overflow-x-auto pb-2">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`relative w-24 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                  activeImage === index ? 'border-brand-600 scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`Thumbnail ${index}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Grid: Details vs Owner Contact Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Specifications, Description, Location Map, Amenities */}
        <div className="lg:col-span-2 space-y-10">
          {/* Specs Grid */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-slate-50 rounded-2xl">
              <Bed className="w-6 h-6 text-brand-600 mx-auto mb-1" />
              <span className="block text-xl font-bold text-slate-900">{property.bedrooms} BHK</span>
              <span className="text-xs font-semibold text-slate-500 uppercase">Bedrooms</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl">
              <Bath className="w-6 h-6 text-brand-600 mx-auto mb-1" />
              <span className="block text-xl font-bold text-slate-900">{property.bathrooms}</span>
              <span className="text-xs font-semibold text-slate-500 uppercase">Bathrooms</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl">
              <Maximize2 className="w-6 h-6 text-brand-600 mx-auto mb-1" />
              <span className="block text-xl font-bold text-slate-900">{property.areaSqFt}</span>
              <span className="text-xs font-semibold text-slate-500 uppercase">Sq Ft Area</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl">
              <Eye className="w-6 h-6 text-brand-600 mx-auto mb-1" />
              <span className="block text-xl font-bold text-slate-900">{property.views || 1}</span>
              <span className="text-xs font-semibold text-slate-500 uppercase">Total Views</span>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xl font-bold text-slate-900">Property Overview</h3>
            <p className="text-slate-700 leading-relaxed whitespace-pre-line text-sm sm:text-base font-normal">
              {property.description}
            </p>
          </div>

          {/* Location & Exact Address Details Card */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                  <Navigation className="w-5 h-5 text-brand-600" />
                  <span>Exact Address & Location Details</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Guwahati, Assam locality overview</p>
              </div>
              <a
                href={mapSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-brand-50 text-brand-700 font-bold text-xs hover:bg-brand-100 transition-colors border border-brand-200"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
              <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Street Address & Landmark</span>
                <p className="font-bold text-slate-900 text-sm">{property.location?.address}</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">City & State</span>
                <p className="font-bold text-slate-900 text-sm">
                  {property.location?.city}, {property.location?.state} (PIN: {property.location?.zipcode || '781005'})
                </p>
              </div>
            </div>

            {/* Visual Location Map Preview Container */}
            <div className="relative h-48 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center text-center p-6 bg-gradient-to-tr from-slate-900 to-navy-900 text-white">
              <div className="space-y-2 z-10">
                <MapPin className="w-8 h-8 text-brand-400 mx-auto animate-bounce" />
                <h4 className="font-bold text-base">{property.location?.address}</h4>
                <p className="text-xs text-slate-300">Located in prime {property.location?.city}, Assam</p>
              </div>
            </div>
          </div>

          {/* Amenities Grid */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xl font-bold text-slate-900">Amenities & Key Features</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {property.amenities && property.amenities.length > 0 ? (
                property.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center space-x-2.5 p-3 bg-slate-50 rounded-xl text-sm font-semibold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{amenity}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 italic">No specific amenities listed.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Owner Profile & Inquiry Action Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-lg space-y-6 sticky top-28">
            <div className="flex items-center space-x-4 pb-6 border-b border-slate-100">
              <img
                src={property.owner?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'}
                alt={property.owner?.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-brand-500 shadow-sm"
              />
              <div>
                <h4 className="text-base font-bold text-slate-900">{property.owner?.name || 'Property Owner'}</h4>
                <p className="text-xs text-slate-500">Verified Guwahati Seller / Owner</p>
                <div className="flex items-center space-x-1 text-[11px] font-semibold text-emerald-600 mt-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Identity Confirmed</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setContactModalOpen(true)}
                className="w-full py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-xl shadow-brand-500/25 transition-all flex items-center justify-center space-x-2"
              >
                <Mail className="w-4 h-4" />
                <span>Contact Owner / Send Inquiry</span>
              </button>

              <a
                href={`tel:${property.owner?.phone || '+919435098765'}`}
                className="w-full py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-colors flex items-center justify-center space-x-2"
              >
                <Phone className="w-4 h-4" />
                <span>{property.owner?.phone || '+91 94350 98765'}</span>
              </a>
            </div>

            <div className="text-xs text-slate-400 text-center pt-2">
              <p>🔒 Direct Guwahati Seller • 0% Brokerage</p>
            </div>
          </div>
        </div>
      </div>

      {/* Inquiry Modal */}
      <OwnerContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        property={property}
      />
    </div>
  );
};

export default PropertyDetailPage;

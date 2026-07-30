import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Bed, Bath, Maximize2, MapPin, Sparkles } from 'lucide-react';
import { useFavorite } from '../../context/FavoriteContext';

const PropertyCard = ({ property }) => {
  const { isFavorite, toggleFavorite } = useFavorite();
  const favStatus = isFavorite(property._id);

  // Indian Rupee price formatter (Lakhs & Crores formatting)
  const formatPrice = (price, type) => {
    let formatted = '';
    if (price >= 10000000) {
      formatted = `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      formatted = `₹${(price / 100000).toFixed(2)} Lakhs`;
    } else {
      formatted = `₹${price.toLocaleString('en-IN')}`;
    }
    return type === 'rent' ? `${formatted}/mo` : formatted;
  };

  const defaultImg =
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800';
  const displayImage = property.images && property.images.length > 0 ? property.images[0] : defaultImg;

  return (
    <div className="group bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Image & Badges Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={displayImage}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/30 pointer-events-none" />

        {/* Property Type Badge */}
        <div className="absolute top-3 left-3 flex items-center space-x-2">
          <span
            className={`px-3 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wide shadow-md ${
              property.propertyType === 'rent'
                ? 'bg-amber-500 text-white'
                : 'bg-emerald-600 text-white'
            }`}
          >
            For {property.propertyType}
          </span>
          {property.featured && (
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-600 text-white flex items-center space-x-1 shadow-md">
              <Sparkles className="w-3 h-3" />
              <span>Featured</span>
            </span>
          )}
        </div>

        {/* Save Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(property._id);
          }}
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-transform duration-200 active:scale-90 shadow-md ${
            favStatus
              ? 'bg-red-500 text-white'
              : 'bg-white/80 text-slate-700 hover:bg-white hover:text-red-500'
          }`}
          title={favStatus ? 'Remove from Favorites' : 'Save to Favorites'}
        >
          <Heart className={`w-5 h-5 ${favStatus ? 'fill-current' : ''}`} />
        </button>

        {/* Bottom Price Overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
          <p className="text-2xl font-extrabold tracking-tight drop-shadow-md">
            {formatPrice(property.price, property.propertyType)}
          </p>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white/20 backdrop-blur-md capitalize">
            {property.category}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center space-x-1 text-xs font-semibold text-slate-500 mb-1">
            <MapPin className="w-3.5 h-3.5 text-brand-500" />
            <span className="truncate">
              {property.location?.city}, {property.location?.state}
            </span>
          </div>

          <Link
            to={`/properties/${property._id}`}
            className="block text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1"
          >
            {property.title}
          </Link>

          <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
            {property.description}
          </p>
        </div>

        {/* Property Specs Grid */}
        <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-xs font-semibold text-slate-700">
          <div className="flex items-center space-x-1.5 bg-slate-50 p-2 rounded-xl">
            <Bed className="w-4 h-4 text-brand-500" />
            <span>{property.bedrooms} BHK</span>
          </div>
          <div className="flex items-center space-x-1.5 bg-slate-50 p-2 rounded-xl">
            <Bath className="w-4 h-4 text-brand-500" />
            <span>{property.bathrooms} Bath</span>
          </div>
          <div className="flex items-center space-x-1.5 bg-slate-50 p-2 rounded-xl truncate">
            <Maximize2 className="w-4 h-4 text-brand-500" />
            <span>{property.areaSqFt} sq ft</span>
          </div>
        </div>

        {/* View Details Link */}
        <Link
          to={`/properties/${property._id}`}
          className="w-full py-2.5 rounded-xl font-semibold text-center text-sm text-brand-700 bg-brand-50 hover:bg-brand-600 hover:text-white transition-all duration-200 border border-brand-100"
        >
          View Details & Contact Owner
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;

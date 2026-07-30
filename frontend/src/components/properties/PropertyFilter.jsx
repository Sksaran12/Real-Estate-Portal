import React from 'react';
import { Search, MapPin, SlidersHorizontal, RotateCcw } from 'lucide-react';

const PropertyFilter = ({ filters, setFilters, onReset }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <aside className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-2 text-slate-900 font-bold text-lg">
          <SlidersHorizontal className="w-5 h-5 text-brand-600" />
          <span>Filter Properties</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs font-semibold text-slate-500 hover:text-brand-600 flex items-center space-x-1 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Keyword Search */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Keyword Search</label>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            name="search"
            value={filters.search || ''}
            onChange={handleChange}
            placeholder="GS Road, 3BHK flat, river view..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>
      </div>

      {/* Location / City */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Location / City</label>
        <div className="relative">
          <MapPin className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            name="city"
            value={filters.city || ''}
            onChange={handleChange}
            placeholder="Guwahati, Ganeshguri, Beltola..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>
      </div>

      {/* Property Purpose (Sale / Rent) */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Property Purpose</label>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
          {['all', 'sale', 'rent'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFilters((prev) => ({ ...prev, propertyType: type }))}
              className={`py-2 rounded-lg capitalize transition-all ${
                filters.propertyType === type
                  ? 'bg-white text-brand-600 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Property Category</label>
        <select
          name="category"
          value={filters.category || 'all'}
          onChange={handleChange}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
        >
          <option value="all">All Categories</option>
          <option value="apartment">Apartment / Flat</option>
          <option value="house">Bungalow / Independent House</option>
          <option value="villa">Luxury Villa</option>
          <option value="commercial">Commercial Office</option>
          <option value="studio">Studio Flat</option>
        </select>
      </div>

      {/* Bedrooms */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Bedrooms (BHK)</label>
        <div className="grid grid-cols-5 gap-1 text-xs font-bold text-slate-700">
          {['all', '1', '2', '3', '4+'].map((bhk) => (
            <button
              key={bhk}
              type="button"
              onClick={() => setFilters((prev) => ({ ...prev, bedrooms: bhk }))}
              className={`py-2 rounded-lg border transition-all ${
                filters.bedrooms === bhk
                  ? 'bg-brand-600 border-brand-600 text-white shadow-sm'
                  : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              {bhk}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range in ₹ */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Price Range (₹)</label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice || ''}
            onChange={handleChange}
            placeholder="Min Price (₹)"
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice || ''}
            onChange={handleChange}
            placeholder="Max Price (₹)"
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>
      </div>

      {/* Sort By */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Sort Results By</label>
        <select
          name="sort"
          value={filters.sort || 'newest'}
          onChange={handleChange}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
        >
          <option value="newest">Newest Listed</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="views">Most Viewed</option>
        </select>
      </div>
    </aside>
  );
};

export default PropertyFilter;

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PropertyFilter from '../components/properties/PropertyFilter';
import PropertyCard from '../components/properties/PropertyCard';
import API from '../services/api';
import { Building2, SearchX } from 'lucide-react';

const PropertySearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    city: searchParams.get('city') || '',
    propertyType: searchParams.get('propertyType') || 'all',
    category: searchParams.get('category') || 'all',
    bedrooms: searchParams.get('bedrooms') || 'all',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'newest',
  });

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (filters.search) queryParams.set('search', filters.search);
        if (filters.city) queryParams.set('city', filters.city);
        if (filters.propertyType && filters.propertyType !== 'all') queryParams.set('propertyType', filters.propertyType);
        if (filters.category && filters.category !== 'all') queryParams.set('category', filters.category);
        if (filters.bedrooms && filters.bedrooms !== 'all') queryParams.set('bedrooms', filters.bedrooms);
        if (filters.minPrice) queryParams.set('minPrice', filters.minPrice);
        if (filters.maxPrice) queryParams.set('maxPrice', filters.maxPrice);
        if (filters.sort) queryParams.set('sort', filters.sort);

        setSearchParams(queryParams, { replace: true });

        const { data } = await API.get(`/properties?${queryParams.toString()}`);
        if (data.success) {
          setProperties(data.data);
          setTotal(data.total);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [filters]);

  const handleReset = () => {
    setFilters({
      search: '',
      city: '',
      propertyType: 'all',
      category: 'all',
      bedrooms: 'all',
      minPrice: '',
      maxPrice: '',
      sort: 'newest',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Property Listings</h1>
          <p className="text-sm text-slate-500 mt-1">
            Found <span className="font-bold text-slate-900">{total}</span> verified properties matching your criteria
          </p>
        </div>
      </div>

      {/* Main Grid: Sidebar + Listings */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1">
          <PropertyFilter filters={filters} setFilters={setFilters} onReset={handleReset} />
        </div>

        {/* Property Grid Container */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-80 bg-slate-200 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <SearchX className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">No properties found</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                We couldn't find any properties matching your exact search filters. Try adjusting your price range or location.
              </p>
              <button
                onClick={handleReset}
                className="px-6 py-2.5 rounded-xl font-bold text-sm bg-brand-600 text-white hover:bg-brand-700 transition-colors shadow-md"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertySearchPage;

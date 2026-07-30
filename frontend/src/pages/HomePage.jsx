import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Building2,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Home as HomeIcon,
  Award,
  TrendingUp,
  SlidersHorizontal,
  Star,
  Users,
  Building,
  RefreshCw,
} from 'lucide-react';
import PropertyCard from '../components/properties/PropertyCard';
import MortgageCalculator from '../components/common/MortgageCalculator';
import TestimonialSection from '../components/common/TestimonialSection';
import API from '../services/api';

const HomePage = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [searchParams, setSearchParams] = useState({
    propertyType: 'all',
    city: '',
    category: 'all',
  });
  const navigate = useNavigate();

  const fetchFeatured = async () => {
    setLoading(true);
    setFetchError(false);
    try {
      const { data } = await API.get('/properties?limit=6');
      if (data.success && data.data) {
        setFeaturedProperties(data.data);
      }
    } catch (err) {
      console.error('Error fetching featured properties:', err);
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatured();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (searchParams.propertyType !== 'all') query.set('propertyType', searchParams.propertyType);
    if (searchParams.city) query.set('city', searchParams.city);
    if (searchParams.category !== 'all') query.set('category', searchParams.category);
    navigate(`/properties?${query.toString()}`);
  };

  const cityCategories = [
    { name: 'Guwahati', count: '180+ Verified Flats', img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=600' },
    { name: 'GS Road', count: '95+ Commercial & Luxury', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600' },
    { name: 'Beltola', count: '110+ Residential Flats', img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=600' },
    { name: 'Kolkata', count: '210+ Premium Properties', img: 'https://images.unsplash.com/photo-1531218150217-54595bc2b934?auto=format&fit=crop&q=80&w=600' },
  ];

  return (
    <div className="space-y-24 pb-20 overflow-x-hidden">
      {/* 🚀 HERO SECTION WITH GUWAHATI & INDIAN REAL ESTATE FOCUS */}
      <section className="relative min-h-[640px] bg-navy-950 flex items-center justify-center pt-12 pb-24 overflow-hidden">
        {/* Background Ambient Glows & Image Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=2400"
            alt="Hero Background"
            className="w-full h-full object-cover opacity-20 scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-950/90 via-navy-950/80 to-slate-900" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-brand-600/20 blur-[140px] rounded-full pointer-events-none" />
        </div>

        {/* Hero Main Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center space-y-10">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2.5 px-4 py-2 rounded-full bg-brand-500/15 border border-brand-400/30 text-brand-300 text-xs font-extrabold uppercase tracking-widest backdrop-blur-md shadow-lg shadow-brand-500/10 text-white">
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>Assam & India's Premier Real Estate Portal</span>
          </div>

          {/* Heading */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-none">
              Find Your Dream Property in <br className="hidden sm:block" />
              <span className="text-white bg-clip-text bg-gradient-to-r from-brand-400 via-blue-300 to-indigo-200">
                Guwahati & Across India
              </span>
            </h1>

            <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
              Explore verified 1BHK, 2BHK, 3BHK flats, luxury bungalows, and commercial suites on GS Road, Zoo Road, Beltola, Ganeshguri, and Dispur.
            </p>
          </div>

          {/* Floating Live Metrics Badges */}
          <div className="flex flex-wrap justify-center gap-4 text-xs font-bold text-slate-200">
            <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15">
              <Building className="w-4 h-4 text-brand-400" />
              <span>5,400+ Active Assam Properties</span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15">
              <Star className="w-4 h-4 text-amber-400 fill-current" />
              <span>4.9/5 Trust Score</span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>0% Brokerage Direct Owner Contacts</span>
            </div>
          </div>

          {/* Search Box Container */}
          <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-xl p-4 sm:p-5 rounded-3xl shadow-2xl border border-white/40 text-left space-y-4">
            {/* Search Mode Tabs */}
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              {[
                { id: 'all', label: 'All Properties' },
                { id: 'sale', label: 'Buy Flat / House' },
                { id: 'rent', label: 'Rent Flat / Office' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSearchParams((prev) => ({ ...prev, propertyType: tab.id }))}
                  className={`px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase transition-all ${
                    searchParams.propertyType === tab.id
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Form Inputs */}
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="relative">
                <MapPin className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Guwahati, GS Road, Beltola..."
                  value={searchParams.city}
                  onChange={(e) => setSearchParams((prev) => ({ ...prev, city: e.target.value }))}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 bg-slate-50/50"
                />
              </div>

              <div className="relative">
                <Building2 className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
                <select
                  value={searchParams.category}
                  onChange={(e) => setSearchParams((prev) => ({ ...prev, category: e.target.value }))}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 bg-slate-50/50"
                >
                  <option value="all">All Categories</option>
                  <option value="apartment">Apartments / Flats</option>
                  <option value="house">Bungalows / Independent Houses</option>
                  <option value="villa">Luxury Villas</option>
                  <option value="commercial">Commercial Offices</option>
                  <option value="studio">Studio Flats</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm transition-all shadow-xl shadow-brand-500/30 flex items-center justify-center space-x-2 active:scale-98"
              >
                <Search className="w-5 h-5" />
                <span>Search Properties</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 🏢 FEATURED LISTINGS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600">Handpicked Listings</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">Featured Properties in Assam</h2>
          </div>
          <Link
            to="/properties"
            className="inline-flex items-center space-x-2 font-bold text-brand-600 hover:text-brand-700 text-sm"
          >
            <span>Explore All Listings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 bg-slate-200 animate-pulse rounded-3xl" />
            ))}
          </div>
        ) : fetchError || featuredProperties.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
              <RefreshCw className="w-6 h-6 animate-spin" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Connecting to Cloud Backend Database...</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                If the server on Render was idle, it takes ~20 seconds to spin up. Click below to load property listings.
              </p>
            </div>
            <button
              onClick={fetchFeatured}
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-all inline-flex items-center space-x-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Load Property Listings</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </section>

      {/* 🌆 POPULAR GUWAHATI LOCALITIES & CITIES */}
      <section className="bg-slate-100 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600">Prime Locations</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Explore Key Hubs in Assam</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cityCategories.map((city, idx) => (
              <Link
                key={idx}
                to={`/properties?city=${city.name}`}
                className="group relative aspect-[4/5] rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300"
              >
                <img
                  src={city.img}
                  alt={city.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                  <h3 className="text-2xl font-extrabold">{city.name}</h3>
                  <p className="text-xs font-semibold text-slate-300">{city.count}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 🧮 INTERACTIVE MORTGAGE & EMI CALCULATOR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MortgageCalculator />
      </section>

      {/* ⭐ TESTIMONIALS & REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TestimonialSection />
      </section>
    </div>
  );
};

export default HomePage;

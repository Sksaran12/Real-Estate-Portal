import React, { useState } from 'react';
import { MapPin, Navigation, School, HeartPulse, ShoppingBag, TrendingUp, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const GuwahatiNeighborhoodGuide = () => {
  const [activeTab, setActiveTab] = useState(0);

  const neighborhoods = [
    {
      name: 'GS Road & Christian Basti',
      tagline: 'Guwahati Commercial & Luxury High-Rise Hub',
      avgPriceSqFt: '₹7,800 - ₹11,500 / sq ft',
      growthRate: '+9.4% Annual Appreciation',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
      highlights: [
        { icon: ShoppingBag, title: 'Shopping Malls', desc: 'City Centre Mall, Guwahati Central, The Hub' },
        { icon: HeartPulse, title: 'Top Healthcare', desc: 'Apollo Excelcare, Down Town Hospital' },
        { icon: School, title: 'Prestigious Schools', desc: 'Don Bosco School, Srimanta Shankar Academy' },
      ],
      description:
        'GS Road is the bustling financial spine of Guwahati. Known for multi-storey residential towers, corporate offices, fine dining, and seamless metro connectivity.',
    },
    {
      name: 'Zoo Road & RG Baruah Rd',
      tagline: 'Prime Residential & Cultural Center',
      avgPriceSqFt: '₹6,500 - ₹9,200 / sq ft',
      growthRate: '+8.1% Annual Appreciation',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800',
      highlights: [
        { icon: ShoppingBag, title: 'Retail & Dining', desc: 'Zoo Road Market, Vishal Mega Mart, Cafes' },
        { icon: HeartPulse, title: 'Hospitals', desc: 'Guwahati Neurological Research Centre (GNRC)' },
        { icon: School, title: 'Education', desc: 'Cotton University nearby, B. Borooah College' },
      ],
      description:
        'Zoo Road offers central connectivity to State Zoo, Chandmari, and Ganeshguri. Popular among families seeking spacious 2BHK/3BHK luxury apartments.',
    },
    {
      name: 'Beltola & Survey',
      tagline: 'Peaceful Residential Enclave & Markets',
      avgPriceSqFt: '₹5,400 - ₹7,800 / sq ft',
      growthRate: '+8.8% Annual Appreciation',
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=800',
      highlights: [
        { icon: ShoppingBag, title: 'Bi-Weekly Markets', desc: 'Famous Beltola Traditional Produce Market' },
        { icon: HeartPulse, title: 'Medical Hubs', desc: 'Dispur Hospital, Hayat Hospital' },
        { icon: School, title: 'Institutions', desc: 'Sarala Birla Gyan Jyoti, Maharishi Vidya Mandir' },
      ],
      description:
        'Beltola is one of Guwahati’s fastest growing residential belts, featuring peaceful gated communities, wide interior roads, and excellent rental yields.',
    },
    {
      name: 'Dispur & Ganeshguri',
      tagline: 'Assam Capital Complex & Govt Offices',
      avgPriceSqFt: '₹6,800 - ₹9,800 / sq ft',
      growthRate: '+7.9% Annual Appreciation',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
      highlights: [
        { icon: ShoppingBag, title: 'Government Hub', desc: 'Assam Secretariat, Janata Bhawan Complex' },
        { icon: HeartPulse, title: 'Emergency Care', desc: 'Dispur Poly Clinic & Nursing Home' },
        { icon: School, title: 'Schools', desc: 'Dispur Govt Higher Secondary School' },
      ],
      description:
        'Home to the Assam State Capitol. High demand for executive rentals, commercial suites, and independent residential duplexes.',
    },
  ];

  const current = neighborhoods[activeTab];

  return (
    <div className="bg-gradient-to-br from-slate-900 via-navy-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-2xl border border-slate-800 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-400/30 text-brand-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Navigation className="w-3.5 h-3.5" />
              <span>Guwahati Locality Intelligence</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Explore Prime Neighborhoods in Guwahati
            </h2>
          </div>
          <Link
            to="/properties"
            className="inline-flex items-center space-x-2 text-xs font-bold text-brand-300 hover:text-white transition-colors"
          >
            <span>View All Locality Properties</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Neighborhood Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-4">
          {neighborhoods.map((n, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center space-x-2 ${
                activeTab === idx
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30 scale-102'
                  : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{n.name}</span>
            </button>
          ))}
        </div>

        {/* Active Neighborhood Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Image with overlay stats */}
          <div className="lg:col-span-5 relative group rounded-3xl overflow-hidden shadow-xl border border-white/10 aspect-[4/3]">
            <img
              src={current.image}
              alt={current.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 space-y-1">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-300">Avg Property Rate</span>
                <span className="text-emerald-400 font-extrabold">{current.avgPriceSqFt}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-300">Annual Price Growth</span>
                <span className="text-amber-300 font-extrabold flex items-center space-x-1">
                  <TrendingUp className="w-3.5 h-3.5 inline mr-1" />
                  {current.growthRate}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Details & Key Landmarks */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">{current.tagline}</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">{current.name}</h3>
              <p className="text-sm text-slate-300 leading-relaxed mt-2">{current.description}</p>
            </div>

            {/* Landmark Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {current.highlights.map((h, idx) => {
                const Icon = h.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 hover:border-brand-500/50 transition-all duration-300 space-y-2 group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-brand-500/20 text-brand-300 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{h.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-normal leading-tight">{h.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action CTA */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
              <Link
                to={`/properties?city=${encodeURIComponent(current.name.split('&')[0].trim())}`}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-500/30 transition-all text-center flex items-center justify-center space-x-2"
              >
                <MapPin className="w-4 h-4" />
                <span>Browse {current.name} Listings</span>
              </Link>
              <div className="flex items-center space-x-2 text-xs text-slate-400 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Verified Street Addresses & Land Records</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuwahatiNeighborhoodGuide;

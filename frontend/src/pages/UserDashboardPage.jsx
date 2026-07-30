import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFavorite } from '../context/FavoriteContext';
import PropertyCard from '../components/properties/PropertyCard';
import API from '../services/api';
import { Heart, Mail, Building, User, PlusCircle, ShieldCheck, Phone, CheckCircle2, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const UserDashboardPage = () => {
  const { user, updateProfile } = useAuth();
  const { favoritesList, fetchFavorites } = useFavorite();
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'favorites');
  const [myInquiries, setMyInquiries] = useState([]);
  const [ownerInquiries, setOwnerInquiries] = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(false);

  // Profile Edit state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl) setActiveTab(tabFromUrl);
  }, [searchParams]);

  useEffect(() => {
    if (activeTab === 'favorites') {
      fetchFavorites();
    } else if (activeTab === 'inquiries') {
      fetchMyInquiries();
    } else if (activeTab === 'owner-inquiries') {
      fetchOwnerInquiries();
    } else if (activeTab === 'listings') {
      fetchMyListings();
    }
  }, [activeTab]);

  const fetchMyInquiries = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/inquiries/my-inquiries');
      if (data.success) setMyInquiries(data.data);
    } catch (err) {
      console.error('Fetch inquiries error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOwnerInquiries = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/inquiries/owner-inquiries');
      if (data.success) setOwnerInquiries(data.data);
    } catch (err) {
      console.error('Fetch owner inquiries error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyListings = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/properties/my-listings');
      if (data.success) setMyListings(data.data);
    } catch (err) {
      console.error('Fetch listings error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    await updateProfile(profileForm);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Profile Welcome Header */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-5">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'}
            alt={user?.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-brand-500 shadow-sm"
          />
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-extrabold text-slate-900">{user?.name}</h1>
              <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-brand-100 text-brand-700">
                {user?.role}
              </span>
            </div>
            <p className="text-sm text-slate-500">{user?.email}</p>
          </div>
        </div>

        {(user?.role === 'owner' || user?.role === 'admin') && (
          <Link
            to="/add-property"
            className="px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm transition-all shadow-lg shadow-brand-500/20 flex items-center justify-center space-x-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Property</span>
          </Link>
        )}
      </div>

      {/* Dashboard Tabs Bar */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {[
          { id: 'favorites', label: 'Saved Favorites', icon: Heart },
          { id: 'inquiries', label: 'Sent Inquiries', icon: Mail },
          ...(user?.role === 'owner' || user?.role === 'admin'
            ? [
                { id: 'owner-inquiries', label: 'Received Inquiries', icon: Mail },
                { id: 'listings', label: 'My Property Listings', icon: Building },
              ]
            : []),
          { id: 'profile', label: 'Account Profile', icon: User },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSearchParams({ tab: tab.id });
              }}
              className={`px-5 py-3 rounded-2xl text-xs font-extrabold uppercase tracking-wide flex items-center space-x-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content 1: Saved Favorites */}
      {activeTab === 'favorites' && (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-900">Your Saved Properties ({favoritesList.length})</h3>
          {favoritesList.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
              <Heart className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-slate-500 text-sm font-medium">You haven't saved any property listings yet.</p>
              <Link to="/properties" className="inline-block px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs">
                Browse Properties
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {favoritesList.map((prop) => (
                <PropertyCard key={prop._id} property={prop} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content 2: Sent Inquiries */}
      {activeTab === 'inquiries' && (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-900">Inquiries You Sent ({myInquiries.length})</h3>
          {loading ? (
            <p className="text-sm text-slate-500">Loading inquiries...</p>
          ) : myInquiries.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
              <Mail className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-slate-500 text-sm">No inquiries submitted yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myInquiries.map((inquiry) => (
                <div key={inquiry._id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase text-brand-600">{inquiry.property?.title}</span>
                    <p className="text-sm text-slate-700 font-medium">"{inquiry.message}"</p>
                    <p className="text-xs text-slate-400">
                      Sent to Owner: <span className="font-bold text-slate-700">{inquiry.owner?.name}</span> • {new Date(inquiry.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-amber-100 text-amber-700 w-fit">
                    {inquiry.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content 3: Received Owner Inquiries */}
      {activeTab === 'owner-inquiries' && (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-900">Inquiries Received for Your Properties ({ownerInquiries.length})</h3>
          {loading ? (
            <p className="text-sm text-slate-500">Loading inquiries...</p>
          ) : ownerInquiries.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center">
              <p className="text-slate-500 text-sm">No buyer inquiries received yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {ownerInquiries.map((inquiry) => (
                <div key={inquiry._id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="text-sm font-extrabold text-slate-900">{inquiry.property?.title}</span>
                    <span className="text-xs text-slate-400">{new Date(inquiry.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-slate-800 bg-slate-50 p-4 rounded-xl font-normal">"{inquiry.message}"</p>
                  <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
                    <div className="flex items-center space-x-4">
                      <span>Sender: <strong>{inquiry.name}</strong></span>
                      <span>Email: <strong>{inquiry.email}</strong></span>
                      <span>Phone: <strong>{inquiry.phone}</strong></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content 4: My Property Listings */}
      {activeTab === 'listings' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900">My Property Listings ({myListings.length})</h3>
            <Link to="/add-property" className="px-4 py-2 rounded-xl bg-brand-600 text-white font-bold text-xs">
              + Add Listing
            </Link>
          </div>
          {myListings.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center">
              <p className="text-slate-500 text-sm">You haven't posted any property listings yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {myListings.map((prop) => (
                <PropertyCard key={prop._id} property={prop} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content 5: Profile Settings */}
      {activeTab === 'profile' && (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm max-w-xl space-y-6">
          <h3 className="text-xl font-bold text-slate-900">Account Details</h3>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase text-slate-600">Full Name</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full mt-1 px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-slate-600">Phone Number</label>
              <input
                type="tel"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                className="w-full mt-1 px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-colors"
            >
              Save Profile Changes
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserDashboardPage;

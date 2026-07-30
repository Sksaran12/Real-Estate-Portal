import React, { useState } from 'react';
import { X, Send, Phone, Mail, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const OwnerContactModal = ({ isOpen, onClose, property }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    message: `Hi, I am interested in your property "${property?.title}" listed on EstateHub. Please contact me with more details.`,
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen || !property) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to send inquiries');
      return;
    }

    setLoading(true);
    try {
      const { data } = await API.post('/inquiries', {
        propertyId: property._id,
        ...formData,
      });

      if (data.success) {
        toast.success('Inquiry sent successfully to property owner!');
        onClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send inquiry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-navy-900 to-slate-900 p-6 text-white flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-400">Direct Owner Inquiry</span>
            <h3 className="text-xl font-bold line-clamp-1">{property.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Owner Summary Card */}
        <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center space-x-4">
          <img
            src={property.owner?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'}
            alt={property.owner?.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-brand-500 shadow-sm"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="font-bold text-slate-900">{property.owner?.name || 'Property Owner'}</h4>
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-xs text-slate-500">Verified Listing Agent / Owner</p>
          </div>
        </div>

        {/* Modal Body / Form */}
        <div className="p-6">
          {!user ? (
            <div className="text-center py-6 space-y-4">
              <p className="text-sm text-slate-600 font-medium">
                You need to be logged in to send a direct message to the property owner.
              </p>
              <div className="flex justify-center space-x-3">
                <Link
                  to="/login"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl font-semibold bg-brand-600 text-white hover:bg-brand-700 transition-colors shadow-md"
                >
                  Log In Now
                </Link>
                <Link
                  to="/register"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  Register
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase">Your Name</label>
                <div className="relative mt-1">
                  <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase">Email Address</label>
                  <div className="relative mt-1">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase">Phone Number</label>
                  <div className="relative mt-1">
                    <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 uppercase">Message</label>
                <textarea
                  rows="3"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full mt-1 p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm transition-all shadow-lg shadow-brand-500/20 flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Sending Inquiry...' : 'Send Message to Owner'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerContactModal;

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, Mail, Lock, User, Phone, ShieldCheck, Eye, EyeOff, Building, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const { login, register, loading } = useAuth();
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [showPassword, setShowPassword] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'user', // 'user' or 'owner'
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === 'login') {
      if (!formData.email || !formData.password) {
        toast.error('Please enter email and password');
        return;
      }
      const success = await login(formData.email, formData.password);
      if (success) {
        onClose();
      }
    } else {
      if (!formData.name || !formData.email || !formData.password) {
        toast.error('Please fill in all required fields');
        return;
      }
      const success = await register(formData);
      if (success) {
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-navy-950/70 backdrop-blur-md animate-fade-in transition-all duration-300">
      {/* Backdrop overlay click handler */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all duration-300 scale-100 space-y-0">
        {/* Header Header */}
        <div className="bg-gradient-to-r from-slate-900 via-navy-950 to-slate-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-400/30 text-brand-300 text-[11px] font-extrabold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Assam Portal Secure Auth</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              {mode === 'login' ? 'Welcome Back to EstateHub' : 'Create Your Account'}
            </h2>
            <p className="text-xs text-slate-300">
              {mode === 'login'
                ? 'Sign in to access saved favorites and direct owner contacts'
                : 'Join Guwahati & Assam premier real estate network'}
            </p>
          </div>

          {/* Tab Switches */}
          <div className="flex bg-white/10 p-1 rounded-2xl border border-white/15 mt-5">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                mode === 'login'
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                mode === 'register'
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-white">
          {/* Role selector on Register mode */}
          {mode === 'register' && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold uppercase text-slate-600 tracking-wider">I Want To</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'user' })}
                  className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
                    formData.role === 'user'
                      ? 'bg-brand-50 border-brand-500 text-brand-700 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Buy / Rent Property</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'owner' })}
                  className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
                    formData.role === 'owner'
                      ? 'bg-brand-50 border-brand-500 text-brand-700 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Building className="w-4 h-4" />
                  <span>Post & Sell / Rent</span>
                </button>
              </div>
            </div>
          )}

          {/* Full Name (Register mode) */}
          {mode === 'register' && (
            <div>
              <label className="text-[11px] font-extrabold uppercase text-slate-600 tracking-wider">Full Name</label>
              <div className="relative mt-1">
                <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Saran Kumar"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="text-[11px] font-extrabold uppercase text-slate-600 tracking-wider">Email Address</label>
            <div className="relative mt-1">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
          </div>

          {/* Phone (Register mode) */}
          {mode === 'register' && (
            <div>
              <label className="text-[11px] font-extrabold uppercase text-slate-600 tracking-wider">Phone Number (Optional)</label>
              <div className="relative mt-1">
                <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>
            </div>
          )}

          {/* Password */}
          <div>
            <label className="text-[11px] font-extrabold uppercase text-slate-600 tracking-wider">Password</label>
            <div className="relative mt-1">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-lg shadow-brand-500/25 transition-all active:scale-98 mt-2"
          >
            {loading
              ? 'Processing...'
              : mode === 'login'
              ? 'Sign In to Portal'
              : 'Create Account'}
          </button>

          {/* Footer Note */}
          <p className="text-[11px] text-center text-slate-400 pt-2">
            By signing in, you agree to EstateHub Terms of Service & Privacy Policy.
          </p>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;

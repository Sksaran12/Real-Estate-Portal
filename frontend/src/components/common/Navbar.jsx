import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useFavorite } from '../../context/FavoriteContext';
import { Building2, Heart, PlusCircle, User, LogOut, ShieldCheck, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { favoritesList } = useFavorite();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-brand-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors">
                Estate<span className="text-brand-600">Hub</span>
              </span>
              <span className="block text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                Real Estate Portal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 font-medium text-slate-700">
            <Link to="/properties" className="hover:text-brand-600 transition-colors">
              Browse Properties
            </Link>
            <Link to="/properties?propertyType=rent" className="hover:text-brand-600 transition-colors">
              Rent
            </Link>
            <Link to="/properties?propertyType=sale" className="hover:text-brand-600 transition-colors">
              Buy
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Saved Favorites Link */}
            <Link
              to="/dashboard?tab=favorites"
              className="relative p-2.5 rounded-full text-slate-600 hover:text-red-500 hover:bg-slate-100 transition-colors"
              title="Saved Favorites"
            >
              <Heart className="w-6 h-6" />
              {favoritesList.length > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center animate-pulse">
                  {favoritesList.length}
                </span>
              )}
            </Link>

            {/* List Property Button (Owner / Admin) */}
            {(user?.role === 'owner' || user?.role === 'admin') && (
              <Link
                to="/add-property"
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-brand-50 text-brand-700 hover:bg-brand-100 font-semibold transition-all border border-brand-200"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Post Property</span>
              </Link>
            )}

            {/* Auth Dropdown or Login Buttons */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-3 p-1.5 rounded-full hover:bg-slate-100 transition-colors border border-slate-200"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover border border-slate-300"
                  />
                  <span className="text-sm font-semibold text-slate-800 pr-2 max-w-[120px] truncate">
                    {user.name}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-brand-100 text-brand-700">
                        {user.role}
                      </span>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center space-x-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-600"
                    >
                      <User className="w-4 h-4" />
                      <span>My Dashboard</span>
                    </Link>

                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                        navigate('/');
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 text-left border-t border-slate-100 mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2.5 rounded-xl font-semibold text-slate-700 hover:text-brand-600 hover:bg-slate-100 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 rounded-xl font-semibold text-white bg-brand-600 hover:bg-brand-700 transition-all shadow-md shadow-brand-500/20"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 space-y-3 font-medium">
            <Link
              to="/properties"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              Browse Properties
            </Link>
            <Link
              to="/properties?propertyType=rent"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              Rent
            </Link>
            <Link
              to="/properties?propertyType=sale"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              Buy
            </Link>

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100"
                >
                  My Dashboard
                </Link>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-emerald-700 bg-emerald-50 font-semibold"
                  >
                    Admin Control Panel
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-red-600 hover:bg-red-50"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="pt-2 flex flex-col space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl font-semibold border border-slate-300 text-slate-700"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl font-semibold text-white bg-brand-600"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;

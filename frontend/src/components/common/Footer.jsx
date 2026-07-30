import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Mail, Phone, MapPin, ShieldCheck, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-navy-900 text-slate-300 border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white">
                Estate<span className="text-brand-500">Hub</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Assam's leading production-grade real estate portal connecting home buyers, tenants, and property owners in Guwahati and across India.
            </p>
            <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-800/40 w-fit">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified & Approved Listings</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Explore Properties</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/properties?city=Guwahati" className="hover:text-brand-400 transition-colors">
                  Flats in Guwahati
                </Link>
              </li>
              <li>
                <Link to="/properties?search=GS Road" className="hover:text-brand-400 transition-colors">
                  Properties on GS Road
                </Link>
              </li>
              <li>
                <Link to="/properties?propertyType=sale" className="hover:text-brand-400 transition-colors">
                  Homes for Sale
                </Link>
              </li>
              <li>
                <Link to="/properties?propertyType=rent" className="hover:text-brand-400 transition-colors">
                  Rental Apartments
                </Link>
              </li>
            </ul>
          </div>

          {/* User Account */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Portal Account</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/login" className="hover:text-brand-400 transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-brand-400 transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <Link to="/dashboard?tab=favorites" className="hover:text-brand-400 transition-colors">
                  My Saved Favorites
                </Link>
              </li>
              <li>
                <Link to="/dashboard?tab=inquiries" className="hover:text-brand-400 transition-colors">
                  My Inquiries Inbox
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Guwahati Office</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-brand-400" />
                <span>GS Road, Christian Basti, Guwahati, Assam 781005</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-brand-400" />
                <span>+91 (0361) 234-5678</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-brand-400" />
                <span>support@estatehub.in</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} EstateHub Assam Real Estate. Built for production MERN internship evaluation.</p>
          <div className="flex items-center space-x-1 mt-4 md:mt-0">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
            <span>in Guwahati, Assam</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

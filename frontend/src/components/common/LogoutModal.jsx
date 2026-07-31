import React from 'react';
import { LogOut, X, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const LogoutModal = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  if (!isOpen || !user) return null;

  const handleConfirmLogout = () => {
    logout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-navy-950/70 backdrop-blur-md animate-fade-in transition-all duration-300">
      {/* Backdrop overlay click handler */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-6 text-center transform transition-all duration-300 scale-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon Header */}
        <div className="w-16 h-16 rounded-full bg-red-50 border border-red-100 text-red-600 flex items-center justify-center mx-auto shadow-inner">
          <LogOut className="w-8 h-8 ml-1" />
        </div>

        {/* Info */}
        <div className="space-y-2">
          <h3 className="text-xl font-extrabold text-slate-900">Confirm Sign Out</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            You are currently signed in as <span className="font-bold text-slate-800">{user.name}</span> ({user.email}).
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="py-3 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmLogout}
            className="py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-500/25 transition-all"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;

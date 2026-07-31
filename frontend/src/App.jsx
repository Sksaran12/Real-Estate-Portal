import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './context/AuthContext';
import { FavoriteProvider } from './context/FavoriteContext';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import AIChatWidget from './components/ai/AIChatWidget';

import HomePage from './pages/HomePage';
import PropertySearchPage from './pages/PropertySearchPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import AddEditPropertyPage from './pages/AddEditPropertyPage';
import UserDashboardPage from './pages/UserDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <AuthProvider>
      <FavoriteProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-brand-500 selection:text-white">
            <Navbar />

            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/properties" element={<PropertySearchPage />} />
                <Route path="/properties/:id" element={<PropertyDetailPage />} />
                <Route path="/add-property" element={<AddEditPropertyPage />} />
                <Route path="/dashboard" element={<UserDashboardPage />} />
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Routes>
            </main>

            <Footer />

            {/* AI Assistant Chat Widget */}
            <AIChatWidget />

            {/* Notification Toasts - Positioned cleanly at the TOP CENTER with dark glass styling */}
            <Toaster
              position="top-center"
              reverseOrder={false}
              toastOptions={{
                duration: 3500,
                style: {
                  background: '#0f172a',
                  color: '#ffffff',
                  borderRadius: '16px',
                  fontSize: '13px',
                  fontWeight: '600',
                  padding: '12px 20px',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                },
                success: {
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#ffffff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#ffffff',
                  },
                },
              }}
            />
          </div>
        </Router>
      </FavoriteProvider>
    </AuthProvider>
  );
}

export default App;

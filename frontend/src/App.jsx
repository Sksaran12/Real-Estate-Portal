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

            {/* Notification Toasts */}
            <Toaster position="bottom-right" reverseOrder={false} />
          </div>
        </Router>
      </FavoriteProvider>
    </AuthProvider>
  );
}

export default App;

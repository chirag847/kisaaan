import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import Home from './pages/Home';
import GrainsList from './pages/GrainsList';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/grains" element={<GrainsList />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              {/* Placeholder routes for future pages */}
              <Route path="/grains/:id" element={<div className="p-8 text-center">Grain Details Page - Coming Soon</div>} />
              <Route path="/add-grain" element={<div className="p-8 text-center">Add Grain Page - Coming Soon</div>} />
              <Route path="/edit-grain/:id" element={<div className="p-8 text-center">Edit Grain Page - Coming Soon</div>} />
              <Route path="/contact" element={<div className="p-8 text-center">Contact Page - Coming Soon</div>} />
              <Route path="/about" element={<div className="p-8 text-center">About Page - Coming Soon</div>} />
              <Route path="/privacy" element={<div className="p-8 text-center">Privacy Policy - Coming Soon</div>} />
              <Route path="/terms" element={<div className="p-8 text-center">Terms of Service - Coming Soon</div>} />
              <Route path="/help" element={<div className="p-8 text-center">Help Center - Coming Soon</div>} />
              <Route path="/forgot-password" element={<div className="p-8 text-center">Forgot Password - Coming Soon</div>} />
              <Route path="*" element={
                <div className="flex items-center justify-center min-h-96">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-primary-600 mb-4">404</h1>
                    <p className="text-primary-600 text-lg">Page not found</p>
                  </div>
                </div>
              } />
            </Routes>
          </main>
          <Footer />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                style: {
                  background: '#10b981',
                },
              },
              error: {
                style: {
                  background: '#ef4444',
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

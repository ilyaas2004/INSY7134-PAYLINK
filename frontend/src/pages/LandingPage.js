import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, CreditCard } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="relative z-10 max-w-6xl w-full">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            {/* logo */}
            <img 
              src="/IMG-20250915-WA0000.jpg" 
              alt="PayLink Logo"
              className="w-24 h-24 rounded-full shadow-2xl border-4 border-white/30 object-cover"
            />
          </div>
          <h1 className="text-6xl font-bold text-white mb-4">PayLink</h1>
          <p className="text-xl text-blue-200">Secure International Payments Made Simple</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <Shield className="w-12 h-12 text-blue-300 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Bank-Grade Security</h3>
            <p className="text-blue-200">Military-grade encryption and multi-layer security protocols</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <CreditCard className="w-12 h-12 text-blue-300 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Instant Transfers</h3>
            <p className="text-blue-200">Real-time international payments via SWIFT network</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/register"
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-2xl text-center"
          >
            Create Account
          </Link>
          <Link
            to="/login"
            className="bg-white/20 backdrop-blur-lg text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/30 border border-white/30 transform hover:scale-105 transition-all duration-300 text-center"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

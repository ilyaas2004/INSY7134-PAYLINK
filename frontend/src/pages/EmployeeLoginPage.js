import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { employeeAPI } from '../services/api';
import { Briefcase, Eye, EyeOff, Loader } from 'lucide-react';

const EmployeeLoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '',
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  const validateForm = () => {
    if (!formData.employeeId || !formData.email || !formData.password) {
      setError('All fields are required');
      return false;
    }

    if (!/^EMP[0-9]{6}$/.test(formData.employeeId)) {
      setError('Invalid employee ID format (e.g., EMP100001)');
      return false;
    }

    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      setError('Invalid email format');
      return false;
    }

    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault(); // stop form submission
    e.stopPropagation(); // stop bubbling
    console.log("Login form submitted"); // should appear in console

    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      console.log('Attempting login with:', { 
        employeeId: formData.employeeId, 
        email: formData.email 
      });
      
      const response = await employeeAPI.login(formData);
      console.log('Login response:', response);
      
      if (response.success) {
        localStorage.setItem('employeeToken', response.token);
        localStorage.setItem('employee', JSON.stringify(response.employee));
        navigate('/employee/portal');
      } else {
        setError(response.message || 'Invalid credentials');
        setTimeout(() => setError(''), 5000);
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.message || err.error || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md p-8 border border-white/20">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-br from-purple-400 to-pink-500 p-3 rounded-full mb-4">
            <Briefcase className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Employee Portal</h2>
          <p className="text-purple-200">Sign in to manage payments</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-white p-3 rounded-xl mb-4 text-sm text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4" noValidate>
          <div>
            <label className="block text-purple-200 text-sm font-semibold mb-2">Employee ID</label>
            <input
              type="text"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleInputChange}
              disabled={loading}
              maxLength="9"
              className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm disabled:opacity-50"
              placeholder="EMP100001"
            />
          </div>

          <div>
            <label className="block text-purple-200 text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm disabled:opacity-50"
              placeholder="employee@paylink.com"
            />
          </div>

          <div>
            <label className="block text-purple-200 text-sm font-semibold mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm disabled:opacity-50"
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-purple-300 hover:text-white"
                disabled={loading}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-purple-200 text-sm mb-2">Employee accounts are pre-registered</p>
          <Link to="/" className="text-purple-300 font-semibold hover:text-white text-sm">
            ← Back to Customer Portal
          </Link>
        </div>

        {/* Test Credentials */}
        <div className="mt-6 bg-white/5 rounded-xl p-4 border border-white/10">
          <p className="text-purple-200 text-xs font-semibold mb-2">Test Credentials:</p>
          <p className="text-purple-300 text-xs">ID: EMP100001</p>
          <p className="text-purple-300 text-xs">Email: sarah.johnson@paylink.com</p>
          <p className="text-purple-300 text-xs">Password: Employee@123</p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLoginPage;

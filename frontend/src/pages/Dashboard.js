import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { paymentAPI } from '../services/api';
import { Globe, CreditCard, Send, CheckCircle, Loader, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'USD',
    provider: 'SWIFT',
    payeeAccount: '',
    swiftCode: ''
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setLoadingPayments(true);
      const response = await paymentAPI.getUserPayments();
      if (response.success) {
        setPayments(response.payments);
      }
    } catch (err) {
      console.error('Error loading payments:', err);
    } finally {
      setLoadingPayments(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
    setSuccess('');
  };

  const validateForm = () => {
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid amount');
      return false;
    }

    if (!formData.payeeAccount) {
      setError('Please enter payee account number');
      return false;
    }

    if (!/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(formData.swiftCode)) {
      setError('Invalid SWIFT code format (e.g., ABNANL2A)');
      return false;
    }

    return true;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await paymentAPI.createPayment(formData);
      
      if (response.success) {
        setSuccess('Payment submitted successfully! Awaiting verification.');
        setFormData({
          amount: '',
          currency: 'USD',
          provider: 'SWIFT',
          payeeAccount: '',
          swiftCode: ''
        });
        await loadPayments();
      }
    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'verified': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    return status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Globe className="w-8 h-8" />
            <h1 className="text-2xl font-bold">PayLink</h1>
          </div>
          <button 
            onClick={handleLogout} 
            className="bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition-all"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-2xl mb-6">
          <h2 className="text-3xl font-bold mb-2">Welcome, {user?.fullName || 'User'}</h2>
          <p className="text-blue-100">Account: {user?.accountNumber || '****'}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-700 font-semibold">Total Payments</h3>
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{payments.length}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-700 font-semibold">Pending</h3>
              <Send className="w-6 h-6 text-indigo-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {payments.filter(p => p.status === 'pending').length}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-700 font-semibold">Completed</h3>
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {payments.filter(p => p.status === 'completed').length}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Make International Payment</h3>
            
            {error && (
              <div className="bg-red-50 border border-red-300 text-red-800 p-3 rounded-xl mb-4 text-sm flex items-center space-x-2">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-300 text-green-800 p-3 rounded-xl mb-4 text-sm flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>{success}</span>
              </div>
            )}
            
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Amount</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    disabled={loading}
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all disabled:opacity-50"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Currency</label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all disabled:opacity-50"
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="ZAR">ZAR - South African Rand</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">Payment Provider</label>
                <select
                  name="provider"
                  value={formData.provider}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all disabled:opacity-50"
                >
                  <option value="SWIFT">SWIFT</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">Payee Account Number</label>
                <input
                  type="text"
                  name="payeeAccount"
                  value={formData.payeeAccount}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all disabled:opacity-50"
                  placeholder="Enter account number"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">SWIFT Code</label>
                <input
                  type="text"
                  name="swiftCode"
                  value={formData.swiftCode}
                  onChange={handleInputChange}
                  disabled={loading}
                  maxLength="11"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all disabled:opacity-50"
                  placeholder="e.g., ABNANL2A"
                />
                <p className="text-xs text-gray-500 mt-1">8 or 11 characters, uppercase letters and numbers</p>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-800 transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Pay Now</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Payments</h3>
            
            {loadingPayments ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : payments.length === 0 ? (
              <div className="text-center py-12">
                <Send className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No payments yet</p>
                <p className="text-sm text-gray-400 mt-2">Create your first international payment</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {payments.map((payment) => (
                  <div 
                    key={payment._id} 
                    className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-lg font-bold text-gray-900">
                          {payment.amount} {payment.currency}
                        </p>
                        <p className="text-sm text-gray-600">To: {payment.payeeAccount}</p>
                      </div>
                      <span className={`${getStatusColor(payment.status)} text-white text-xs px-3 py-1 rounded-full font-semibold`}>
                        {getStatusText(payment.status)}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-600">
                        <span className="font-semibold">SWIFT:</span> {payment.swiftCode}
                      </p>
                      <p className="text-xs text-gray-600">
                        <span className="font-semibold">Provider:</span> {payment.provider}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(payment.createdAt).toLocaleDateString()} at {new Date(payment.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
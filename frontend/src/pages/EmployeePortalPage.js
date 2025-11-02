import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { employeeAPI } from '../services/api';
import { 
  Briefcase, 
  CheckCircle, 
  XCircle, 
  Send, 
  Loader, 
  AlertCircle,
  Search,
  Filter,
  TrendingUp
} from 'lucide-react';

const EmployeePortalPage = () => {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [payments, setPayments] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedPayments, setSelectedPayments] = useState([]);
  const [filterStatus, setFilterStatus] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectingPaymentId, setRejectingPaymentId] = useState(null);

  useEffect(() => {
    const employeeData = localStorage.getItem('employee');
    if (employeeData) {
      setEmployee(JSON.parse(employeeData));
    }
    loadPayments();
    loadStatistics();
  }, [filterStatus]);

  const loadPayments = async () => {
    try {
      setLoadingPayments(true);
      const response = await employeeAPI.getAllPayments(filterStatus);
      if (response.success) {
        setPayments(response.payments);
      }
    } catch (err) {
      console.error('Error loading payments:', err);
      setError('Failed to load payments');
    } finally {
      setLoadingPayments(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const response = await employeeAPI.getStatistics();
      if (response.success) {
        setStatistics(response.statistics);
      }
    } catch (err) {
      console.error('Error loading statistics:', err);
    }
  };

  const handleVerifyPayment = async (paymentId) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await employeeAPI.verifyPayment(paymentId);
      if (response.success) {
        setSuccess('Payment verified successfully');
        await loadPayments();
        await loadStatistics();
      }
    } catch (err) {
      setError(err.message || 'Failed to verify payment');
    } finally {
      setLoading(false);
    }
  };

  const openRejectModal = (paymentId) => {
    setRejectingPaymentId(paymentId);
    setShowRejectModal(true);
    setRejectionReason('');
  };

  const handleRejectPayment = async () => {
    if (!rejectionReason || rejectionReason.length < 10) {
      setError('Rejection reason must be at least 10 characters');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await employeeAPI.rejectPayment(rejectingPaymentId, rejectionReason);
      if (response.success) {
        setSuccess('Payment rejected successfully');
        setShowRejectModal(false);
        setRejectingPaymentId(null);
        setRejectionReason('');
        await loadPayments();
        await loadStatistics();
      }
    } catch (err) {
      setError(err.message || 'Failed to reject payment');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPayment = (paymentId) => {
    setSelectedPayments(prev => {
      if (prev.includes(paymentId)) {
        return prev.filter(id => id !== paymentId);
      }
      return [...prev, paymentId];
    });
  };

  const handleSubmitToSwift = async () => {
    if (selectedPayments.length === 0) {
      setError('Please select at least one verified payment');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await employeeAPI.submitToSwift(selectedPayments);
      if (response.success) {
        setSuccess(`${response.count} payment(s) submitted to SWIFT successfully`);
        setSelectedPayments([]);
        await loadPayments();
        await loadStatistics();
      }
    } catch (err) {
      setError(err.message || 'Failed to submit payments to SWIFT');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('employeeToken');
    localStorage.removeItem('employee');
    navigate('/employee/login');
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

  const filteredPayments = payments.filter(payment => {
    const searchLower = searchTerm.toLowerCase();
    return (
      payment.userId?.fullName?.toLowerCase().includes(searchLower) ||
      payment.userId?.accountNumber?.toLowerCase().includes(searchLower) ||
      payment.swiftCode?.toLowerCase().includes(searchLower) ||
      payment.payeeAccount?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-100">
      <nav className="bg-gradient-to-r from-purple-600 to-pink-700 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Briefcase className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">PayLink Employee Portal</h1>
              <p className="text-xs text-purple-100">{employee?.department?.toUpperCase()} Department</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="font-semibold">{employee?.fullName}</p>
              <p className="text-xs text-purple-100">{employee?.employeeId}</p>
            </div>
            <button 
              onClick={handleLogout} 
              className="bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        {/* Statistics Cards */}
        {statistics && (
          <div className="grid md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-700 font-semibold text-sm">Total</h3>
                <TrendingUp className="w-5 h-5 text-gray-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{statistics.total}</p>
            </div>

            <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all text-white">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm">Pending</h3>
                <AlertCircle className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold">{statistics.pending}</p>
            </div>

            <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all text-white">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm">Verified</h3>
                <CheckCircle className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold">{statistics.verified}</p>
            </div>

            <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all text-white">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm">Completed</h3>
                <Send className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold">{statistics.completed}</p>
            </div>

            <div className="bg-gradient-to-br from-red-400 to-red-600 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all text-white">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm">Rejected</h3>
                <XCircle className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold">{statistics.rejected}</p>
            </div>
          </div>
        )}

        {/* Alerts */}
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

        {/* Filters and Search */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2 flex items-center space-x-2">
                <Filter className="w-4 h-4" />
                <span>Filter by Status</span>
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-all"
              >
                <option value="">All Payments</option>
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2 flex items-center space-x-2">
                <Search className="w-4 h-4" />
                <span>Search Payments</span>
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, account, SWIFT code..."
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          {filterStatus === 'verified' && selectedPayments.length > 0 && (
            <div className="mt-4">
              <button
                onClick={handleSubmitToSwift}
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-700 text-white py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-800 transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Submit {selectedPayments.length} Payment(s) to SWIFT</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Payments List */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            {filterStatus ? `${getStatusText(filterStatus)} Payments` : 'All Payments'}
          </h3>
          
          {loadingPayments ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-8 h-8 animate-spin text-purple-600" />
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="text-center py-12">
              <Send className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No payments found</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {filteredPayments.map((payment) => (
                <div 
                  key={payment._id} 
                  className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 hover:shadow-md transition-all border border-purple-100"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <p className="text-2xl font-bold text-gray-900">
                          {payment.amount} {payment.currency}
                        </p>
                        <span className={`${getStatusColor(payment.status)} text-white text-xs px-3 py-1 rounded-full font-semibold`}>
                          {getStatusText(payment.status)}
                        </span>
                      </div>
                      <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-700">
                        <p><span className="font-semibold">Customer:</span> {payment.userId?.fullName}</p>
                        <p><span className="font-semibold">Account:</span> {payment.userId?.accountNumber}</p>
                        <p><span className="font-semibold">Payee:</span> {payment.payeeAccount}</p>
                        <p><span className="font-semibold">SWIFT:</span> {payment.swiftCode}</p>
                        <p><span className="font-semibold">Provider:</span> {payment.provider}</p>
                        <p><span className="font-semibold">Date:</span> {new Date(payment.createdAt).toLocaleString()}</p>
                      </div>
                    </div>

                    {filterStatus === 'verified' && (
                      <div className="ml-4">
                        <input
                          type="checkbox"
                          checked={selectedPayments.includes(payment._id)}
                          onChange={() => handleSelectPayment(payment._id)}
                          className="w-6 h-6 text-purple-600 rounded focus:ring-purple-500"
                        />
                      </div>
                    )}
                  </div>

                  {payment.status === 'pending' && (
                    <div className="flex space-x-2 mt-4">
                      <button
                        onClick={() => handleVerifyPayment(payment._id)}
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Verify</span>
                      </button>
                      <button
                        onClick={() => openRejectModal(payment._id)}
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 text-white py-2 rounded-lg font-semibold hover:from-red-600 hover:to-rose-700 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  )}

                  {payment.status === 'rejected' && payment.rejectionReason && (
                    <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm text-red-800">
                        <span className="font-semibold">Rejection Reason:</span> {payment.rejectionReason}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Reject Payment</h3>
            <p className="text-gray-600 mb-4">Please provide a reason for rejecting this payment:</p>
            
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason (minimum 10 characters)..."
              rows="4"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:outline-none transition-all mb-4"
            />

            <div className="flex space-x-2">
              <button
                onClick={handleRejectPayment}
                disabled={loading || rejectionReason.length < 10}
                className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 text-white py-3 rounded-xl font-semibold hover:from-red-600 hover:to-rose-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Rejecting...' : 'Confirm Reject'}
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectingPaymentId(null);
                  setRejectionReason('');
                }}
                disabled={loading}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeePortalPage;
const express = require('express');
const router = express.Router();

// Check if all required modules exist
try {
  const {
    login,
    getMe,
    getPendingPayments,
    getAllPayments,
    verifyPayment,
    rejectPayment,
    submitToSwift,
    getStatistics
  } = require('../controllers/employeeController');
  
  const { protectEmployee, authorizeAdmin } = require('../middleware/employeeAuth');
  const { 
    validateEmployeeLogin, 
    validatePaymentRejection,
    validateSwiftSubmission
  } = require('../middleware/employeeValidation');
  
  const { authRateLimiter, bruteForceProtection } = require('../middleware/security');

  // Authentication routes
  router.post(
    '/login',
    authRateLimiter,
    bruteForceProtection,
    validateEmployeeLogin,
    login
  );

  router.get('/me', protectEmployee, getMe);

  // Payment management routes
  router.get('/payments/pending', protectEmployee, getPendingPayments);
  router.get('/payments', protectEmployee, getAllPayments);
  router.get('/statistics', protectEmployee, getStatistics);

  router.put('/payments/:id/verify', protectEmployee, verifyPayment);
  router.put(
    '/payments/:id/reject', 
    protectEmployee, 
    validatePaymentRejection, 
    rejectPayment
  );

  router.post(
    '/payments/submit-to-swift',
    protectEmployee,
    validateSwiftSubmission,
    submitToSwift
  );

  console.log('✅ Employee routes loaded successfully');
  
} catch (error) {
  console.error('❌ Error loading employee routes:', error.message);
  console.error('   Make sure all employee files exist:');
  console.error('   - backend/controllers/employeeController.js');
  console.error('   - backend/middleware/employeeAuth.js');
  console.error('   - backend/middleware/employeeValidation.js');
  console.error('   - backend/models/Employee.js');
}

module.exports = router;
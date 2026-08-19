const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment } = require('../controllers/paymentController.js');
const { protect } = require('../middleware/authMiddleware.js');

router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifyPayment);

module.exports = router;
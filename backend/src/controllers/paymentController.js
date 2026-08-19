const crypto = require('crypto');
const razorpayInstance = require('../config/razorpay');
const User = require('../models/User.model.js');

// @route POST /api/payment/create-order
const createOrder = async (req, res) => {
  try {
    const options = {
      amount: 49900, // amount in paise = ₹499.00 (mock pricing)
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);
    res.status(200).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create order', error: err.message });
  }
};

// @route POST /api/payment/verify
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    // Signature valid — user ko paid tier me upgrade karo
    const user = await User.findById(req.user._id);
    user.tier = 'paid';
    await user.save();

    res.status(200).json({ message: 'Payment verified, upgraded to paid tier', tier: user.tier });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createOrder, verifyPayment };
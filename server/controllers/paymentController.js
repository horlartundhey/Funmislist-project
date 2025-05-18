const axios = require('axios');
const Transaction = require('../models/transactionModel');

const initiatePayment = async (req, res) => {
  const { email, amount } = req.body;
  if (!email || !amount) {
    return res.status(400).json({ message: 'Email and amount are required' });
  }
  try {
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email,
        amount: Math.round(amount * 100), // Convert to kobo
        callback_url: 'http://localhost:5173/dashboard', // Frontend dashboard URL
        currency: 'NGN'
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Paystack Error:', error.response?.data || error.message);
    res.status(500).json({
      message: 'Payment initiation failed',
      error: error.response?.data || error.message,
    });  }
};

const verifyPayment = async (req, res) => {
  const { reference, propertyId } = req.query;
  try {
    // First check if transaction already exists
    let transaction = await Transaction.findOne({ reference });
    if (transaction) {
      return res.status(200).json(transaction);
    }

    // Verify with Paystack
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const paystackData = response.data.data;
    
    // Create transaction record
    transaction = await Transaction.create({
      reference,
      user: req.user._id,
      amount: paystackData.amount / 100, // Convert from kobo to naira
      status: paystackData.status === 'success' ? 'success' : 'failed',
      property: propertyId,
      paystackResponse: paystackData,
    });

    res.status(200).json(transaction);
  } catch (error) {
    console.error('Paystack Verification Error:', error.response?.data || error.message);
    res.status(500).json({
      message: 'Payment verification failed',
      error: error.response?.data || error.message,
    });
  }
};

// Get all transactions (admin only)
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('user', 'name email')
      .populate('property', 'title price')
      .sort('-createdAt');
    
    res.status(200).json(transactions);
  } catch (err) {
    console.error('Error fetching transactions:', err.message);
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
};

// Export controllers
module.exports = { initiatePayment, verifyPayment, getTransactions };
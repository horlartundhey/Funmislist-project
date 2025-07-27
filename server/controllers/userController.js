const Transaction = require('../models/transactionModel');

// Get all transactions for the authenticated user
exports.getUserTransactions = async (req, res) => {
  try {
    const userId = req.user._id;
    const transactions = await Transaction.find({ user: userId })
  .populate('product', 'name price')
  .sort({ createdAt: -1 });
console.log('Populated Transactions:', JSON.stringify(transactions, null, 2));
res.json({ success: true, transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

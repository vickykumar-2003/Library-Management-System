const express = require('express');
const router = express.Router();
const { getTransactions, getTransactionById, issueBook, returnBook, deleteTransaction, getDashboardStats } = require('../controllers/transactionController');

router.route('/').get(getTransactions);
router.post('/issue', issueBook);
router.put('/:id/return', returnBook);
router.route('/:id').get(getTransactionById).delete(deleteTransaction);

module.exports = router;

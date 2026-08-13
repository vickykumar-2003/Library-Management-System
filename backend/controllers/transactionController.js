const Transaction = require('../models/Transaction');
const Book = require('../models/Book');
const Member = require('../models/Member');

const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({})
      .populate('book', 'title author isbn')
      .populate('member', 'name membershipId email')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('book')
      .populate('member');
    
    if (transaction) {
      res.json({ success: true, data: transaction });
    } else {
      res.status(404).json({ success: false, message: 'Transaction not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const issueBook = async (req, res) => {
  try {
    const { bookId, memberId, issueDate, dueDate } = req.body;

    const book = await Book.findById(bookId);
    const member = await Member.findById(memberId);

    if (!book) return res.status(404).json({ success: false, message: 'Book not found' });
    if (!member) return res.status(404).json({ success: false, message: 'Member not found' });
    if (member.status !== 'Active') return res.status(400).json({ success: false, message: 'Member is inactive' });
    if (book.availableCopies <= 0) return res.status(400).json({ success: false, message: 'Book is not available for issue' });

    const transaction = await Transaction.create({
      book: bookId,
      member: memberId,
      issueDate,
      dueDate,
      status: 'Issued'
    });

    book.availableCopies -= 1;
    await book.save();

    res.status(201).json({ success: true, message: 'Book issued successfully', data: transaction });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const returnBook = async (req, res) => {
  try {
    const { returnDate } = req.body;
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) return res.status(404).json({ success: false, message: 'Transaction not found' });
    if (transaction.status === 'Returned') return res.status(400).json({ success: false, message: 'Book already returned' });

    transaction.status = 'Returned';
    transaction.returnDate = returnDate || Date.now();
    await transaction.save();

    const book = await Book.findById(transaction.book);
    if (book) {
      book.availableCopies += 1;
      await book.save();
    }

    res.json({ success: true, message: 'Book returned successfully', data: transaction });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (transaction) {
      await Transaction.deleteOne({ _id: transaction._id });
      res.json({ success: true, message: 'Transaction removed' });
    } else {
      res.status(404).json({ success: false, message: 'Transaction not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const totalBooks = await Book.aggregate([{ $group: { _id: null, total: { $sum: "$quantity" } } }]);
    const totalBooksCount = totalBooks.length > 0 ? totalBooks[0].total : 0;
    
    const availableBooks = await Book.aggregate([{ $group: { _id: null, total: { $sum: "$availableCopies" } } }]);
    const availableBooksCount = availableBooks.length > 0 ? availableBooks[0].total : 0;
    
    const issuedBooksCount = totalBooksCount - availableBooksCount;
    
    const totalMembers = await Member.countDocuments();
    
    const recentTransactions = await Transaction.find({})
      .populate('book', 'title')
      .populate('member', 'name')
      .sort({ createdAt: -1 })
      .limit(5);
      
    const recentBooks = await Book.find({}).sort({ createdAt: -1 }).limit(5);
    
    res.json({
      success: true,
      data: {
        totalBooks: totalBooksCount,
        availableBooks: availableBooksCount,
        issuedBooks: issuedBooksCount,
        totalMembers,
        recentTransactions,
        recentBooks
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = { getTransactions, getTransactionById, issueBook, returnBook, deleteTransaction, getDashboardStats };

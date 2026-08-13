const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema(
  {
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
    issueDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    returnDate: { type: Date },
    status: { type: String, enum: ['Issued', 'Returned', 'Overdue'], default: 'Issued' },
  },
  { timestamps: true }
);

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;

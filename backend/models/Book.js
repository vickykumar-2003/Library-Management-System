const mongoose = require('mongoose');

const bookSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    isbn: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0 },
    availableCopies: { type: Number, required: true, min: 0 },
    publishedYear: { type: Number, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;

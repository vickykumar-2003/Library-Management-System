const Book = require('../models/Book');

const getBooks = async (req, res) => {
  try {
    const books = await Book.find({});
    res.json({ success: true, data: books });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (book) {
      res.json({ success: true, data: book });
    } else {
      res.status(404).json({ success: false, message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createBook = async (req, res) => {
  try {
    const { title, author, isbn, category, quantity, publishedYear, description } = req.body;
    const bookExists = await Book.findOne({ isbn });

    if (bookExists) {
      return res.status(400).json({ success: false, message: 'Book with this ISBN already exists' });
    }

    const book = await Book.create({
      title,
      author,
      isbn,
      category,
      quantity,
      availableCopies: quantity,
      publishedYear,
      description,
    });

    res.status(201).json({ success: true, message: 'Book created successfully', data: book });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (book) {
      // Calculate new available copies if quantity changes
      let newAvailableCopies = book.availableCopies;
      if (req.body.quantity !== undefined) {
        const diff = req.body.quantity - book.quantity;
        newAvailableCopies = book.availableCopies + diff;
        if (newAvailableCopies < 0) {
           return res.status(400).json({ success: false, message: 'Cannot reduce quantity below currently issued copies' });
        }
      }

      const updatedBook = await Book.findByIdAndUpdate(
        req.params.id,
        { ...req.body, availableCopies: newAvailableCopies },
        { new: true, runValidators: true }
      );
      res.json({ success: true, message: 'Book updated successfully', data: updatedBook });
    } else {
      res.status(404).json({ success: false, message: 'Book not found' });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (book) {
      await Book.deleteOne({ _id: book._id });
      res.json({ success: true, message: 'Book removed' });
    } else {
      res.status(404).json({ success: false, message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getBooks, getBookById, createBook, updateBook, deleteBook };

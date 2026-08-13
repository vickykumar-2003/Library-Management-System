const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Book = require('./models/Book');
const Member = require('./models/Member');
const Transaction = require('./models/Transaction');

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await Book.deleteMany();
    await Member.deleteMany();
    await Transaction.deleteMany();

    const createdBooks = await Book.insertMany([
      { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '9780743273565', category: 'Fiction', quantity: 5, availableCopies: 5, publishedYear: 1925, description: 'A story of the Jazz Age.' },
      { title: '1984', author: 'George Orwell', isbn: '9780451524935', category: 'Science Fiction', quantity: 3, availableCopies: 3, publishedYear: 1949, description: 'Dystopian novel.' },
      { title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '9780060935467', category: 'Fiction', quantity: 4, availableCopies: 4, publishedYear: 1960, description: 'Story of racial injustice.' },
      { title: 'Clean Code', author: 'Robert C. Martin', isbn: '9780132350884', category: 'Technology', quantity: 2, availableCopies: 2, publishedYear: 2008, description: 'A Handbook of Agile Software Craftsmanship.' },
      { title: 'Sapiens', author: 'Yuval Noah Harari', isbn: '9780062316097', category: 'History', quantity: 6, availableCopies: 6, publishedYear: 2011, description: 'A Brief History of Humankind.' },
      { title: 'The Alchemist', author: 'Paulo Coelho', isbn: '9780061122415', category: 'Fiction', quantity: 5, availableCopies: 5, publishedYear: 1988, description: 'A story about following your dreams.' },
      { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', isbn: '9780374533557', category: 'Psychology', quantity: 3, availableCopies: 3, publishedYear: 2011, description: 'Explores the two systems that drive the way we think.' },
      { title: 'Atomic Habits', author: 'James Clear', isbn: '9780735211292', category: 'Self-Help', quantity: 7, availableCopies: 7, publishedYear: 2018, description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones.' },
    ]);

    const createdMembers = await Member.insertMany([
      { name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', membershipId: 'MEM001', address: '123 Main St', status: 'Active' },
      { name: 'Jane Smith', email: 'jane@example.com', phone: '098-765-4321', membershipId: 'MEM002', address: '456 Oak Ave', status: 'Active' },
      { name: 'Bob Johnson', email: 'bob@example.com', phone: '555-123-4567', membershipId: 'MEM003', address: '789 Pine Rd', status: 'Inactive' },
      { name: 'Alice Williams', email: 'alice@example.com', phone: '444-987-6543', membershipId: 'MEM004', address: '321 Elm St', status: 'Active' },
      { name: 'Charlie Brown', email: 'charlie@example.com', phone: '333-555-7777', membershipId: 'MEM005', address: '654 Cedar Ln', status: 'Active' },
    ]);
    
    // Create some transactions
    const issueDate1 = new Date();
    issueDate1.setDate(issueDate1.getDate() - 10);
    const dueDate1 = new Date();
    dueDate1.setDate(dueDate1.getDate() + 4);
    
    const issueDate2 = new Date();
    issueDate2.setDate(issueDate2.getDate() - 20);
    const dueDate2 = new Date();
    dueDate2.setDate(dueDate2.getDate() - 6);
    const returnDate2 = new Date();
    returnDate2.setDate(returnDate2.getDate() - 5);

    await Transaction.insertMany([
      { book: createdBooks[0]._id, member: createdMembers[0]._id, issueDate: issueDate1, dueDate: dueDate1, status: 'Issued' },
      { book: createdBooks[1]._id, member: createdMembers[1]._id, issueDate: issueDate2, dueDate: dueDate2, returnDate: returnDate2, status: 'Returned' },
    ]);
    
    // Update available copies for issued books
    await Book.updateOne({ _id: createdBooks[0]._id }, { availableCopies: 4 });

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

importData();

import { useState, useEffect } from 'react';
import { Plus, Search, Filter, MoreVertical, Edit2, Trash2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Modal from '../components/Modal';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    title: '', author: '', isbn: '', category: '', quantity: 1, publishedYear: new Date().getFullYear(), description: ''
  });
  
  const fetchBooks = async () => {
    try {
      const { data } = await api.get('/books');
      setBooks(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleOpenModal = (book = null) => {
    if (book) {
      setEditingBook(book);
      setFormData({
        title: book.title, author: book.author, isbn: book.isbn, 
        category: book.category, quantity: book.quantity, 
        publishedYear: book.publishedYear, description: book.description || ''
      });
    } else {
      setEditingBook(null);
      setFormData({
        title: '', author: '', isbn: '', category: '', quantity: 1, publishedYear: new Date().getFullYear(), description: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBook) {
        await api.put(`/books/${editingBook._id}`, formData);
      } else {
        await api.post('/books', formData);
      }
      setIsModalOpen(false);
      fetchBooks();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving book');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await api.delete(`/books/${id}`);
        fetchBooks();
      } catch (error) {
        alert(error.response?.data?.message || 'Error deleting book');
      }
    }
  };

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(search.toLowerCase()) || 
    b.author.toLowerCase().includes(search.toLowerCase()) ||
    b.isbn.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Books</h2>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={18} />
          <span>Add Book</span>
        </button>
      </div>

      <div className="glass-panel p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by title, author, or ISBN..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 text-slate-600 hover:text-slate-800 px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors w-full sm:w-auto justify-center">
          <Filter size={18} />
          <span className="text-sm font-medium">Filters</span>
        </button>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-medium">Title & Author</th>
                <th className="px-6 py-4 font-medium">ISBN</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-slate-500">Loading books...</td>
                </tr>
              ) : filteredBooks.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-slate-500">No books found.</td>
                </tr>
              ) : (
                filteredBooks.map((book) => (
                  <tr key={book._id} className="table-row-hover">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-14 bg-slate-200 rounded flex items-center justify-center text-slate-400 flex-shrink-0">
                          <Book size={20} />
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{book.title}</p>
                          <p className="text-xs text-slate-500">{book.author}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{book.isbn}</td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full text-xs font-medium">
                        {book.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium w-max ${
                          book.availableCopies > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {book.availableCopies > 0 ? 'Available' : 'Unavailable'}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-1">{book.availableCopies} of {book.quantity} left</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/books/${book._id}`} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                          <Eye size={16} />
                        </Link>
                        <button onClick={() => handleOpenModal(book)} className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(book._id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingBook ? "Edit Book" : "Add New Book"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Title <span className="text-red-500">*</span></label>
              <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Author <span className="text-red-500">*</span></label>
              <input required type="text" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">ISBN <span className="text-red-500">*</span></label>
              <input required type="text" value={formData.isbn} onChange={e => setFormData({...formData, isbn: e.target.value})} disabled={!!editingBook} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all disabled:bg-slate-50 disabled:text-slate-500" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Category <span className="text-red-500">*</span></label>
              <input required type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Total Quantity <span className="text-red-500">*</span></label>
              <input required type="number" min="1" value={formData.quantity} onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Published Year <span className="text-red-500">*</span></label>
              <input required type="number" value={formData.publishedYear} onChange={e => setFormData({...formData, publishedYear: parseInt(e.target.value)})} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all" />
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Description</label>
            <textarea rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none"></textarea>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors">
              {editingBook ? 'Save Changes' : 'Add Book'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Books;

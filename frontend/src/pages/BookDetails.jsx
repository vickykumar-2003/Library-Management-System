import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Book as BookIcon, Edit2, Trash2 } from 'lucide-react';
import api from '../services/api';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const { data } = await api.get(`/books/${id}`);
        setBook(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await api.delete(`/books/${id}`);
        navigate('/books');
      } catch (error) {
        alert(error.response?.data?.message || 'Error deleting book');
      }
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading...</div>;
  if (!book) return <div className="p-8 text-center text-slate-500">Book not found</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/books" className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft size={16} /> Back to Books
        </Link>
        <div className="flex gap-2">
          <button onClick={handleDelete} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="p-8 sm:flex gap-8 items-start">
          <div className="w-40 h-56 bg-slate-100 rounded-xl flex items-center justify-center text-slate-300 flex-shrink-0 mb-6 sm:mb-0 shadow-sm border border-slate-200">
            <BookIcon size={64} />
          </div>
          
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-3">
              <span className="bg-primary-50 text-primary-700 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                {book.category}
              </span>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium w-max ${
                  book.availableCopies > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                }`}>
                  {book.availableCopies > 0 ? 'Available' : 'Unavailable'}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold text-slate-800 mb-2">{book.title}</h1>
            <p className="text-lg text-slate-600 mb-6">by <span className="font-medium text-slate-800">{book.author}</span></p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8 py-6 border-y border-slate-100">
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">ISBN</p>
                <p className="font-medium text-slate-800">{book.isbn}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Published</p>
                <p className="font-medium text-slate-800">{book.publishedYear}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Total Copies</p>
                <p className="font-medium text-slate-800">{book.quantity}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Available</p>
                <p className="font-medium text-emerald-600">{book.availableCopies}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-800 mb-2 uppercase tracking-wider">Description</h3>
              <p className="text-slate-600 leading-relaxed">
                {book.description || 'No description provided for this book.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;

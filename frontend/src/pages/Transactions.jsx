import { useState, useEffect } from 'react';
import { Plus, Search, BookUp } from 'lucide-react';
import api from '../services/api';
import Modal from '../components/Modal';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    bookId: '', memberId: '', issueDate: new Date().toISOString().split('T')[0], dueDate: ''
  });
  
  const fetchData = async () => {
    try {
      const [txRes, bookRes, memRes] = await Promise.all([
        api.get('/transactions'),
        api.get('/books'),
        api.get('/members')
      ]);
      setTransactions(txRes.data.data);
      setBooks(bookRes.data.data);
      setMembers(memRes.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleIssueBook = async (e) => {
    e.preventDefault();
    try {
      await api.post('/transactions/issue', formData);
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error issuing book');
    }
  };

  const handleReturnBook = async (id) => {
    if (window.confirm('Mark this book as returned?')) {
      try {
        await api.put(`/transactions/${id}/return`, { returnDate: new Date() });
        fetchData();
      } catch (error) {
        alert(error.response?.data?.message || 'Error returning book');
      }
    }
  };

  const filteredTransactions = transactions.filter(t => 
    t.book?.title.toLowerCase().includes(search.toLowerCase()) || 
    t.member?.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Transactions</h2>
        <button 
          onClick={() => {
            setFormData({
              bookId: '', memberId: '', issueDate: new Date().toISOString().split('T')[0], 
              dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            });
            setIsModalOpen(true);
          }}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
        >
          <BookUp size={18} />
          <span>Issue Book</span>
        </button>
      </div>

      <div className="glass-panel p-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by book or member name..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-medium">Book</th>
                <th className="px-6 py-4 font-medium">Member</th>
                <th className="px-6 py-4 font-medium">Issue Date</th>
                <th className="px-6 py-4 font-medium">Due Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="6" className="px-6 py-10 text-center text-slate-500">Loading...</td></tr>
              ) : filteredTransactions.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-10 text-center text-slate-500">No transactions found.</td></tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx._id} className="table-row-hover">
                    <td className="px-6 py-4 font-medium text-slate-800">{tx.book?.title}</td>
                    <td className="px-6 py-4 text-slate-600">{tx.member?.name}</td>
                    <td className="px-6 py-4 text-slate-600">{new Date(tx.issueDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-slate-600">{new Date(tx.dueDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium w-max ${
                        tx.status === 'Issued' ? 'bg-blue-100 text-blue-700' :
                        tx.status === 'Returned' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {tx.status === 'Issued' && (
                        <button 
                          onClick={() => handleReturnBook(tx._id)}
                          className="px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded text-xs font-medium transition-colors border border-emerald-200"
                        >
                          Mark Returned
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Issue Book">
        <form onSubmit={handleIssueBook} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Select Member <span className="text-red-500">*</span></label>
            <select required value={formData.memberId} onChange={e => setFormData({...formData, memberId: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500">
              <option value="">-- Select Member --</option>
              {members.filter(m => m.status === 'Active').map(m => (
                <option key={m._id} value={m._id}>{m.name} ({m.membershipId})</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Select Book <span className="text-red-500">*</span></label>
            <select required value={formData.bookId} onChange={e => setFormData({...formData, bookId: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500">
              <option value="">-- Select Book --</option>
              {books.filter(b => b.availableCopies > 0).map(b => (
                <option key={b._id} value={b._id}>{b.title} ({b.availableCopies} available)</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Issue Date <span className="text-red-500">*</span></label>
              <input required type="date" value={formData.issueDate} onChange={e => setFormData({...formData, issueDate: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Due Date <span className="text-red-500">*</span></label>
              <input required type="date" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors">
              Issue Book
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Transactions;

import { useState, useEffect } from 'react';
import { Book, Users, ArrowRightLeft, TrendingUp, AlertCircle, Library } from 'lucide-react';
import api from '../services/api';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, icon: Icon, trend, trendLabel, colorClass }) => (
  <div className="glass-panel p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${colorClass}`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
    <div className="mt-4 flex items-center text-sm">
      <TrendingUp size={16} className="text-emerald-500 mr-1.5" />
      <span className="text-emerald-500 font-medium">{trend}</span>
      <span className="text-slate-400 ml-1.5">{trendLabel}</span>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/dashboard/stats');
        setStats(data.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-36 bg-slate-200 rounded-xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-96 bg-slate-200 rounded-xl" />
          <div className="h-96 bg-slate-200 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-slate-800 mb-2">Failed to load dashboard</h2>
        <p className="text-slate-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-primary-500/20">
        <h2 className="text-2xl font-bold mb-2">Welcome back, Admin! 👋</h2>
        <p className="text-primary-100">Here's what's happening in your library today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Books" 
          value={stats.totalBooks} 
          icon={Library} 
          trend="+12%" 
          trendLabel="from last month"
          colorClass="bg-blue-500"
        />
        <StatCard 
          title="Available Books" 
          value={stats.availableBooks} 
          icon={Book} 
          trend="+5%" 
          trendLabel="from last month"
          colorClass="bg-emerald-500"
        />
        <StatCard 
          title="Books Issued" 
          value={stats.issuedBooks} 
          icon={ArrowRightLeft} 
          trend="+18%" 
          trendLabel="from last month"
          colorClass="bg-amber-500"
        />
        <StatCard 
          title="Total Members" 
          value={stats.totalMembers} 
          icon={Users} 
          trend="+2%" 
          trendLabel="from last month"
          colorClass="bg-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="glass-panel p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-800">Recent Transactions</h3>
            <Link to="/transactions" className="text-sm text-primary-600 hover:text-primary-700 font-medium">View all</Link>
          </div>
          <div className="flex-1 overflow-x-auto">
            {stats.recentTransactions.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 py-10">
                <ArrowRightLeft size={32} className="mb-2 opacity-50" />
                <p>No recent transactions</p>
              </div>
            ) : (
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="text-slate-500 border-b border-slate-100">
                  <tr>
                    <th className="pb-3 font-medium">Member</th>
                    <th className="pb-3 font-medium">Book</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stats.recentTransactions.map((tx) => (
                    <tr key={tx._id} className="table-row-hover">
                      <td className="py-3 pr-4 font-medium text-slate-700">{tx.member?.name || 'Unknown'}</td>
                      <td className="py-3 pr-4 text-slate-600 truncate max-w-[150px]">{tx.book?.title || 'Unknown'}</td>
                      <td className="py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          tx.status === 'Issued' ? 'bg-blue-100 text-blue-700' :
                          tx.status === 'Returned' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Recently Added Books */}
        <div className="glass-panel p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-800">Recently Added Books</h3>
            <Link to="/books" className="text-sm text-primary-600 hover:text-primary-700 font-medium">View all</Link>
          </div>
          <div className="space-y-4">
            {stats.recentBooks.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 py-10">
                <Book size={32} className="mb-2 opacity-50" />
                <p>No recent books</p>
              </div>
            ) : (
              stats.recentBooks.map((book) => (
                <div key={book._id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                  <div className="w-12 h-16 bg-slate-200 rounded flex-shrink-0 flex items-center justify-center text-slate-400">
                    <Book size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-slate-800 truncate">{book.title}</h4>
                    <p className="text-xs text-slate-500 truncate">{book.author}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{book.category}</span>
                      <span className={`text-[10px] font-medium ${book.availableCopies > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        {book.availableCopies} available
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

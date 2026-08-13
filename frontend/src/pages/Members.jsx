import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Eye, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Modal from '../components/Modal';

const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', membershipId: '', address: '', status: 'Active'
  });
  
  const fetchMembers = async () => {
    try {
      const { data } = await api.get('/members');
      setMembers(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleOpenModal = (member = null) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name, email: member.email, phone: member.phone, 
        membershipId: member.membershipId, address: member.address, status: member.status
      });
    } else {
      setEditingMember(null);
      setFormData({
        name: '', email: '', phone: '', membershipId: '', address: '', status: 'Active'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMember) {
        await api.put(`/members/${editingMember._id}`, formData);
      } else {
        await api.post('/members', formData);
      }
      setIsModalOpen(false);
      fetchMembers();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving member');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        await api.delete(`/members/${id}`);
        fetchMembers();
      } catch (error) {
        alert(error.response?.data?.message || 'Error deleting member');
      }
    }
  };

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    m.membershipId.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Members</h2>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={18} />
          <span>Add Member</span>
        </button>
      </div>

      <div className="glass-panel p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, email, or ID..."
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
                <th className="px-6 py-4 font-medium">Member</th>
                <th className="px-6 py-4 font-medium">Membership ID</th>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-10 text-center text-slate-500">Loading members...</td></tr>
              ) : filteredMembers.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-10 text-center text-slate-500">No members found.</td></tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr key={member._id} className="table-row-hover">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 flex-shrink-0">
                          <User size={18} />
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{member.name}</p>
                          <p className="text-xs text-slate-500">Joined {new Date(member.joinDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{member.membershipId}</td>
                    <td className="px-6 py-4">
                      <p className="text-slate-700">{member.email}</p>
                      <p className="text-xs text-slate-500">{member.phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium w-max ${
                        member.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/members/${member._id}`} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                          <Eye size={16} />
                        </Link>
                        <button onClick={() => handleOpenModal(member)} className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(member._id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingMember ? "Edit Member" : "Add New Member"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Full Name <span className="text-red-500">*</span></label>
              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Membership ID <span className="text-red-500">*</span></label>
              <input required type="text" value={formData.membershipId} onChange={e => setFormData({...formData, membershipId: e.target.value})} disabled={!!editingMember} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all disabled:bg-slate-50 disabled:text-slate-500" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Email <span className="text-red-500">*</span></label>
              <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Phone <span className="text-red-500">*</span></label>
              <input required type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all" />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <label className="text-sm font-medium text-slate-700">Address <span className="text-red-500">*</span></label>
              <input required type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Status</label>
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors">
              {editingMember ? 'Save Changes' : 'Add Member'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Members;

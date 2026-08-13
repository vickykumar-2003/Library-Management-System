import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import api from '../services/api';

const MemberDetails = () => {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const { data } = await api.get(`/members/${id}`);
        setMember(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMember();
  }, [id]);

  if (loading) return <div className="p-8 text-center text-slate-500">Loading...</div>;
  if (!member) return <div className="p-8 text-center text-slate-500">Member not found</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center">
        <Link to="/members" className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft size={16} /> Back to Members
        </Link>
      </div>

      <div className="glass-panel p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 border-b border-slate-100 pb-8 mb-8">
          <div className="w-32 h-32 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 flex-shrink-0 shadow-inner">
            <User size={64} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
              <h1 className="text-3xl font-bold text-slate-800">{member.name}</h1>
              <span className={`mt-2 md:mt-0 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium w-max mx-auto md:mx-0 ${
                member.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
              }`}>
                {member.status}
              </span>
            </div>
            <p className="text-lg text-primary-600 font-medium mb-4">ID: {member.membershipId}</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <Mail size={16} className="text-slate-400" />
                <span>{member.email}</span>
              </div>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <Phone size={16} className="text-slate-400" />
                <span>{member.phone}</span>
              </div>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <MapPin size={16} className="text-slate-400" />
                <span>{member.address}</span>
              </div>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <Calendar size={16} className="text-slate-400" />
                <span>Joined {new Date(member.joinDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Transaction History</h3>
          <p className="text-slate-500 text-sm">Transaction history feature goes here...</p>
        </div>
      </div>
    </div>
  );
};

export default MemberDetails;

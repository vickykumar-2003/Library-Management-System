import { Menu, Bell, Search } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Header = ({ setIsMobileMenuOpen }) => {
  const location = useLocation();
  const path = location.pathname;
  
  let pageTitle = 'Dashboard';
  if (path.includes('/books')) pageTitle = 'Books Management';
  if (path.includes('/members')) pageTitle = 'Members Management';
  if (path.includes('/transactions')) pageTitle = 'Transactions';
  if (path.includes('/settings')) pageTitle = 'Settings';

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-xl font-semibold text-slate-800">{pageTitle}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all w-64"
          />
        </div>
        
        <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;

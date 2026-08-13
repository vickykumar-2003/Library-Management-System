import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Book, Users, ArrowRightLeft, Settings, Library, X } from 'lucide-react';

const Sidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Books', path: '/books', icon: Book },
    { name: 'Members', path: '/members', icon: Users },
    { name: 'Transactions', path: '/transactions', icon: ArrowRightLeft },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={closeMenu}
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 flex flex-col ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header/Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
          <div className="flex items-center gap-2 text-primary-600">
            <Library size={24} className="stroke-2" />
            <span className="font-bold text-lg tracking-tight text-slate-800">NovaLib</span>
          </div>
          <button 
            onClick={closeMenu}
            className="md:hidden text-slate-500 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={closeMenu}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium ${
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
        
        {/* Bottom profile minimal */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">Admin User</p>
              <p className="text-xs text-slate-500 truncate">admin@novalib.com</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

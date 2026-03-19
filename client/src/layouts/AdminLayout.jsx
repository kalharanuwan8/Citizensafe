import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: '📊' },
    { label: 'Disasters', path: '/admin/disasters', icon: '🚨' },
    { label: 'Create Alert', path: '/admin/alerts', icon: '⚠️' },
    { label: 'Users', path: '/admin/users', icon: '👥' },
    { label: 'Profile', path: '/admin/profile', icon: '👤' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar (Desktop) */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex md:flex-col shadow-sm">
        <div className="p-5 border-b border-gray-100 flex items-center gap-3">
          <img src="/logo.png" alt="CitizenSafe" className="h-9 w-auto" />
          <span className="text-sm font-semibold text-gray-500 tracking-wide uppercase">Admin</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium transition-colors ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <span className="text-lg">🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header (visible only on small screens) */}
        <header className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between shadow-sm">
           <img src="/logo.png" alt="CitizenSafe" className="h-8 w-auto" />
           {/* Mobile menu could be added here, but requirement focuses on desktop admin */}
           <span className="text-sm text-gray-500">Desktop Optimized</span>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

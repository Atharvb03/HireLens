import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'bg-indigo-600 shadow-lg' : '';

  const menuItems = [
    { path: '/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/jobs', icon: '💼', label: 'Job Management' },
    { path: '/candidates', icon: '👥', label: 'Candidates' },
    { path: '/top-ranked', icon: '🏆', label: 'Top Performers' },
    { path: '/analytics', icon: '📈', label: 'Analytics' },
    { path: '/reports', icon: '📋', label: 'Reports' },
  ];

  return (
    <aside className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white w-72 min-h-screen shadow-2xl">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">🎯</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">RecruitAI</h2>
            <p className="text-xs text-gray-400">HR Management System</p>
          </div>
        </div>
      </div>
      
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-indigo-600 hover:shadow-lg hover:translate-x-1 ${isActive(item.path)}`}
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-0 w-72 p-4 border-t border-gray-700">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-4 text-center">
          <p className="text-sm font-semibold">Need Help?</p>
          <p className="text-xs text-gray-200 mt-1">Contact Support</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

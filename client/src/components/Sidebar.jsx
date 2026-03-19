import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
    HiOutlineViewGrid,
    HiOutlineCash,
    HiOutlineChartPie,
    HiOutlineCreditCard,
    HiOutlineLogout,
    HiOutlineSun,
    HiOutlineMoon,
    HiOutlineX
} from 'react-icons/hi';

const navItems = [
    { path: '/', label: 'Dashboard', icon: HiOutlineViewGrid },
    { path: '/expenses', label: 'Expenses', icon: HiOutlineCash },
    { path: '/analytics', label: 'Analytics', icon: HiOutlineChartPie },
    { path: '/budget', label: 'Budget', icon: HiOutlineCreditCard },
];

const Sidebar = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const location = useLocation();

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" onClick={onClose} />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-50 h-full w-[260px] glass-card rounded-none border-r flex flex-col
          transition-transform duration-300 ease-in-out
          lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                {/* Header */}
                <div className="p-5 border-b border-dark-200 dark:border-dark-700/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-sm">ET</span>
                        </div>
                        <div>
                            <h1 className="text-base font-bold text-dark-900 dark:text-dark-100">ExpenseTracker</h1>
                            <p className="text-[11px] text-dark-400 dark:text-dark-500 font-medium">Financial Dashboard</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="lg:hidden p-1 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors">
                        <HiOutlineX className="w-5 h-5 text-dark-500" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map(item => {
                        const isActive = location.pathname === item.path;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={onClose}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive
                                        ? 'gradient-primary text-white shadow-lg shadow-primary-500/25'
                                        : 'text-dark-500 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-800 hover:text-dark-900 dark:hover:text-dark-100'
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.label}
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Bottom section */}
                <div className="p-4 border-t border-dark-200 dark:border-dark-700/50 space-y-2">
                    {/* Theme toggle */}
                    <button
                        onClick={toggleTheme}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium
              text-dark-500 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-800 transition-all duration-200"
                    >
                        {isDark ? <HiOutlineSun className="w-5 h-5" /> : <HiOutlineMoon className="w-5 h-5" />}
                        {isDark ? 'Light Mode' : 'Dark Mode'}
                    </button>

                    {/* User info */}
                    <div className="flex items-center gap-3 px-4 py-2 mb-1">
                        <div className="w-8 h-8 rounded-full gradient-accent flex items-center justify-center">
                            <span className="text-white text-xs font-bold">{user?.name?.charAt(0)?.toUpperCase()}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-dark-800 dark:text-dark-200 truncate">{user?.name}</p>
                            <p className="text-[11px] text-dark-400 truncate">{user?.email}</p>
                        </div>
                    </div>

                    {/* Logout */}
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium
              text-danger-500 hover:bg-danger-500/10 transition-all duration-200"
                    >
                        <HiOutlineLogout className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;

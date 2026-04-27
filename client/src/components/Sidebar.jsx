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
                <div className="lg:hidden fixed inset-0 bg-slate-900/40 z-40 backdrop-blur-sm" onClick={onClose} />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-50 h-full w-[260px] bg-white/90 backdrop-blur-xl shadow-[4px_0_24px_rgba(0,0,0,0.02)] flex flex-col
          transition-transform duration-300 ease-in-out border-r border-slate-100
          lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/30 rounded-xl flex items-center justify-center">
                            <span className="text-white font-black text-sm tracking-widest">ET</span>
                        </div>
                        <div>
                            <h1 className="text-lg font-black text-slate-900 tracking-tight">ExpenseTracker</h1>
                        </div>
                    </div>
                    <button onClick={onClose} className="lg:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors">
                        <HiOutlineX className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-5 space-y-2">
                    {navItems.map(item => {
                        const isActive = location.pathname === item.path;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={onClose}
                                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-300
                  ${isActive
                                        ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30 translate-x-1'
                                        : 'text-slate-500 hover:bg-primary-50 hover:text-primary-600 hover:translate-x-1'
                                    }`}
                            >
                                <item.icon className="w-6 h-6" />
                                {item.label}
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Bottom section */}
                <div className="p-5 border-t border-slate-100 space-y-3">
                    {/* Theme toggle */}
                    <button
                        onClick={toggleTheme}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold
              text-slate-500 hover:bg-slate-100 transition-all duration-200"
                    >
                        {isDark ? <HiOutlineSun className="w-6 h-6" /> : <HiOutlineMoon className="w-6 h-6" />}
                        {isDark ? 'Light Mode' : 'Dark Mode'}
                    </button>

                    {/* User info */}
                    <div className="flex items-center gap-3 px-4 py-2 mb-2 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-400 to-accent-600 shadow-md flex items-center justify-center">
                            <span className="text-white text-sm font-black">{user?.name?.charAt(0)?.toUpperCase()}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-extrabold text-slate-800 truncate">{user?.name}</p>
                            <p className="text-xs text-slate-500 font-medium truncate">{user?.email}</p>
                        </div>
                    </div>

                    {/* Logout */}
                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-bold
              text-danger-600 bg-danger-50 hover:bg-danger-100 transition-all duration-200"
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

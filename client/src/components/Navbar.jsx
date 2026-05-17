import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { HiOutlineMenuAlt2, HiOutlineBell, HiOutlineCheckCircle, HiOutlineX } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

const initialNotifications = [
    { id: 1, title: 'Welcome!', message: 'Welcome to JD Expense Tracker! Start tracking your expenses.', time: 'Just now', read: false, color: 'primary' },
    { id: 2, title: 'Budget Alert', message: 'You\'ve spent 80% of your Food budget this month.', time: '2 hours ago', read: false, color: 'warning' },
    { id: 3, title: 'New Feature', message: 'Analytics charts are now available on the dashboard.', time: '1 day ago', read: false, color: 'accent' },
    { id: 4, title: 'Overspending', message: 'You exceeded your Entertainment budget by ₹500.', time: '2 days ago', read: false, color: 'danger' },
];

const Navbar = ({ onMenuClick }) => {
    const { user } = useAuth();
    const [notifOpen, setNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState(initialNotifications);
    const dropdownRef = useRef(null);

    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setNotifOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const dismissNotif = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const notifBg = {
        primary: 'bg-primary-100 dark:bg-primary-900/30',
        warning: 'bg-warning-500/10 dark:bg-warning-500/20',
        accent: 'bg-accent-500/10 dark:bg-accent-500/20',
        danger: 'bg-danger-100 dark:bg-danger-900/30',
    };

    const notifDot = {
        primary: 'bg-primary-500',
        warning: 'bg-warning-500',
        accent: 'bg-accent-500',
        danger: 'bg-danger-500',
    };

    return (
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-dark-800/80 backdrop-blur-md border-b border-dark-200 dark:border-dark-700/50 shadow-sm">
            <div className="flex items-center justify-between h-[72px] px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Left side */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 rounded-xl hover:bg-primary-50 transition-colors"
                    >
                        <HiOutlineMenuAlt2 className="w-6 h-6 text-dark-900 dark:text-dark-300" />
                    </button>
                    <div>
                        <p className="text-sm text-dark-900 dark:text-dark-400 font-medium">
                            Welcome back,
                        </p>
                        <p className="text-lg font-extrabold text-dark-900 dark:text-dark-100 tracking-tight">
                            {user?.name || 'User'} <span className="text-xl">👋</span>
                        </p>
                    </div>
                </div>

                {/* Right side */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setNotifOpen(o => !o)}
                        className="p-2.5 rounded-xl hover:bg-primary-50 transition-colors relative group"
                    >
                        <HiOutlineBell className="w-6 h-6 text-dark-900 dark:text-dark-400 group-hover:text-primary-600 transition-colors" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-danger-500 rounded-full border-2 border-white dark:border-dark-800" />
                        )}
                    </button>

                    <AnimatePresence>
                        {notifOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                                transition={{ duration: 0.2 }}
                                className="absolute right-0 mt-3 w-[380px] max-w-[90vw] glass-card p-0 overflow-hidden shadow-xl"
                                style={{ originY: 'top' }}
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between px-5 py-4 border-b border-dark-200 dark:border-dark-700">
                                    <h3 className="text-base font-extrabold text-dark-900 dark:text-dark-100">
                                        Notifications
                                        {unreadCount > 0 && (
                                            <span className="ml-2 text-xs font-bold text-white bg-primary-500 px-2 py-0.5 rounded-full">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </h3>
                                    {unreadCount > 0 && (
                                        <button
                                            onClick={markAllRead}
                                            className="flex items-center gap-1 text-xs font-bold text-primary-500 hover:text-primary-600 transition-colors"
                                        >
                                            <HiOutlineCheckCircle className="w-4 h-4" />
                                            Mark all read
                                        </button>
                                    )}
                                </div>

                                {/* List */}
                                <div className="max-h-[360px] overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <div className="px-5 py-12 text-center">
                                            <p className="text-3xl mb-2">🎉</p>
                                            <p className="text-sm font-bold text-dark-900 dark:text-dark-400">All caught up!</p>
                                            <p className="text-xs text-dark-500 dark:text-dark-500 mt-1">No new notifications.</p>
                                        </div>
                                    ) : (
                                        notifications.map((n) => (
                                            <div
                                                key={n.id}
                                                className={`flex items-start gap-3 px-5 py-4 border-b border-dark-100 dark:border-dark-800 transition-colors ${!n.read ? 'bg-primary-50/40 dark:bg-primary-900/10' : 'hover:bg-dark-50 dark:hover:bg-dark-800/50'
                                                    }`}
                                            >
                                                <div className={`w-10 h-10 rounded-xl ${notifBg[n.color]} flex items-center justify-center shrink-0 mt-0.5`}>
                                                    <div className={`w-3 h-3 rounded-full ${notifDot[n.color]}`} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <p className="text-sm font-extrabold text-dark-900 dark:text-dark-100">{n.title}</p>
                                                        <button
                                                            onClick={() => dismissNotif(n.id)}
                                                            className="p-0.5 rounded hover:bg-dark-200 dark:hover:bg-dark-700 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                                                        >
                                                            <HiOutlineX className="w-4 h-4 text-dark-400" />
                                                        </button>
                                                    </div>
                                                    <p className="text-sm text-dark-500 dark:text-dark-400 mt-0.5">{n.message}</p>
                                                    <p className="text-xs text-dark-400 dark:text-dark-500 mt-1.5 font-medium">{n.time}</p>
                                                </div>
                                                {!n.read && (
                                                    <div className="w-2 h-2 rounded-full bg-primary-500 shrink-0 mt-2.5" />
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
};

export default Navbar;

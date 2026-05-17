import { useAuth } from '../context/AuthContext';
import { HiOutlineMenuAlt2, HiOutlineBell } from 'react-icons/hi';

const Navbar = ({ onMenuClick }) => {
    const { user } = useAuth();

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
                <div className="flex items-center gap-3">
                    <button className="p-2.5 rounded-xl hover:bg-primary-50 transition-colors relative group">
                        <HiOutlineBell className="w-6 h-6 text-dark-900 dark:text-dark-400 group-hover:text-primary-600 transition-colors" />
                        <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-danger-500 rounded-full border-2 border-white" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;

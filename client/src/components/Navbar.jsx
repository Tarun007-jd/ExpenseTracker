import { useAuth } from '../context/AuthContext';
import { HiOutlineMenuAlt2, HiOutlineBell } from 'react-icons/hi';

const Navbar = ({ onMenuClick }) => {
    const { user } = useAuth();

    return (
        <header className="sticky top-0 z-30 glass border-b border-dark-200 dark:border-dark-700/50">
            <div className="flex items-center justify-between h-16 px-4 lg:px-6">
                {/* Left side */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 rounded-xl hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
                    >
                        <HiOutlineMenuAlt2 className="w-5 h-5 text-dark-600 dark:text-dark-300" />
                    </button>
                    <div>
                        <p className="text-sm text-dark-400 dark:text-dark-500">
                            Welcome back,
                        </p>
                        <p className="text-base font-semibold text-dark-800 dark:text-dark-100">
                            {user?.name || 'User'} 👋
                        </p>
                    </div>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-2">
                    <button className="p-2 rounded-xl hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors relative">
                        <HiOutlineBell className="w-5 h-5 text-dark-500 dark:text-dark-400" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;

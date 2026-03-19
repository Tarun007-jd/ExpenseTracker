import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import toast from 'react-hot-toast';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        setLoading(true);
        try {
            await signup(name, email, password);
            toast.success('Account created successfully!');
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left decorative panel */}
            <div className="hidden lg:flex lg:w-1/2 gradient-bg items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
                </div>
                <div className="relative z-10 text-center text-white px-12">
                    <div className="w-20 h-20 mx-auto mb-6 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        <span className="text-3xl font-bold">ET</span>
                    </div>
                    <h2 className="text-4xl font-bold mb-4">Join ExpenseTracker</h2>
                    <p className="text-lg text-white/80 leading-relaxed">
                        Start your journey towards smarter financial management.
                        Track, analyze, and optimize your spending.
                    </p>
                </div>
            </div>

            {/* Right form panel */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-dark-50 dark:bg-dark-950">
                <div className="w-full max-w-md animate-fade-in">
                    <div className="lg:hidden text-center mb-8">
                        <div className="w-14 h-14 mx-auto gradient-primary rounded-2xl flex items-center justify-center mb-3">
                            <span className="text-white text-xl font-bold">ET</span>
                        </div>
                        <h2 className="text-2xl font-bold text-dark-900 dark:text-dark-100">ExpenseTracker</h2>
                    </div>

                    <h1 className="text-2xl font-bold text-dark-900 dark:text-dark-100 mb-1">Create account</h1>
                    <p className="text-dark-400 dark:text-dark-500 mb-8 text-sm">Enter your details to get started</p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-dark-600 dark:text-dark-400 mb-1.5">Full Name</label>
                            <div className="relative">
                                <HiOutlineUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Doe"
                                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-dark-200 dark:border-dark-600
                    bg-white dark:bg-dark-800 text-dark-900 dark:text-dark-100
                    focus:ring-2 focus:ring-primary-500 focus:border-transparent
                    outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark-600 dark:text-dark-400 mb-1.5">Email</label>
                            <div className="relative">
                                <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-dark-200 dark:border-dark-600
                    bg-white dark:bg-dark-800 text-dark-900 dark:text-dark-100
                    focus:ring-2 focus:ring-primary-500 focus:border-transparent
                    outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark-600 dark:text-dark-400 mb-1.5">Password</label>
                            <div className="relative">
                                <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="At least 6 characters"
                                    className="w-full pl-11 pr-11 py-2.5 rounded-xl border border-dark-200 dark:border-dark-600
                    bg-white dark:bg-dark-800 text-dark-900 dark:text-dark-100
                    focus:ring-2 focus:ring-primary-500 focus:border-transparent
                    outline-none transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-600 transition-colors"
                                >
                                    {showPassword ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl gradient-primary text-white font-semibold
                hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300
                disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <p className="text-center mt-6 text-sm text-dark-400 dark:text-dark-500">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-500 hover:text-primary-600 font-semibold transition-colors">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;

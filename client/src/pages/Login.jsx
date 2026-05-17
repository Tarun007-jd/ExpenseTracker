import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import expenseIcon from '../assets/jd_icon.png';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import toast from 'react-hot-toast';

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.08 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showForgotModal, setShowForgotModal] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetLoading, setResetLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            toast.success('Welcome back!');
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        if (!resetEmail) {
            toast.error('Please enter your email address');
            return;
        }
        setResetLoading(true);
        try {
            // Mocking a network request
            await new Promise(resolve => setTimeout(resolve, 1500));
            toast.success('Password reset link sent to your email!');
            setShowForgotModal(false);
            setResetEmail('');
        } catch (error) {
            toast.error('Failed to send reset link');
        } finally {
            setResetLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left decorative panel */}
            <div className="hidden lg:flex lg:w-1/2 gradient-primary items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-grid-pattern opacity-10" />
                </div>
                <div className="relative z-10 text-center text-white px-12">
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="w-20 h-20 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg overflow-hidden"
                    >
                        <img src={expenseIcon} alt="JD Expense Tracker" className="w-full h-full object-cover rounded-full" />
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-4xl font-bold mb-4"
                    >
                        ExpenseTracker
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-lg text-white/80 leading-relaxed"
                    >
                        Take control of your finances with powerful insights,
                        beautiful analytics, and smart budget tracking.
                    </motion.p>
                </div>
            </div>

            {/* Right form panel */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-dark-50 dark:bg-dark-950">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="w-full max-w-md"
                >
                    {/* Mobile logo */}
                    <motion.div variants={itemVariants} className="lg:hidden text-center mb-8">
                        <div className="w-14 h-14 mx-auto gradient-primary rounded-full flex items-center justify-center mb-3 shadow-lg shadow-primary-500/30 overflow-hidden p-1">
                            <img src={expenseIcon} alt="JD Expense Tracker" className="w-full h-full object-cover rounded-full" />
                        </div>
                        <h2 className="text-2xl font-bold text-dark-900 dark:text-dark-100">JD Expense Tracker</h2>
                    </motion.div>

                    <motion.div variants={itemVariants} className="glass-card p-8 lg:p-10">
                        <h1 className="text-2xl font-bold text-dark-900 dark:text-dark-100 mb-1">Welcome back</h1>
                        <p className="text-dark-700 dark:text-dark-400 mb-8 text-sm font-medium">Sign in to your account to continue</p>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <motion.div variants={itemVariants}>
                                <label className="block text-sm font-bold text-dark-700 dark:text-dark-300 mb-1.5 uppercase tracking-wider">Email</label>
                                <div className="relative group">
                                    <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500 dark:text-dark-400 group-focus-within:text-primary-500 transition-colors" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-dark-200 dark:border-dark-600
                        bg-white dark:bg-dark-800 text-dark-900 dark:text-dark-100 font-medium
                        focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white dark:focus:bg-dark-800
                        outline-none transition-all placeholder:text-dark-400 dark:placeholder:text-dark-600"
                                    />
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-sm font-bold text-dark-700 dark:text-dark-300 uppercase tracking-wider">Password</label>
                                    <button
                                        type="button"
                                        onClick={() => setShowForgotModal(true)}
                                        className="text-xs font-bold text-primary-500 hover:text-primary-600 transition-colors"
                                    >
                                        Forgot?
                                    </button>
                                </div>
                                <div className="relative group">
                                    <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500 dark:text-dark-400 group-focus-within:text-primary-500 transition-colors" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-11 pr-11 py-3 rounded-xl border border-dark-200 dark:border-dark-600
                        bg-white dark:bg-dark-800 text-dark-900 dark:text-dark-100 font-medium
                        focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white dark:focus:bg-dark-800
                        outline-none transition-all placeholder:text-dark-400 dark:placeholder:text-dark-600"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dark-500 dark:text-dark-400 hover:text-primary-500 transition-colors"
                                    >
                                        {showPassword ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3.5 rounded-xl gradient-primary text-white font-bold text-sm tracking-wider
                        hover:shadow-lg hover:shadow-primary-500/30 hover:-translate-y-0.5 transition-all duration-300
                        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Signing in...
                                        </span>
                                    ) : 'Sign In'}
                                </button>
                            </motion.div>
                        </form>

                        <motion.p variants={itemVariants} className="text-center mt-8 text-sm text-dark-700 dark:text-dark-400 font-medium">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-primary-500 hover:text-primary-600 font-bold transition-colors">
                                Sign Up
                            </Link>
                        </motion.p>
                    </motion.div>
                </motion.div>
            </div>

            {/* Forgot Password Modal */}
            <AnimatePresence>
                {showForgotModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-dark-950/60 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="w-full max-w-md bg-white dark:bg-dark-900 rounded-2xl shadow-2xl overflow-hidden border border-dark-200 dark:border-dark-800"
                        >
                            <div className="p-8">
                                <h2 className="text-2xl font-bold text-dark-900 dark:text-dark-100 mb-2">Reset Password</h2>
                                <p className="text-dark-700 dark:text-dark-400 text-sm mb-6">
                                    Enter the email address associated with your account and we'll send you a link to reset your password.
                                </p>
                                <form onSubmit={handleForgotPassword} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-bold text-dark-700 dark:text-dark-300 mb-1.5 uppercase tracking-wider">Email</label>
                                        <div className="relative group">
                                            <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500 dark:text-dark-400 group-focus-within:text-primary-500 transition-colors" />
                                            <input
                                                type="email"
                                                required
                                                value={resetEmail}
                                                onChange={(e) => setResetEmail(e.target.value)}
                                                placeholder="you@example.com"
                                                className="w-full pl-11 pr-4 py-3 rounded-xl border border-dark-200 dark:border-dark-600
                                bg-dark-50 dark:bg-dark-800 text-dark-900 dark:text-dark-100 font-medium
                                focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowForgotModal(false)}
                                            className="flex-1 py-3 rounded-xl font-bold text-dark-700 dark:text-dark-300 bg-dark-100 dark:bg-dark-800 hover:bg-dark-200 dark:hover:bg-dark-700 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={resetLoading}
                                            className="flex-1 py-3 rounded-xl gradient-primary text-white font-bold hover:shadow-lg hover:shadow-primary-500/30 transition-all disabled:opacity-50"
                                        >
                                            {resetLoading ? 'Sending...' : 'Send Link'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Login;

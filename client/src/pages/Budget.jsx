import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import BudgetBar from '../components/BudgetBar';
import { HiOutlinePlus, HiOutlineTrash, HiOutlineExclamation } from 'react-icons/hi';
import toast from 'react-hot-toast';

const CATEGORIES = ['Food', 'Travel', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Education', 'Other'];

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const Budget = () => {
    const [budgetStatus, setBudgetStatus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ category: 'Food', limit: '', month: getCurrentMonth() });
    const [formLoading, setFormLoading] = useState(false);

    function getCurrentMonth() {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    }

    const fetchBudgetStatus = async () => {
        try {
            const res = await api.get('/budgets/status', { params: { month: formData.month } });
            setBudgetStatus(res.data.status);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBudgetStatus();
    }, [formData.month]);

    const handleSetBudget = async (e) => {
        e.preventDefault();
        if (!formData.limit || parseFloat(formData.limit) <= 0) {
            toast.error('Please enter a valid limit');
            return;
        }
        setFormLoading(true);
        try {
            await api.post('/budgets', {
                category: formData.category,
                limit: parseFloat(formData.limit),
                month: formData.month
            });
            toast.success('Budget set!');
            setFormData(p => ({ ...p, limit: '' }));
            setShowForm(false);
            fetchBudgetStatus();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to set budget');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDeleteBudget = async (budgetCategory) => {
        try {
            // Get all budgets for current month and find ID
            const res = await api.get('/budgets', { params: { month: formData.month } });
            const budget = res.data.budgets.find(b => b.category === budgetCategory);
            if (budget) {
                await api.delete(`/budgets/${budget._id}`);
                toast.success('Budget removed');
                fetchBudgetStatus();
            }
        } catch {
            toast.error('Failed to delete budget');
        }
    };

    const overspentCount = budgetStatus.filter(b => b.overspent).length;
    const totalBudget = budgetStatus.reduce((sum, b) => sum + b.limit, 0);
    const totalSpent = budgetStatus.reduce((sum, b) => sum + b.spent, 0);

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-6"
        >
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">Budget</h2>
                    <p className="text-base text-slate-500 mt-2 font-medium">Set limits and track your spending</p>
                </div>
                <div className="flex items-center gap-3">
                    <input
                        type="month"
                        value={formData.month}
                        onChange={(e) => { setFormData(p => ({ ...p, month: e.target.value })); setLoading(true); }}
                        className="px-5 py-3 rounded-2xl border border-slate-200 font-bold
              bg-white text-slate-900
              focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white
              outline-none transition-all text-sm"
                    />
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold
              bg-primary-500 text-white hover:bg-primary-600 hover:shadow-lg hover:-translate-y-0.5 hover:shadow-primary-500/30 transition-all duration-300"
                    >
                        <HiOutlinePlus className="w-5 h-5 text-white" /> Set Budget
                    </button>
                </div>
            </motion.div>

            {/* Overspending Alert */}
            {overspentCount > 0 && (
                <motion.div variants={itemVariants} className="flex items-center gap-4 p-5 rounded-2xl bg-danger-50 border border-danger-100 shadow-sm">
                    <div className="w-12 h-12 rounded-xl bg-danger-100 flex items-center justify-center shrink-0">
                        <HiOutlineExclamation className="w-6 h-6 text-danger-600" />
                    </div>
                    <div>
                        <p className="text-base font-extrabold text-danger-700">
                            Overspending Alert!
                        </p>
                        <p className="text-sm font-medium text-danger-600/80">
                            You've exceeded the budget limit in {overspentCount} {overspentCount === 1 ? 'category' : 'categories'} this month.
                        </p>
                    </div>
                </motion.div>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <motion.div variants={itemVariants} className="glass-card p-6 shadow-sm bg-white/80 backdrop-blur-xl">
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Total Budget</p>
                    <p className="text-3xl font-black text-slate-900 mt-2">₹{totalBudget.toLocaleString()}</p>
                </motion.div>
                <motion.div variants={itemVariants} className="glass-card p-6 shadow-sm bg-white/80 backdrop-blur-xl">
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Total Spent</p>
                    <p className="text-3xl font-black text-slate-900 mt-2">₹{totalSpent.toLocaleString()}</p>
                </motion.div>
                <motion.div variants={itemVariants} className="glass-card p-6 shadow-sm bg-white/80 backdrop-blur-xl">
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Remaining</p>
                    <p className={`text-3xl font-black mt-2 ${totalBudget - totalSpent >= 0 ? 'text-accent-600' : 'text-danger-600'}`}>
                        ₹{Math.abs(totalBudget - totalSpent).toLocaleString()}
                        {totalBudget - totalSpent < 0 && ' over'}
                    </p>
                </motion.div>
            </div>

            {/* Add Budget Form */}
            {showForm && (
                <motion.div variants={itemVariants} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="glass-card p-6 shadow-sm bg-white/80 backdrop-blur-xl">
                    <h3 className="text-lg font-extrabold text-slate-800 mb-5">Set Budget Limit</h3>
                    <form onSubmit={handleSetBudget} className="flex flex-col sm:flex-row gap-4">
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData(p => ({ ...p, category: e.target.value }))}
                            className="flex-1 px-5 py-3 rounded-2xl border border-slate-200 font-medium
                bg-white text-slate-900
                focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-slate-50
                outline-none transition-all text-sm appearance-none"
                        >
                            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                        <input
                            type="number"
                            placeholder="Budget limit (₹)"
                            min="0"
                            step="100"
                            value={formData.limit}
                            onChange={(e) => setFormData(p => ({ ...p, limit: e.target.value }))}
                            className="flex-1 px-5 py-3 rounded-2xl border border-slate-200 font-medium
                bg-white text-slate-900
                focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-slate-50
                outline-none transition-all text-sm"
                        />
                        <button
                            type="submit"
                            disabled={formLoading}
                            className="px-8 py-3 rounded-2xl bg-primary-500 text-white text-sm font-bold
                hover:shadow-lg hover:bg-primary-600 hover:-translate-y-0.5 hover:shadow-primary-500/30 transition-all
                disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {formLoading ? 'Saving...' : 'Save'}
                        </button>
                    </form>
                </motion.div>
            )}

            {/* Budget Progress Bars */}
            <motion.div variants={containerVariants} className="space-y-4">
                {loading ? (
                    <div className="flex justify-center py-16">
                        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : budgetStatus.length === 0 ? (
                    <motion.div variants={itemVariants} className="glass-card p-16 text-center shadow-sm bg-white/80">
                        <p className="text-5xl mb-4">📊</p>
                        <p className="text-slate-500 font-bold text-lg">No budgets set for this month</p>
                        <p className="text-slate-400 font-medium text-sm mt-2">Click "Set Budget" to add spending limits</p>
                    </motion.div>
                ) : (
                    budgetStatus.map((b) => (
                        <motion.div key={b.category} variants={itemVariants} className="relative group">
                            <BudgetBar category={b.category} limit={b.limit} spent={b.spent} />
                            <button
                                onClick={() => handleDeleteBudget(b.category)}
                                className="absolute top-4 right-4 p-2 rounded-xl opacity-0 group-hover:opacity-100
                  hover:bg-danger-50 text-danger-400 hover:text-danger-600 transition-all"
                            >
                                <HiOutlineTrash className="w-5 h-5" />
                            </button>
                        </motion.div>
                    ))
                )}
            </motion.div>
        </motion.div>
    );
};

export default Budget;

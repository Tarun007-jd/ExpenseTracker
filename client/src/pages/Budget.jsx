import { useState, useEffect } from 'react';
import api from '../api/axios';
import BudgetBar from '../components/BudgetBar';
import { HiOutlinePlus, HiOutlineTrash, HiOutlineExclamation } from 'react-icons/hi';
import toast from 'react-hot-toast';

const CATEGORIES = ['Food', 'Travel', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Education', 'Other'];

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
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-dark-900 dark:text-dark-50">Budget</h2>
                    <p className="text-sm text-dark-400 dark:text-dark-500 mt-1">Set limits and track your spending</p>
                </div>
                <div className="flex items-center gap-3">
                    <input
                        type="month"
                        value={formData.month}
                        onChange={(e) => { setFormData(p => ({ ...p, month: e.target.value })); setLoading(true); }}
                        className="px-4 py-2.5 rounded-xl border border-dark-200 dark:border-dark-600
              bg-white dark:bg-dark-800 text-dark-900 dark:text-dark-100
              outline-none transition-all text-sm"
                    />
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
              gradient-primary text-white hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300"
                    >
                        <HiOutlinePlus className="w-4 h-4" /> Set Budget
                    </button>
                </div>
            </div>

            {/* Overspending Alert */}
            {overspentCount > 0 && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-danger-500/10 border border-danger-500/20 animate-slide-up">
                    <div className="w-10 h-10 rounded-xl bg-danger-500/20 flex items-center justify-center shrink-0">
                        <HiOutlineExclamation className="w-5 h-5 text-danger-500" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-danger-600 dark:text-danger-400">
                            ⚠️ Overspending Alert!
                        </p>
                        <p className="text-xs text-danger-500/80">
                            You've exceeded the budget limit in {overspentCount} {overspentCount === 1 ? 'category' : 'categories'} this month.
                        </p>
                    </div>
                </div>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="glass-card p-5">
                    <p className="text-sm text-dark-400 dark:text-dark-500 font-medium">Total Budget</p>
                    <p className="text-2xl font-bold text-dark-900 dark:text-dark-100 mt-1">₹{totalBudget.toLocaleString()}</p>
                </div>
                <div className="glass-card p-5">
                    <p className="text-sm text-dark-400 dark:text-dark-500 font-medium">Total Spent</p>
                    <p className="text-2xl font-bold text-dark-900 dark:text-dark-100 mt-1">₹{totalSpent.toLocaleString()}</p>
                </div>
                <div className="glass-card p-5">
                    <p className="text-sm text-dark-400 dark:text-dark-500 font-medium">Remaining</p>
                    <p className={`text-2xl font-bold mt-1 ${totalBudget - totalSpent >= 0 ? 'text-accent-500' : 'text-danger-500'}`}>
                        ₹{Math.abs(totalBudget - totalSpent).toLocaleString()}
                        {totalBudget - totalSpent < 0 && ' over'}
                    </p>
                </div>
            </div>

            {/* Add Budget Form */}
            {showForm && (
                <div className="glass-card p-5 animate-scale-in">
                    <h3 className="text-base font-bold text-dark-800 dark:text-dark-200 mb-4">Set Budget Limit</h3>
                    <form onSubmit={handleSetBudget} className="flex flex-col sm:flex-row gap-3">
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData(p => ({ ...p, category: e.target.value }))}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-dark-200 dark:border-dark-600
                bg-white dark:bg-dark-800 text-dark-900 dark:text-dark-100
                outline-none transition-all text-sm"
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
                            className="flex-1 px-4 py-2.5 rounded-xl border border-dark-200 dark:border-dark-600
                bg-white dark:bg-dark-800 text-dark-900 dark:text-dark-100
                outline-none transition-all text-sm"
                        />
                        <button
                            type="submit"
                            disabled={formLoading}
                            className="px-6 py-2.5 rounded-xl gradient-primary text-white text-sm font-semibold
                hover:shadow-lg hover:shadow-primary-500/30 transition-all
                disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {formLoading ? 'Saving...' : 'Save'}
                        </button>
                    </form>
                </div>
            )}

            {/* Budget Progress Bars */}
            <div className="space-y-3">
                {loading ? (
                    <div className="flex justify-center py-16">
                        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : budgetStatus.length === 0 ? (
                    <div className="glass-card p-12 text-center">
                        <p className="text-4xl mb-3">📊</p>
                        <p className="text-dark-500 dark:text-dark-400 font-medium">No budgets set for this month</p>
                        <p className="text-dark-400 dark:text-dark-500 text-sm mt-1">Click "Set Budget" to add spending limits</p>
                    </div>
                ) : (
                    budgetStatus.map((b, i) => (
                        <div key={b.category} className="relative group animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
                            <BudgetBar category={b.category} limit={b.limit} spent={b.spent} />
                            <button
                                onClick={() => handleDeleteBudget(b.category)}
                                className="absolute top-3 right-3 p-1.5 rounded-lg opacity-0 group-hover:opacity-100
                  hover:bg-danger-50 dark:hover:bg-danger-500/10 transition-all"
                            >
                                <HiOutlineTrash className="w-4 h-4 text-danger-400" />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Budget;

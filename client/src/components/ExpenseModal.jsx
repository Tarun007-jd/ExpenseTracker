import { useState, useEffect } from 'react';
import { HiOutlineX } from 'react-icons/hi';

const CATEGORIES = ['Food', 'Travel', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Education', 'Other'];

const ExpenseModal = ({ isOpen, onClose, onSubmit, expense = null }) => {
    const [formData, setFormData] = useState({
        amount: '',
        category: 'Food',
        description: '',
        date: new Date().toISOString().split('T')[0]
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (expense) {
            setFormData({
                amount: expense.amount.toString(),
                category: expense.category,
                description: expense.description || '',
                date: new Date(expense.date).toISOString().split('T')[0]
            });
        } else {
            setFormData({
                amount: '',
                category: 'Food',
                description: '',
                date: new Date().toISOString().split('T')[0]
            });
        }
    }, [expense, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit({
                ...formData,
                amount: parseFloat(formData.amount)
            });
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md glass-card p-6 animate-scale-in">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-dark-900 dark:text-dark-100">
                        {expense ? 'Edit Expense' : 'Add New Expense'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors"
                    >
                        <HiOutlineX className="w-5 h-5 text-dark-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Amount */}
                    <div>
                        <label className="block text-sm font-medium text-dark-600 dark:text-dark-400 mb-1.5">Amount (₹)</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            required
                            value={formData.amount}
                            onChange={(e) => setFormData(p => ({ ...p, amount: e.target.value }))}
                            placeholder="0.00"
                            className="w-full px-4 py-2.5 rounded-xl border border-dark-200 dark:border-dark-600
                bg-white dark:bg-dark-800 text-dark-900 dark:text-dark-100
                focus:ring-2 focus:ring-primary-500 focus:border-transparent
                outline-none transition-all text-lg font-semibold"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-dark-600 dark:text-dark-400 mb-1.5">Category</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData(p => ({ ...p, category: e.target.value }))}
                            className="w-full px-4 py-2.5 rounded-xl border border-dark-200 dark:border-dark-600
                bg-white dark:bg-dark-800 text-dark-900 dark:text-dark-100
                focus:ring-2 focus:ring-primary-500 focus:border-transparent
                outline-none transition-all"
                        >
                            {CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {/* Date */}
                    <div>
                        <label className="block text-sm font-medium text-dark-600 dark:text-dark-400 mb-1.5">Date</label>
                        <input
                            type="date"
                            required
                            value={formData.date}
                            onChange={(e) => setFormData(p => ({ ...p, date: e.target.value }))}
                            className="w-full px-4 py-2.5 rounded-xl border border-dark-200 dark:border-dark-600
                bg-white dark:bg-dark-800 text-dark-900 dark:text-dark-100
                focus:ring-2 focus:ring-primary-500 focus:border-transparent
                outline-none transition-all"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-dark-600 dark:text-dark-400 mb-1.5">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                            placeholder="What was this expense for?"
                            rows={2}
                            className="w-full px-4 py-2.5 rounded-xl border border-dark-200 dark:border-dark-600
                bg-white dark:bg-dark-800 text-dark-900 dark:text-dark-100
                focus:ring-2 focus:ring-primary-500 focus:border-transparent
                outline-none transition-all resize-none"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-xl gradient-primary text-white font-semibold text-sm
              hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300
              disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Saving...' : expense ? 'Update Expense' : 'Add Expense'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ExpenseModal;

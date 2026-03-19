import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import ExpenseModal from '../components/ExpenseModal';
import { HiOutlinePlus, HiOutlineSearch, HiOutlinePencil, HiOutlineTrash, HiOutlineDownload, HiOutlineFilter } from 'react-icons/hi';
import toast from 'react-hot-toast';

const CATEGORIES = ['All', 'Food', 'Travel', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Education', 'Other'];

const getCategoryEmoji = (cat) => {
    const map = { Food: '🍕', Travel: '✈️', Shopping: '🛍️', Bills: '📄', Entertainment: '🎬', Health: '💊', Education: '📚', Other: '📦' };
    return map[cat] || '📦';
};

const Expenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const fetchExpenses = useCallback(async () => {
        try {
            const params = {};
            if (search) params.search = search;
            if (category !== 'All') params.category = category;
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;
            const res = await api.get('/expenses', { params });
            setExpenses(res.data.expenses);
            setTotal(res.data.total);
        } catch (err) {
            toast.error('Failed to fetch expenses');
        } finally {
            setLoading(false);
        }
    }, [search, category, startDate, endDate]);

    useEffect(() => {
        const debounce = setTimeout(fetchExpenses, 300);
        return () => clearTimeout(debounce);
    }, [fetchExpenses]);

    const handleAddExpense = async (data) => {
        await api.post('/expenses', data);
        toast.success('Expense added!');
        fetchExpenses();
    };

    const handleEditExpense = async (data) => {
        await api.put(`/expenses/${editingExpense._id}`, data);
        toast.success('Expense updated!');
        setEditingExpense(null);
        fetchExpenses();
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this expense?')) return;
        try {
            await api.delete(`/expenses/${id}`);
            toast.success('Expense deleted');
            fetchExpenses();
        } catch {
            toast.error('Failed to delete');
        }
    };

    const handleExportCSV = async () => {
        try {
            const res = await api.get('/expenses/export', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'expenses.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success('CSV exported!');
        } catch {
            toast.error('Export failed');
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-dark-900 dark:text-dark-50">Expenses</h2>
                    <p className="text-sm text-dark-400 dark:text-dark-500 mt-1">{total} total expenses recorded</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleExportCSV}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
              border border-dark-200 dark:border-dark-600 text-dark-600 dark:text-dark-300
              hover:bg-dark-100 dark:hover:bg-dark-800 transition-all"
                    >
                        <HiOutlineDownload className="w-4 h-4" /> Export
                    </button>
                    <button
                        onClick={() => { setEditingExpense(null); setModalOpen(true); }}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
              gradient-primary text-white hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300"
                    >
                        <HiOutlinePlus className="w-4 h-4" /> Add Expense
                    </button>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="glass-card p-4 space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search expenses..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-dark-200 dark:border-dark-600
                bg-white dark:bg-dark-800 text-dark-900 dark:text-dark-100
                focus:ring-2 focus:ring-primary-500 focus:border-transparent
                outline-none transition-all text-sm"
                        />
                    </div>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="px-4 py-2.5 rounded-xl border border-dark-200 dark:border-dark-600
              bg-white dark:bg-dark-800 text-dark-900 dark:text-dark-100
              focus:ring-2 focus:ring-primary-500 focus:border-transparent
              outline-none transition-all text-sm"
                    >
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
                        ))}
                    </select>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
              border transition-all ${showFilters
                                ? 'border-primary-500 text-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                : 'border-dark-200 dark:border-dark-600 text-dark-500 hover:bg-dark-100 dark:hover:bg-dark-800'}`}
                    >
                        <HiOutlineFilter className="w-4 h-4" /> Dates
                    </button>
                </div>

                {showFilters && (
                    <div className="flex flex-col sm:flex-row gap-3 pt-2 animate-slide-up">
                        <div className="flex-1">
                            <label className="block text-xs font-medium text-dark-500 mb-1">From</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-4 py-2 rounded-xl border border-dark-200 dark:border-dark-600
                  bg-white dark:bg-dark-800 text-dark-900 dark:text-dark-100
                  outline-none transition-all text-sm"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-medium text-dark-500 mb-1">To</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full px-4 py-2 rounded-xl border border-dark-200 dark:border-dark-600
                  bg-white dark:bg-dark-800 text-dark-900 dark:text-dark-100
                  outline-none transition-all text-sm"
                            />
                        </div>
                        <button
                            onClick={() => { setStartDate(''); setEndDate(''); }}
                            className="self-end px-4 py-2 rounded-xl text-xs text-dark-400 hover:text-danger-500 transition-colors"
                        >
                            Clear dates
                        </button>
                    </div>
                )}
            </div>

            {/* Expenses List */}
            <div className="space-y-2">
                {loading ? (
                    <div className="flex justify-center py-16">
                        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : expenses.length === 0 ? (
                    <div className="glass-card p-12 text-center">
                        <p className="text-4xl mb-3">💸</p>
                        <p className="text-dark-500 dark:text-dark-400 font-medium">No expenses found</p>
                        <p className="text-dark-400 dark:text-dark-500 text-sm mt-1">Try adjusting your filters or add a new expense</p>
                    </div>
                ) : (
                    expenses.map((exp, i) => (
                        <div
                            key={exp._id}
                            className="glass-card p-4 flex items-center justify-between animate-slide-up"
                            style={{ animationDelay: `${i * 50}ms` }}
                        >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center shrink-0">
                                    <span className="text-lg">{getCategoryEmoji(exp.category)}</span>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-semibold text-dark-800 dark:text-dark-200">{exp.category}</p>
                                        <span className="px-2 py-0.5 rounded-md bg-dark-100 dark:bg-dark-700 text-[10px] font-medium text-dark-500">
                                            {new Date(exp.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-xs text-dark-400 truncate">{exp.description || 'No description'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 ml-4">
                                <span className="text-base font-bold text-dark-900 dark:text-dark-100 whitespace-nowrap">
                                    ₹{exp.amount.toLocaleString()}
                                </span>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => { setEditingExpense(exp); setModalOpen(true); }}
                                        className="p-2 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors"
                                    >
                                        <HiOutlinePencil className="w-4 h-4 text-dark-400 hover:text-primary-500" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(exp._id)}
                                        className="p-2 rounded-lg hover:bg-danger-50 dark:hover:bg-danger-500/10 transition-colors"
                                    >
                                        <HiOutlineTrash className="w-4 h-4 text-dark-400 hover:text-danger-500" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            <ExpenseModal
                isOpen={modalOpen}
                onClose={() => { setModalOpen(false); setEditingExpense(null); }}
                onSubmit={editingExpense ? handleEditExpense : handleAddExpense}
                expense={editingExpense}
            />
        </div>
    );
};

export default Expenses;

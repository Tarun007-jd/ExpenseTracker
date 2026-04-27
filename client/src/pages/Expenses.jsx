import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import ExpenseModal from '../components/ExpenseModal';
import { HiOutlinePlus, HiOutlineSearch, HiOutlinePencil, HiOutlineTrash, HiOutlineDownload, HiOutlineFilter } from 'react-icons/hi';
import toast from 'react-hot-toast';

const CATEGORIES = ['All', 'Food', 'Travel', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Education', 'Other'];

const getCategoryEmoji = (cat) => {
    const map = { Food: '🍕', Travel: '✈️', Shopping: '🛍️', Bills: '📄', Entertainment: '🎬', Health: '💊', Education: '📚', Other: '📦' };
    return map[cat] || '📦';
};

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.05 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
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
        if (!window.confirm('Delete this expense?')) return;
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
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-6"
        >
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">Expenses</h2>
                    <p className="text-base text-slate-500 font-medium mt-2">{total} total expenses recorded</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleExportCSV}
                        className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold
              bg-white text-primary-600 border border-primary-100 shadow-sm
              hover:bg-primary-50 transition-all"
                    >
                        <HiOutlineDownload className="w-5 h-5" /> Export
                    </button>
                    <button
                        onClick={() => { setEditingExpense(null); setModalOpen(true); }}
                        className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold
              bg-primary-500 text-white hover:bg-primary-600 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 shadow-primary-500/30"
                    >
                        <HiOutlinePlus className="w-5 h-5 text-white" /> Add Expense
                    </button>
                </div>
            </motion.div>

            {/* Search and Filters */}
            <motion.div variants={itemVariants} className="glass-card p-5 space-y-4 shadow-sm bg-white/80 backdrop-blur-xl">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search expenses..."
                            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200
                bg-slate-50 text-slate-900 font-medium
                focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white
                outline-none transition-all text-sm"
                        />
                    </div>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="px-5 py-3 rounded-2xl border border-slate-200 font-medium
              bg-slate-50 text-slate-900
              focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white
              outline-none transition-all text-sm appearance-none"
                    >
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
                        ))}
                    </select>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold
              border transition-all ${showFilters
                                ? 'border-primary-500 text-primary-600 bg-primary-50'
                                : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                        <HiOutlineFilter className="w-5 h-5" /> Dates
                    </button>
                </div>

                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="flex flex-col sm:flex-row gap-4 pt-3"
                    >
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">From</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-medium
                  bg-slate-50 text-slate-900
                  focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">To</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-medium
                  bg-slate-50 text-slate-900
                  focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm"
                            />
                        </div>
                        <button
                            onClick={() => { setStartDate(''); setEndDate(''); }}
                            className="self-end px-4 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:text-danger-600 hover:bg-danger-50 transition-colors"
                        >
                            Clear dates
                        </button>
                    </motion.div>
                )}
            </motion.div>

            {/* Expenses List */}
            <motion.div variants={containerVariants} className="space-y-3">
                {loading ? (
                    <div className="flex justify-center py-16">
                        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : expenses.length === 0 ? (
                    <motion.div variants={itemVariants} className="glass-card p-16 text-center shadow-sm bg-white/80">
                        <p className="text-5xl mb-4">💸</p>
                        <p className="text-slate-500 font-bold text-lg">No expenses found</p>
                        <p className="text-slate-400 font-medium text-sm mt-2">Try adjusting your filters or add a new expense</p>
                    </motion.div>
                ) : (
                    expenses.map((exp) => (
                        <motion.div
                            key={exp._id}
                            variants={itemVariants}
                            whileHover={{ scale: 1.01, x: 5 }}
                            className="glass-card p-5 flex items-center justify-between bg-white/90 backdrop-blur-xl shadow-sm border border-transparent hover:border-primary-100 transition-colors"
                        >
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center shrink-0 shadow-inner">
                                    <span className="text-xl">{getCategoryEmoji(exp.category)}</span>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-3">
                                        <p className="text-base font-bold text-slate-900">{exp.category}</p>
                                        <span className="px-2.5 py-1 rounded-md bg-slate-100 text-xs font-bold text-slate-500">
                                            {new Date(exp.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium text-slate-500 truncate mt-1">{exp.description || 'No description'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 ml-4">
                                <span className="text-lg font-black text-slate-900 whitespace-nowrap">
                                    ₹{exp.amount.toLocaleString()}
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => { setEditingExpense(exp); setModalOpen(true); }}
                                        className="p-2.5 rounded-xl hover:bg-primary-50 text-slate-400 hover:text-primary-600 transition-colors"
                                    >
                                        <HiOutlinePencil className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(exp._id)}
                                        className="p-2.5 rounded-xl hover:bg-danger-50 text-slate-400 hover:text-danger-600 transition-colors"
                                    >
                                        <HiOutlineTrash className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </motion.div>

            {/* Modal */}
            <ExpenseModal
                isOpen={modalOpen}
                onClose={() => { setModalOpen(false); setEditingExpense(null); }}
                onSubmit={editingExpense ? handleEditExpense : handleAddExpense}
                expense={editingExpense}
            />
        </motion.div>
    );
};

export default Expenses;

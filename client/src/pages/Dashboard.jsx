import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import StatCard from '../components/StatCard';
import { HiOutlineCash, HiOutlineCalendar, HiOutlineTrendingUp, HiOutlineChartBar } from 'react-icons/hi';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#a855f7', '#9333ea', '#7e22ce', '#6b21a8', '#c084fc', '#d8b4fe', '#f3e8ff', '#581c87'];

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

const Dashboard = () => {
    const [analytics, setAnalytics] = useState(null);
    const [recentExpenses, setRecentExpenses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [analyticsRes, expensesRes] = await Promise.all([
                    api.get('/expenses/analytics'),
                    api.get('/expenses?limit=5')
                ]);
                setAnalytics(analyticsRes.data);
                setRecentExpenses(expensesRes.data.expenses);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const monthlyData = analytics?.monthlySpending?.map(m => ({
        name: new Date(m.month + '-01').toLocaleDateString('en', { month: 'short', year: '2-digit' }),
        amount: m.total
    })) || [];

    const categoryData = analytics?.categoryBreakdown?.map(c => ({
        name: c._id,
        value: c.total
    })) || [];

    const topCategory = analytics?.categoryBreakdown?.[0]?._id || '-';

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="glass-card p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] !rounded-xl text-sm border-none bg-white/90 backdrop-blur-md">
                    <p className="font-extrabold text-slate-800">{label}</p>
                    <p className="text-primary-600 font-black text-lg">₹{payload[0].value.toLocaleString()}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-8"
        >
            <motion.div variants={itemVariants}>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Dashboard</h2>
                <p className="text-base text-slate-500 mt-2 font-medium">An overview of your financial activity</p>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={HiOutlineCash}
                    label="Total Expenses"
                    value={`₹${(analytics?.totalAmount || 0).toLocaleString()}`}
                    color="primary"
                />
                <StatCard
                    icon={HiOutlineCalendar}
                    label="This Month"
                    value={`₹${(analytics?.thisMonth || 0).toLocaleString()}`}
                    color="primary"
                />
                <StatCard
                    icon={HiOutlineTrendingUp}
                    label="Avg per Expense"
                    value={`₹${Math.round(analytics?.avgAmount || 0).toLocaleString()}`}
                    color="primary"
                />
                <StatCard
                    icon={HiOutlineChartBar}
                    label="Top Category"
                    value={topCategory}
                    color="primary"
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Monthly Spending Chart */}
                <motion.div variants={itemVariants} className="lg:col-span-2 glass-card p-6 shadow-sm bg-white/80 backdrop-blur-xl">
                    <h3 className="text-lg font-extrabold text-slate-800 mb-6 tracking-tight">Monthly Spending</h3>
                    <div className="h-80">
                        {monthlyData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={monthlyData}>
                                    <defs>
                                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                    <XAxis dataKey="name" tick={{ fontSize: 12, fontWeight: 600 }} stroke="#94a3b8" axisLine={false} tickLine={false} dy={10} />
                                    <YAxis tick={{ fontSize: 12, fontWeight: 600 }} stroke="#94a3b8" axisLine={false} tickLine={false} dx={-10} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area
                                        type="monotone" dataKey="amount" stroke="#9333ea" strokeWidth={4}
                                        fill="url(#colorAmount)" animationDuration={1500}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-400 font-medium">
                                No spending data yet. Add your first expense!
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Category Pie Chart */}
                <motion.div variants={itemVariants} className="glass-card p-6 shadow-sm bg-white/80 backdrop-blur-xl">
                    <h3 className="text-lg font-extrabold text-slate-800 mb-6 tracking-tight">By Category</h3>
                    <div className="h-80">
                        {categoryData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData} cx="50%" cy="50%" outerRadius={100} innerRadius={60}
                                        paddingAngle={5} dataKey="value" animationDuration={1000} stroke="none"
                                    >
                                        {categoryData.map((_, i) => (
                                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Legend
                                        verticalAlign="bottom" iconType="circle" iconSize={10}
                                        formatter={(value) => <span className="text-sm font-semibold text-slate-600">{value}</span>}
                                    />
                                    <Tooltip
                                        formatter={(v) => [`₹${v.toLocaleString()}`, 'Amount']}
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', fontWeight: 'bold' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-400 font-medium">
                                No data yet
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Recent Expenses */}
            <motion.div variants={itemVariants} className="glass-card p-6 shadow-sm bg-white/80 backdrop-blur-xl">
                <h3 className="text-lg font-extrabold text-slate-800 mb-6 tracking-tight">Recent Expenses</h3>
                {recentExpenses.length > 0 ? (
                    <motion.div variants={containerVariants} className="space-y-3">
                        {recentExpenses.map(exp => (
                            <motion.div
                                variants={itemVariants}
                                whileHover={{ scale: 1.01, x: 5 }}
                                key={exp._id}
                                className="flex items-center justify-between p-4 rounded-2xl
                  hover:bg-primary-50/50 transition-colors cursor-default border border-transparent hover:border-primary-100"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center shadow-inner">
                                        <span className="text-xl">{getCategoryEmoji(exp.category)}</span>
                                    </div>
                                    <div>
                                        <p className="text-base font-bold text-slate-800">{exp.category}</p>
                                        <p className="text-sm text-slate-500 font-medium">{exp.description || 'No description'}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-black text-slate-900">₹{exp.amount.toLocaleString()}</p>
                                    <p className="text-sm text-slate-400 font-medium">{new Date(exp.date).toLocaleDateString()}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <p className="text-center text-slate-400 font-medium py-8">No expenses recorded yet</p>
                )}
            </motion.div>
        </motion.div>
    );
};

const getCategoryEmoji = (cat) => {
    const map = { Food: '🍕', Travel: '✈️', Shopping: '🛍️', Bills: '📄', Entertainment: '🎬', Health: '💊', Education: '📚', Other: '📦' };
    return map[cat] || '📦';
};

export default Dashboard;

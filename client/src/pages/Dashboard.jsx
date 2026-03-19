import { useState, useEffect } from 'react';
import api from '../api/axios';
import StatCard from '../components/StatCard';
import { HiOutlineCash, HiOutlineCalendar, HiOutlineTrendingUp, HiOutlineChartBar } from 'react-icons/hi';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#64748b'];

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
                <div className="glass-card p-3 shadow-lg !rounded-lg text-sm">
                    <p className="font-semibold text-dark-800 dark:text-dark-200">{label}</p>
                    <p className="text-primary-500 font-bold">₹{payload[0].value.toLocaleString()}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h2 className="text-2xl font-bold text-dark-900 dark:text-dark-50">Dashboard</h2>
                <p className="text-sm text-dark-400 dark:text-dark-500 mt-1">An overview of your financial activity</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={HiOutlineCash}
                    label="Total Expenses"
                    value={`₹${(analytics?.totalAmount || 0).toLocaleString()}`}
                    color="primary"
                    delay={0}
                />
                <StatCard
                    icon={HiOutlineCalendar}
                    label="This Month"
                    value={`₹${(analytics?.thisMonth || 0).toLocaleString()}`}
                    color="accent"
                    delay={100}
                />
                <StatCard
                    icon={HiOutlineTrendingUp}
                    label="Avg per Expense"
                    value={`₹${Math.round(analytics?.avgAmount || 0).toLocaleString()}`}
                    color="warning"
                    delay={200}
                />
                <StatCard
                    icon={HiOutlineChartBar}
                    label="Top Category"
                    value={topCategory}
                    color="danger"
                    delay={300}
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Monthly Spending Chart */}
                <div className="lg:col-span-2 glass-card p-5">
                    <h3 className="text-base font-bold text-dark-800 dark:text-dark-200 mb-4">Monthly Spending</h3>
                    <div className="h-72">
                        {monthlyData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={monthlyData}>
                                    <defs>
                                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                                    <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                                    <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area
                                        type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={2.5}
                                        fill="url(#colorAmount)" animationDuration={1500}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-dark-400 text-sm">
                                No spending data yet. Add your first expense!
                            </div>
                        )}
                    </div>
                </div>

                {/* Category Pie Chart */}
                <div className="glass-card p-5">
                    <h3 className="text-base font-bold text-dark-800 dark:text-dark-200 mb-4">By Category</h3>
                    <div className="h-72">
                        {categoryData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData} cx="50%" cy="45%" outerRadius={80} innerRadius={40}
                                        paddingAngle={3} dataKey="value" animationDuration={1000}
                                    >
                                        {categoryData.map((_, i) => (
                                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Legend
                                        verticalAlign="bottom" iconType="circle" iconSize={8}
                                        formatter={(value) => <span className="text-xs text-dark-500 dark:text-dark-400">{value}</span>}
                                    />
                                    <Tooltip
                                        formatter={(v) => [`₹${v.toLocaleString()}`, 'Amount']}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-dark-400 text-sm">
                                No data yet
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Expenses */}
            <div className="glass-card p-5">
                <h3 className="text-base font-bold text-dark-800 dark:text-dark-200 mb-4">Recent Expenses</h3>
                {recentExpenses.length > 0 ? (
                    <div className="space-y-2">
                        {recentExpenses.map(exp => (
                            <div
                                key={exp._id}
                                className="flex items-center justify-between p-3 rounded-xl
                  hover:bg-dark-50 dark:hover:bg-dark-800/50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                                        <span className="text-sm">{getCategoryEmoji(exp.category)}</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-dark-800 dark:text-dark-200">{exp.category}</p>
                                        <p className="text-xs text-dark-400">{exp.description || 'No description'}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-dark-900 dark:text-dark-100">₹{exp.amount.toLocaleString()}</p>
                                    <p className="text-xs text-dark-400">{new Date(exp.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-dark-400 text-sm py-8">No expenses recorded yet</p>
                )}
            </div>
        </div>
    );
};

const getCategoryEmoji = (cat) => {
    const map = { Food: '🍕', Travel: '✈️', Shopping: '🛍️', Bills: '📄', Entertainment: '🎬', Health: '💊', Education: '📚', Other: '📦' };
    return map[cat] || '📦';
};

export default Dashboard;

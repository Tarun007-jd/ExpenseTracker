import { useState, useEffect } from 'react';
import api from '../api/axios';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
    AreaChart, Area, XAxis, YAxis, CartesianGrid, BarChart, Bar
} from 'recharts';
import { HiOutlineTrendingUp, HiOutlineTrendingDown, HiOutlineEmojiHappy } from 'react-icons/hi';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#64748b'];

const Analytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await api.get('/expenses/analytics');
                setData(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const categoryData = data?.categoryBreakdown?.map(c => ({
        name: c._id,
        value: c.total,
        count: c.count
    })) || [];

    const monthlyData = data?.monthlySpending?.map(m => ({
        name: new Date(m.month + '-01').toLocaleDateString('en', { month: 'short', year: '2-digit' }),
        amount: m.total,
        count: m.count
    })) || [];

    const topCategory = categoryData[0];
    const monthlyAvg = monthlyData.length > 0
        ? Math.round(monthlyData.reduce((sum, m) => sum + m.amount, 0) / monthlyData.length)
        : 0;

    const lastTwo = monthlyData.slice(-2);
    const trendDirection = lastTwo.length === 2
        ? (lastTwo[1].amount >= lastTwo[0].amount ? 'up' : 'down')
        : 'neutral';

    const dailyAvg = data?.thisMonth && new Date().getDate()
        ? Math.round(data.thisMonth / new Date().getDate())
        : 0;

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h2 className="text-2xl font-bold text-dark-900 dark:text-dark-50">Analytics</h2>
                <p className="text-sm text-dark-400 dark:text-dark-500 mt-1">Insights into your spending patterns</p>
            </div>

            {/* Insight Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="glass-card p-5 animate-slide-up" style={{ animationDelay: '0ms' }}>
                    <div className="flex items-center gap-3 mb-2">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${trendDirection === 'up' ? 'bg-danger-100 dark:bg-danger-900/30' : 'bg-accent-100 dark:bg-accent-900/30'
                            }`}>
                            {trendDirection === 'up'
                                ? <HiOutlineTrendingUp className="w-5 h-5 text-danger-500" />
                                : <HiOutlineTrendingDown className="w-5 h-5 text-accent-500" />}
                        </div>
                        <span className="text-sm font-medium text-dark-500 dark:text-dark-400">Spending Trend</span>
                    </div>
                    <p className="text-xl font-bold text-dark-900 dark:text-dark-100">
                        {trendDirection === 'up' ? 'Increasing' : trendDirection === 'down' ? 'Decreasing' : 'Stable'}
                    </p>
                    <p className="text-xs text-dark-400 mt-1">vs last month</p>
                </div>

                <div className="glass-card p-5 animate-slide-up" style={{ animationDelay: '100ms' }}>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                            <HiOutlineEmojiHappy className="w-5 h-5 text-primary-500" />
                        </div>
                        <span className="text-sm font-medium text-dark-500 dark:text-dark-400">Daily Average</span>
                    </div>
                    <p className="text-xl font-bold text-dark-900 dark:text-dark-100">₹{dailyAvg.toLocaleString()}</p>
                    <p className="text-xs text-dark-400 mt-1">this month</p>
                </div>

                <div className="glass-card p-5 animate-slide-up" style={{ animationDelay: '200ms' }}>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 rounded-xl bg-warning-100 dark:bg-warning-500/20 flex items-center justify-center">
                            <span className="text-lg">{topCategory ? getCategoryEmoji(topCategory.name) : '📦'}</span>
                        </div>
                        <span className="text-sm font-medium text-dark-500 dark:text-dark-400">Biggest Category</span>
                    </div>
                    <p className="text-xl font-bold text-dark-900 dark:text-dark-100">{topCategory?.name || '-'}</p>
                    <p className="text-xs text-dark-400 mt-1">₹{(topCategory?.value || 0).toLocaleString()}</p>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Category Pie Chart */}
                <div className="glass-card p-5">
                    <h3 className="text-base font-bold text-dark-800 dark:text-dark-200 mb-4">Category Distribution</h3>
                    <div className="h-80">
                        {categoryData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData} cx="50%" cy="45%" outerRadius={100} innerRadius={50}
                                        paddingAngle={3} dataKey="value" animationDuration={1200}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        labelLine={false}
                                    >
                                        {categoryData.map((_, i) => (
                                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(v) => [`₹${v.toLocaleString()}`, 'Spent']}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                                    />
                                    <Legend iconType="circle" iconSize={8}
                                        formatter={(value) => <span className="text-xs text-dark-500 dark:text-dark-400">{value}</span>}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-dark-400 text-sm">No data yet</div>
                        )}
                    </div>
                </div>

                {/* Monthly Trend */}
                <div className="glass-card p-5">
                    <h3 className="text-base font-bold text-dark-800 dark:text-dark-200 mb-4">Monthly Spending Trend</h3>
                    <div className="h-80">
                        {monthlyData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={monthlyData}>
                                    <defs>
                                        <linearGradient id="gradAnalytics" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                                    <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                                    <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                                    <Tooltip
                                        formatter={(v) => [`₹${v.toLocaleString()}`, 'Total']}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                                    />
                                    <Area type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={2.5}
                                        fill="url(#gradAnalytics)" animationDuration={1500} />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-dark-400 text-sm">No data yet</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Category Breakdown Bar Chart */}
            <div className="glass-card p-5">
                <h3 className="text-base font-bold text-dark-800 dark:text-dark-200 mb-4">Category Breakdown</h3>
                <div className="h-64">
                    {categoryData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={categoryData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                                <Tooltip
                                    formatter={(v) => [`₹${v.toLocaleString()}`, 'Spent']}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="value" radius={[6, 6, 0, 0]} animationDuration={1200}>
                                    {categoryData.map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full text-dark-400 text-sm">No data yet</div>
                    )}
                </div>
            </div>

            {/* Monthly Average */}
            <div className="glass-card p-5">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-base font-bold text-dark-800 dark:text-dark-200">Monthly Average</h3>
                        <p className="text-sm text-dark-400 mt-1">Based on the last {monthlyData.length} months</p>
                    </div>
                    <div className="text-right">
                        <p className="text-3xl font-bold text-gradient">₹{monthlyAvg.toLocaleString()}</p>
                        <p className="text-xs text-dark-400 mt-1">per month</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const getCategoryEmoji = (cat) => {
    const map = { Food: '🍕', Travel: '✈️', Shopping: '🛍️', Bills: '📄', Entertainment: '🎬', Health: '💊', Education: '📚', Other: '📦' };
    return map[cat] || '📦';
};

export default Analytics;

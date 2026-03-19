const StatCard = ({ icon: Icon, label, value, trend, trendUp, color = 'primary', delay = 0 }) => {
    const colorMap = {
        primary: 'from-primary-500 to-primary-700 shadow-primary-500/20',
        accent: 'from-accent-400 to-accent-600 shadow-accent-500/20',
        danger: 'from-danger-400 to-danger-600 shadow-danger-500/20',
        warning: 'from-warning-400 to-warning-500 shadow-warning-500/20',
    };

    return (
        <div
            className="glass-card p-5 animate-slide-up"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="flex items-start justify-between mb-3">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${colorMap[color]} shadow-lg flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                </div>
                {trend !== undefined && (
                    <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${trendUp
                            ? 'text-accent-600 bg-accent-500/10 dark:text-accent-400'
                            : 'text-danger-500 bg-danger-500/10 dark:text-danger-400'
                        }`}>
                        {trendUp ? '↑' : '↓'} {trend}%
                    </span>
                )}
            </div>
            <p className="text-2xl font-bold text-dark-900 dark:text-dark-50 tracking-tight">{value}</p>
            <p className="text-sm text-dark-400 dark:text-dark-500 mt-1 font-medium">{label}</p>
        </div>
    );
};

export default StatCard;

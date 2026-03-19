const BudgetBar = ({ category, limit, spent }) => {
    const percentage = limit > 0 ? Math.min(Math.round((spent / limit) * 100), 100) : 0;
    const overspent = spent > limit;
    const remaining = limit - spent;

    let barColor = 'bg-gradient-to-r from-accent-400 to-accent-500';
    if (percentage >= 90) barColor = 'bg-gradient-to-r from-danger-400 to-danger-500';
    else if (percentage >= 70) barColor = 'bg-gradient-to-r from-warning-400 to-warning-500';

    return (
        <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-dark-800 dark:text-dark-200">{category}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${overspent
                        ? 'text-danger-600 bg-danger-500/10 dark:text-danger-400'
                        : 'text-accent-600 bg-accent-500/10 dark:text-accent-400'
                    }`}>
                    {overspent ? 'Over Budget!' : `₹${remaining.toLocaleString()} left`}
                </span>
            </div>
            <div className="w-full h-2.5 bg-dark-100 dark:bg-dark-700 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <div className="flex justify-between mt-1.5 text-xs text-dark-400 dark:text-dark-500">
                <span>₹{spent.toLocaleString()} spent</span>
                <span>₹{limit.toLocaleString()} limit</span>
            </div>
        </div>
    );
};

export default BudgetBar;

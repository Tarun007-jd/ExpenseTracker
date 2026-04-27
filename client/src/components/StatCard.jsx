import { motion } from 'framer-motion';

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const StatCard = ({ icon: Icon, label, value, trend, trendUp, color = 'primary' }) => {
    const colorMap = {
        primary: 'from-primary-500 to-primary-700 shadow-primary-500/30',
        accent: 'from-accent-400 to-accent-600 shadow-accent-500/30',
        danger: 'from-danger-400 to-danger-600 shadow-danger-500/30',
        warning: 'from-warning-400 to-warning-500 shadow-warning-500/30',
    };

    return (
        <motion.div
            variants={itemVariants}
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="glass-card p-6 border-transparent shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl bg-white/80"
        >
            <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${colorMap[color]} shadow-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                {trend !== undefined && (
                    <span className={`text-sm font-bold px-3 py-1 rounded-full ${trendUp
                            ? 'text-accent-600 bg-accent-500/15'
                            : 'text-danger-600 bg-danger-500/15'
                        }`}>
                        {trendUp ? '↑' : '↓'} {trend}%
                    </span>
                )}
            </div>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</p>
            <p className="text-sm text-slate-500 mt-1 font-semibold uppercase tracking-wider">{label}</p>
        </motion.div>
    );
};

export default StatCard;

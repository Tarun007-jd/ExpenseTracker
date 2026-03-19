const Expense = require('../models/Expense');

// GET /api/expenses
const getExpenses = async (req, res) => {
    try {
        const { category, startDate, endDate, search, sort, page = 1, limit = 50 } = req.query;
        const query = { user: req.user._id };

        if (category) query.category = category;
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }
        if (search) {
            query.description = { $regex: search, $options: 'i' };
        }

        const sortOption = sort === 'amount' ? { amount: -1 } : { date: -1 };
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [expenses, total] = await Promise.all([
            Expense.find(query).sort(sortOption).skip(skip).limit(parseInt(limit)),
            Expense.countDocuments(query)
        ]);

        res.json(200, { expenses, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
    } catch (error) {
        res.json(500, { message: error.message });
    }
};

// POST /api/expenses
const createExpense = async (req, res) => {
    try {
        const { amount, category, description, date } = req.body;

        if (!amount || !category) {
            return res.json(400, { message: 'Amount and category are required' });
        }

        const expense = await Expense.create({
            user: req.user._id,
            amount,
            category,
            description: description || '',
            date: date || Date.now()
        });

        res.json(201, { expense });
    } catch (error) {
        res.json(500, { message: error.message });
    }
};

// PUT /api/expenses/:id
const updateExpense = async (req, res) => {
    try {
        const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });
        if (!expense) {
            return res.json(404, { message: 'Expense not found' });
        }

        const { amount, category, description, date } = req.body;
        if (amount !== undefined) expense.amount = amount;
        if (category) expense.category = category;
        if (description !== undefined) expense.description = description;
        if (date) expense.date = date;

        await expense.save();
        res.json(200, { expense });
    } catch (error) {
        res.json(500, { message: error.message });
    }
};

// DELETE /api/expenses/:id
const deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!expense) {
            return res.json(404, { message: 'Expense not found' });
        }
        res.json(200, { message: 'Expense deleted' });
    } catch (error) {
        res.json(500, { message: error.message });
    }
};

// GET /api/expenses/analytics
const getAnalytics = async (req, res) => {
    try {
        const userId = req.user._id;

        // Category breakdown
        const categoryBreakdown = await Expense.aggregate([
            { $match: { user: userId } },
            { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
            { $sort: { total: -1 } }
        ]);

        // Monthly spending (last 12 months)
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

        const monthlySpending = await Expense.aggregate([
            { $match: { user: userId, date: { $gte: twelveMonthsAgo } } },
            {
                $group: {
                    _id: { year: { $year: '$date' }, month: { $month: '$date' } },
                    total: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        // Total stats
        const totalStats = await Expense.aggregate([
            { $match: { user: userId } },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$amount' },
                    avgAmount: { $avg: '$amount' },
                    count: { $sum: 1 }
                }
            }
        ]);

        // This month's spending
        const now = new Date();
        const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const thisMonthStats = await Expense.aggregate([
            { $match: { user: userId, date: { $gte: firstOfMonth } } },
            { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
        ]);

        res.json(200, {
            categoryBreakdown,
            monthlySpending: monthlySpending.map(m => ({
                month: `${m._id.year}-${String(m._id.month).padStart(2, '0')}`,
                total: m.total,
                count: m.count
            })),
            totalAmount: totalStats[0]?.totalAmount || 0,
            avgAmount: totalStats[0]?.avgAmount || 0,
            totalCount: totalStats[0]?.count || 0,
            thisMonth: thisMonthStats[0]?.total || 0,
            thisMonthCount: thisMonthStats[0]?.count || 0
        });
    } catch (error) {
        res.json(500, { message: error.message });
    }
};

// GET /api/expenses/export
const exportCSV = async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user._id }).sort({ date: -1 });

        let csv = 'Date,Category,Amount,Description\n';
        expenses.forEach(exp => {
            const date = new Date(exp.date).toISOString().split('T')[0];
            const desc = (exp.description || '').replace(/,/g, ';').replace(/"/g, '""');
            csv += `${date},${exp.category},${exp.amount},"${desc}"\n`;
        });

        res.writeHead(200, {
            'Content-Type': 'text/csv',
            'Content-Disposition': 'attachment; filename=expenses.csv',
            'Access-Control-Allow-Origin': '*'
        });
        res.end(csv);
    } catch (error) {
        res.json(500, { message: error.message });
    }
};

module.exports = {
    getExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
    getAnalytics,
    exportCSV
};

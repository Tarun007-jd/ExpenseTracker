const Budget = require('../models/Budget');
const Expense = require('../models/Expense');

// GET /api/budgets
const getBudgets = async (req, res) => {
    try {
        const { month } = req.query;
        const query = { user: req.user._id };
        if (month) query.month = month;

        const budgets = await Budget.find(query).sort({ category: 1 });
        res.json(200, { budgets });
    } catch (error) {
        res.json(500, { message: error.message });
    }
};

// POST /api/budgets
const setBudget = async (req, res) => {
    try {
        const { category, limit, month } = req.body;

        if (!category || limit === undefined || !month) {
            return res.json(400, { message: 'Category, limit, and month are required' });
        }

        const budget = await Budget.findOneAndUpdate(
            { user: req.user._id, category, month },
            { limit },
            { new: true, upsert: true, runValidators: true }
        );

        res.json(200, { budget });
    } catch (error) {
        res.json(500, { message: error.message });
    }
};

// DELETE /api/budgets/:id
const deleteBudget = async (req, res) => {
    try {
        const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!budget) {
            return res.json(404, { message: 'Budget not found' });
        }
        res.json(200, { message: 'Budget deleted' });
    } catch (error) {
        res.json(500, { message: error.message });
    }
};

// GET /api/budgets/status
const getBudgetStatus = async (req, res) => {
    try {
        const { month } = req.query;
        const currentMonth = month || `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;

        const budgets = await Budget.find({ user: req.user._id, month: currentMonth });

        if (budgets.length === 0) {
            return res.json(200, { status: [], month: currentMonth });
        }

        // Get spending per category for the month
        const [year, mon] = currentMonth.split('-').map(Number);
        const startDate = new Date(year, mon - 1, 1);
        const endDate = new Date(year, mon, 0, 23, 59, 59);

        const spending = await Expense.aggregate([
            { $match: { user: req.user._id, date: { $gte: startDate, $lte: endDate } } },
            { $group: { _id: '$category', spent: { $sum: '$amount' } } }
        ]);

        const spendingMap = {};
        spending.forEach(s => { spendingMap[s._id] = s.spent; });

        const status = budgets.map(b => ({
            category: b.category,
            limit: b.limit,
            spent: spendingMap[b.category] || 0,
            remaining: b.limit - (spendingMap[b.category] || 0),
            percentage: Math.round(((spendingMap[b.category] || 0) / b.limit) * 100),
            overspent: (spendingMap[b.category] || 0) > b.limit
        }));

        res.json(200, { status, month: currentMonth });
    } catch (error) {
        res.json(500, { message: error.message });
    }
};

module.exports = { getBudgets, setBudget, deleteBudget, getBudgetStatus };

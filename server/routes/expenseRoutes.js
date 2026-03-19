const auth = require('../middleware/auth');
const {
    getExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
    getAnalytics,
    exportCSV
} = require('../controllers/expenseController');

const registerExpenseRoutes = (router) => {
    router.get('/api/expenses/analytics', auth, getAnalytics);
    router.get('/api/expenses/export', auth, exportCSV);
    router.get('/api/expenses', auth, getExpenses);
    router.post('/api/expenses', auth, createExpense);
    router.put('/api/expenses/:id', auth, updateExpense);
    router.delete('/api/expenses/:id', auth, deleteExpense);
};

module.exports = registerExpenseRoutes;

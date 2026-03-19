const auth = require('../middleware/auth');
const {
    getBudgets,
    setBudget,
    deleteBudget,
    getBudgetStatus
} = require('../controllers/budgetController');

const registerBudgetRoutes = (router) => {
    router.get('/api/budgets/status', auth, getBudgetStatus);
    router.get('/api/budgets', auth, getBudgets);
    router.post('/api/budgets', auth, setBudget);
    router.delete('/api/budgets/:id', auth, deleteBudget);
};

module.exports = registerBudgetRoutes;

const router = require('express').Router();
const userRoutes = require('./users/user.route');
const linenRoutes = require('./linens/linen.route')
const transactionRoutes = require('./transaction/transaction.route')

router.use('/user', userRoutes);
router.use('/linen', linenRoutes);
router.use('/transaction', transactionRoutes);

module.exports = router;
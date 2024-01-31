const router = require('express').Router();
const userRoutes = require('./users/user.route');
const linenRoutes = require('./linens/linen.route')
const transactionRoutes = require('./transaction/transaction.route')
const adminRoutes = require('./admin/admin.route')
const reportRoutes = require('./report/report.route')

router.use('/user', userRoutes);
router.use('/linen', linenRoutes);
router.use('/transaction', transactionRoutes);
router.use('/admin',adminRoutes)
router.use('/report', reportRoutes)

module.exports = router;
const router = require('express').Router();
const adminRoutes = require('./admin/admin.route')

router.use('/user', userRoutes);
router.use('/linen', linenRoutes);
router.use('/transaction', transactionRoutes);
router.use('/admin',adminRoutes)

module.exports = router;
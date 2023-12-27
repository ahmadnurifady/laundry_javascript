const router = require('express').Router();
const userRoutes = require('./users/user.route');

router.use('/user', userRoutes);

module.exports = router;
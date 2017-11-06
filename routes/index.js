const router = require('express').Router();
const path = require('path');
const apiRoutes = require('./api');

// API Routes
router.use('/api', apiRoutes);

module.exports = router;

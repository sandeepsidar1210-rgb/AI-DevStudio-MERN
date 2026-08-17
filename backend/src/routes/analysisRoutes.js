const express = require('express');
const router = express.Router();
const { createAnalysis, getMyAnalyses } = require('../controllers/analysisController.js');
const { protect } = require('../middleware/authMiddleware.js');
const { checkAnalysisLimit } = require('../middleware/rateLimiter.js');


router.post('/', protect, checkAnalysisLimit ,createAnalysis);
router.get('/', protect, getMyAnalyses);

module.exports = router;
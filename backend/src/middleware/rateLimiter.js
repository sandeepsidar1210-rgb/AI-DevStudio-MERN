const User = require('../models/User');

const FREE_TIER_LIMIT = 3;

const checkAnalysisLimit = async (req, res, next) => {
  try {
    const user = req.user;

    if (user.tier === 'paid') {
      return next(); // paid users: no limit
    }

    const today = new Date().toDateString(); // se current timestamp banta hai // timestamp se time (hours, minutes, seconds) ko hata deta hai aur sirf date ka readable string deta hai
    const lastDate = user.lastAnalysisDate
      ? new Date(user.lastAnalysisDate).toDateString()
      : null;

    // Naya din hai to counter reset karo
    if (lastDate !== today) {
      user.analysesUsedToday = 0;
      user.lastAnalysisDate = new Date();
    }

    if (user.analysesUsedToday >= FREE_TIER_LIMIT) {
      return res.status(429).json({
        message: `Free tier limit reached (${FREE_TIER_LIMIT}/day). Upgrade to continue.`,
      });
    }

    user.analysesUsedToday += 1;
    await user.save();

    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { checkAnalysisLimit };
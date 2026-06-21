const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const c = require('../controllers/analyticsController');
router.use(auth);
router.get('/overview', c.overview);
router.get('/revenue', c.revenue);
router.get('/attendance-trends', c.attendanceTrends);
router.get('/member-growth', c.memberGrowth);
module.exports = router;

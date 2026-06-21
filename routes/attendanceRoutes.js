const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const c = require('../controllers/attendanceController');
router.use(auth);
router.post('/checkin', c.checkin);
router.post('/checkout', c.checkout);
router.get('/member/:id', c.byMember);
router.get('/today', c.today);
module.exports = router;

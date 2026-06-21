const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const c = require('../controllers/paymentController');
router.use(auth);
router.get('/', c.list);
router.post('/', c.create);
router.get('/member/:id', c.byMember);
module.exports = router;

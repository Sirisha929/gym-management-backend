const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const c = require('../controllers/notificationController');
router.use(auth);
router.get('/', c.list);
router.post('/', c.create);
router.put('/:id/read', c.markRead);
module.exports = router;

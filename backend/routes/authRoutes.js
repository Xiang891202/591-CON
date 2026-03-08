const express = require('express')
const { register, login } = require('../controllers/authController')
const router = express.Router()


// 測試用：GET /api/auth/test 確定路由正常運作
// router.get('/test', (req, res) => {
//   res.json({ message: 'Auth 路由正常運作' });
// });

// module.exports = router;

router.post('/register', register)
router.post('/login', login)

module.exports = router
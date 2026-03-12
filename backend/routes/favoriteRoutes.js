console.log('✅ favoriteRoutes 已載入');

const express = require('express');
const router = express.Router();
const {
  getFavorites,
  addFavorite,
  removeFavorite,
  checkFavorite,
} = require('../controllers/favoriteController');

// 假設您已有 protect 中間件用於驗證 JWT
const { protect } = require('../middlewares/authMiddleware');

// 所有收藏路由都需要登入
router.use(protect);

router.get('/', getFavorites);
router.post('/', addFavorite);
router.delete('/:productId', removeFavorite);
router.get('/check/:productId', checkFavorite);

router.get('/test', (req, res) => {
  res.json({ message: 'favoriteRoutes 工作正常' });
});

module.exports = router;
const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  getAdminProducts,
  updateProduct,
  deleteProduct,
  getPropertiesInBounds,
  // 若有新增商品，再加入 createProduct
} = require('../controllers/productController');
const { protect } = require('../middlewares/authMiddleware');
const { admin } = require('../middlewares/adminMiddleware');

// 公開路由
router.get('/', getProducts);
router.get('/map/properties', getPropertiesInBounds);
router.get('/:id', getProductById);

// 管理員路由（需登入且為管理員）
// router.get('/admin', protect, admin, getAdminProducts);          // 建議用不同路徑避免衝突
// router.put('/:id', protect, admin, updateProduct);
// router.delete('/:id', protect, admin, deleteProduct);
// router.post('/', protect, admin, createProduct); // 若需要

module.exports = router;
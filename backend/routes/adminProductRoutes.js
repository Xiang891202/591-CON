const express = require('express');
const router = express.Router();
const {
  getAdminProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  // 若有新增商品，再加入 createProduct
} = require('../controllers/productController');
const { protect } = require('../middlewares/authMiddleware');
const { admin } = require('../middlewares/adminMiddleware');

// 所有管理員路由都需要保護與管理員權限
router.use(protect, admin);

// 管理員商品列表
router.get('/', getAdminProducts);

//商品詳細頁
router.get('/:id', getProductById);

// 更新商品
router.put('/:id', updateProduct);

// 刪除商品
router.delete('/:id', deleteProduct);

// 若有新增商品，可加入 POST /
// router.post('/', createProduct);

module.exports = router;
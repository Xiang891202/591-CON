const asyncHandler = require('../middlewares/asyncHandler');
const favoriteService = require('../services/favoriteService');
const { successResponse } = require('../utils/responseHelper');

// @desc    取得當前用戶的收藏列表
// @route   GET /api/favorites
exports.getFavorites = asyncHandler(async (req, res) => {
  const favorites = await favoriteService.getUserFavorites(req.user.id);
  res.json(successResponse({ favorites }, '取得收藏列表成功'));
});

// @desc    新增收藏
// @route   POST /api/favorites
exports.addFavorite = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  if (!productId) {
    return res.status(400).json({ success: false, message: '請提供商品 ID' });
  }
  const favorite = await favoriteService.addFavorite(req.user.id, productId);
  res.status(201).json(successResponse({ favorite }, '收藏成功'));
});

// @desc    移除收藏 (使用 productId)
// @route   DELETE /api/favorites/:productId
exports.removeFavorite = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const result = await favoriteService.removeFavorite(req.user.id, productId);
  if (!result) {
    return res.status(404).json({ success: false, message: '收藏不存在' });
  }
  res.json(successResponse({ message: '已取消收藏' }));
});

// @desc    檢查某商品是否已被當前用戶收藏
// @route   GET /api/favorites/check/:productId
exports.checkFavorite = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const isFav = await favoriteService.isFavorited(req.user.id, productId);
  res.json(successResponse({ isFavorited: isFav }));
});
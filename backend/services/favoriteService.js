const Favorite = require('../models/Favorite');
const Product = require('../models/Product');

// 新增收藏
const addFavorite = async (userId, productId) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error('商品不存在');
  }
  return await Favorite.create({ user: userId, product: productId });
};

// 移除收藏 (依 userId 和 productId)
const removeFavorite = async (userId, productId) => {
  return await Favorite.findOneAndDelete({ user: userId, product: productId });
};

// 取得用戶的所有收藏 (populate 商品資訊)
const getUserFavorites = async (userId) => {
  return await Favorite.find({ user: userId }).populate('product');
};

// 檢查特定商品是否已被用戶收藏
const isFavorited = async (userId, productId) => {
  const favorite = await Favorite.findOne({ user: userId, product: productId });
  return !!favorite;
};

module.exports = {
  addFavorite,
  removeFavorite,
  getUserFavorites,
  isFavorited,
};
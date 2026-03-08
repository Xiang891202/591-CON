
const Product = require('../models/Product');


// 可擴充其他方法：getProductById, createProduct 等

exports.getAllProducts = async (filters = {}) => {
  const query = {};
  if (filters.category) query.category = filters.category;
  if (filters.keyword) query.name = { $regex: filters.keyword, $options: 'i' };
  // 新增價格範圍篩選範例
  if (filters.minPrice || filters.maxPrice) {
    query.price = {};
    if (filters.minPrice) query.price.$gte = Number(filters.minPrice);
    if (filters.maxPrice) query.price.$lte = Number(filters.maxPrice);
  }
  return await Product.find(query);
};
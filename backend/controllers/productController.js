const productService = require('../services/productService');
const asyncHandler = require('../middlewares/asyncHandler');
const { successResponse } = require('../utils/responseHelper');

exports.getProducts = asyncHandler(async (req, res) => {
  const { category, keyword } = req.query;
  console.log('📥 收到查詢參數:', { category, keyword });
  const products = await productService.getAllProducts({ category, keyword });
  console.log('📤 查詢到商品數量:', products.length);
  res.json(successResponse({ products }, '取得商品列表'));
});
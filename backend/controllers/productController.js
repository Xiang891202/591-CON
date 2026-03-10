const productService = require('../services/productService');
const asyncHandler = require('../middlewares/asyncHandler');
const { successResponse } = require('../utils/responseHelper');

// 輔助函式：將排序字串轉換為 MongoDB 排序物件
const parseSort = (sortString) => {
  if (!sortString) return { createdAt: -1 }; // 預設依建立時間遞減
  const sortOrder = sortString.startsWith('-') ? -1 : 1;
  const sortField = sortString.replace(/^-/, '');
  return { [sortField]: sortOrder };
};

//取出商品ID 訊息 
exports.getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await productService.getProductById(id);

  if (!product) {
    return res.status(404).json({ 
      success: false, 
      message: '商品不存在' 
    });
  } 

  res.json(successResponse(product, '取得商品資訊成功'));
});

exports.getProducts = asyncHandler(async (req, res) => {
  // 從 req.query 取出所有參數
  const {
    page = 1,
    limit = 10,
    sort,
    category,
    keyword,
    minPrice,
    maxPrice,
  } = req.query;

  // 組成篩選條件物件
  const filters = {};
  if (category) filters.category = category;
  if (keyword) filters.keyword = keyword;
  if (minPrice || maxPrice) {
    filters.minPrice = minPrice ? Number(minPrice) : undefined;
    filters.maxPrice = maxPrice ? Number(maxPrice) : undefined;
  }

  // 組成選項物件（排序、分頁）
  const options = {
    sort: parseSort(sort),
    limit: parseInt(limit),
    skip: (parseInt(page) - 1) * parseInt(limit),
  };

  console.log('📥 收到查詢參數:', { ...filters, page, limit, sort });

  // 呼叫 service（注意方法名稱已改為 getProducts）
  const { products, total } = await productService.getProducts(filters, options);

  console.log('📤 查詢到商品數量:', products.length, '總筆數:', total);

  // 回傳統一格式，包含分頁資訊
  res.json(successResponse({
      products,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
    }, '取得商品列表成功'));
});

//////////////////////////////////////////////////

// @desc    建立商品 (管理員)
// @route   POST /api/products
exports.createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body);
  res.status(201).json(successResponse({ product }, '商品建立成功'));
});

// @desc    更新商品 (管理員)
// @route   PUT /api/products/:id
exports.updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await productService.updateProduct(id, req.body);
  if (!product) {
    return res.status(404).json({ success: false, message: '商品不存在' });
  }
  res.json(successResponse({ product }, '商品更新成功'));
});

// @desc    刪除商品 (管理員)
// @route   DELETE /api/products/:id
exports.deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await productService.deleteProduct(id);
  if (!product) {
    return res.status(404).json({ success: false, message: '商品不存在' });
  }
  res.json(successResponse({ message: '商品已刪除' }));
});
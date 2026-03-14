
const Product = require('../models/Product');
const logger = require('../utils/logger');

// 可擴充其他方法：getProductById, createProduct 等

// 取得單一商品 by ID
exports.getProductById = async (id) => {
  return await Product.findById(id);
};


//取得商品列表，支援分類、關鍵字和價格範圍等篩選條件
exports.getProducts = async (filters = {}, options = {}) => {
  const query = {};
  if (filters.category) query.category = filters.category;
  if (filters.keyword) query.name = { $regex: filters.keyword, $options: 'i' };
  // 新增價格範圍篩選範例
  if (filters.minPrice || filters.maxPrice) {
    query.price = {};
    if (filters.minPrice) query.price.$gte = Number(filters.minPrice);
    if (filters.maxPrice) query.price.$lte = Number(filters.maxPrice);
  }

  //排序/分頁
  const products = await Product.find(query)
    .sort(options.sort)
    .limit(options.limit)
    .skip(options.skip);

  const total = await Product.countDocuments(query);

  return { products , total};
};


// 建立商品
exports.createProduct = async (productData) => {
  return await Product.create(productData);
};

// 更新商品
exports.updateProduct = async (id, updateData) => {
  return await Product.findByIdAndUpdate(id, updateData, {
    new: true,           // 回傳更新後的資料
    runValidators: true, // 執行驗證
  });
};

// 刪除商品
exports.deleteProduct = async (id) => {
  return await Product.findByIdAndDelete(id);
};

/////////////////////////////////////////

//地圖找房
// 在檔案最後面加入（或取代您寫的 getProductProperties）
exports.getPropertiesInBounds = async (bounds) => {
  const { minLat, maxLat, minLng, maxLng } = bounds;
  logger.info('🔍 查詢範圍:', { minLat, maxLat, minLng, maxLng });
  if([minLat, maxLat, minLng, maxLng].some(v =>v === undefined || isNaN(v))) {
    throw new Error('無效的經緯度範圍');
  }
  const query = {
    lat: { $gte: minLat, $lte: maxLat },
    lng: { $gte: minLng, $lte: maxLng }
  };
  const results = await Product.find(query).select('name lat lng price images');
  logger.info(`📦 找到 ${results.length} 筆商品`);
  return results;
};

//商品詳細頁用
exports.getProductById = async (id) => {
  return await Product.findById(id);
};
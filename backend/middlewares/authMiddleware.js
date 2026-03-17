// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('./asyncHandler');
const logger = require('../utils/logger')

const protect = asyncHandler(async (req, res, next) => {
  logger.info('🔐 protect 開始');
  
  const token = req.header('Authorization')?.replace('Bearer ', '');
  logger.info('🔐 Token 是否存在', !!token);
  
  if (!token) {
    // console.log('🔐 無Token');
    res.status(401);
    throw new Error('未提供 Token，請先登入');
  }

  try {
    logger.info('🔄 開始驗證 token，JWT_SECRET 是否存在:', !!process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    logger.info('✅ token 驗證成功，使用者 ID:', decoded.id);
    
    const user = await User.findById(decoded.id).select('-password');
    logger.info('👤 查詢到使用者:', user ? user.email : '無');
    
    if (!user) {
      // console.log('❌ 使用者不存在');
      res.status(401);
      throw new Error('使用者不存在，請重新登入');
    }
    
    req.user = user;
    next(); // 成功後呼叫 next，並立即返回，避免執行後續代碼
  } catch (error) {
    logger.error('❌ jwt 驗證失敗:', error.message);
    res.status(401);
    throw new Error('無效的 Token，請重新登入');
  }
  
  // 注意：這裡不需要再寫重複的查詢和 next()，因為上面已經處理了
});

module.exports = { protect };
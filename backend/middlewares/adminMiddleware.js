// middlewares/adminMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('./asyncHandler');

// 驗證使用者是否為管理員的中間件 與 authMiddleware.js 重複且不完整
// const protect = asyncHandler(async (req, res, next) => {
//   let token;  
//   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) 
//   {
//     token = req.headers.authorization.split(' ')[1];
//   }
//   if (!token) {
//     res.status(401).json({ success: false, message: '未授權，請登入' });
//   }
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = await User.findById(decoded.id).select('-password');
//     next();
//   } catch (error) {
//     res.status(401).json({ success: false, message: '令牌無效，請重新登入' });
//   }
// });

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    next(new Error('沒有管理員權限'));
  }
};

module.exports = { admin };
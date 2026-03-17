// middlewares/adminMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('./asyncHandler');


const admin = (req, res, next) => {
  if(!req.user) {
    // 示例
    const error = new Error('未提供 Token，請先登入');
    error.statusCode = 401;
    throw error;
    return res.status(401).json({ success: false, message: '未授權，請先登入' })
  }
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: '沒有管理員權限' });
  }
};

module.exports = { admin };
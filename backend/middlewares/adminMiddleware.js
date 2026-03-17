// middlewares/adminMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('./asyncHandler');


const admin = (req, res, next) => {
  if(!req.user) {
    return res.status(401).json({ success: false, message: '未授權，請先登入' })
  }
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: '沒有管理員權限' });
  }
};

module.exports = { admin };
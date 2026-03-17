const authService = require('../services/authService')
const asyncHandler = require('../middlewares/asyncHandler')
const { successResponse } = require('../utils/responseHelper')

exports.register = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body
  const result = await authService.register(email, password, name)
  res.status(201).json(successResponse(result, '註冊成功'))
})

exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const result = await authService.login(email, password)
    res.json(successResponse(result, '登入成功'));
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const updatedUser = await authService.updateUser(req.user.id, req.body)
  res.json(successResponse(updatedUser, '個人資料更新成功'));
})

// controllers/authController.js (在原有內容後新增)
// const { successResponse } = require('../utils/responseHelper');

// ⚠️ 你需要自行確保 req.user 已由 authMiddleware 注入
exports.getMe = asyncHandler(async (req, res) => {
  // 假設 req.user 已存在
  const user = req.user;
  // authMiddleware.js
  // req.user = await User.findById(decoded.id).select('-password');
  res.json(successResponse({ user }, '取得使用者資料成功'));
});
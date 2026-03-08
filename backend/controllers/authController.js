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
  res.json(successResponse(result, '登入成功'))
})
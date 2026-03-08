const { errorResponse } = require('../utils/responseHelper')

const errorHandler = (err, req, res, next) => {
  console.error('❌ 全域錯誤處理器捕獲:', err)  // 完整輸出錯誤物件
  console.error(err.stack)                      // 輸出堆疊

  const statusCode = err.statusCode || 500
  const message = err.message || '伺服器內部錯誤'

  res.status(statusCode).json(errorResponse(message))
}

module.exports = errorHandler
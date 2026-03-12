exports.successResponse = (data, message = '成功') => ({
  success: true,
  message,
  data
});

exports.errorResponse = (message = '失敗', code = null) => ({
  success: false,
  message,
  ...(code && { code }),
})
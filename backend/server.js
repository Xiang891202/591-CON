const app = require('./app');
const connectDB = require('./config/db'); // 引入連線函式
const logger = require('./utils/logger') // 引入 logger
const PORT = process.env.PORT || 3000;

// 先連線資料庫
connectDB().then(() => {
  // 連線成功後啟動伺服器
  app.listen(PORT, () => {
    logger.info(`🚀 Server running on http://localhost:${PORT}`);
  });
});
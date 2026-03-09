// config/db.js
const mongoose = require('mongoose');
const logger = require('../utils/logger')

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    logger.info(`✅ MongoDB 連線成功: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`❌ 資料庫連線失敗: ${error.message}`);
    process.exit(1); // 連線失敗直接結束程序
  }
};

module.exports = connectDB;  // 只匯出函式，不執行
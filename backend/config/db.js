// config/db.js
const mongoose = require('mongoose');
const logger = require('../utils/logger');

let isConnected = false;

const connectDB = async () => {
  console.trace('🔍 connectDB 被呼叫，追蹤堆疊：');
  if (isConnected) {
    logger.info('✅ 已經連線到 MongoDB，跳過重複連線');
    return;
  }
  try {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    const maskedUri = uri.replace(/:([^@]+)@/, ':****@');
    logger.info(`⏳ 正在連線到 MongoDB: ${maskedUri}`);

    await mongoose.connect(uri);
    logger.info('✅ MongoDB 連線成功');
    isConnected = true;
  } catch (error) {
    // 🔍 直接使用 console.error 輸出完整錯誤物件
    console.error('❌ 資料庫連線失敗（原始錯誤）:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
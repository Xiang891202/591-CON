// scripts/seed.js
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// 檢查 .env 檔案是否存在與內容（可選）
const envPath = path.join(__dirname, '../.env');
console.log('📄 檔案是否存在:', fs.existsSync(envPath));
if (fs.existsSync(envPath)) {
  console.log('📄 檔案內容:\n', fs.readFileSync(envPath, 'utf8'));
}
console.log('🔑 MONGODB_URI 值:', process.env.MONGODB_URI);

const Product = require('../models/Product');

const sampleProducts = [
  { name: '信義區豪華公寓', price: 10, category: 'apartment', image: '...', description: '...', lat: 25.0330, lng: 121.5654 },
  { name: '大安區溫馨小屋', price: 3, category: 'house', image: '...', description: '...', lat: 25.0660, lng: 121.5330 },
  { name: '板橋電梯大樓', price: 2.5, category: 'apartment', image: '...', description: '...', lat: 24.9160, lng: 121.4330 },
  { name: '中山區時尚套房', price: 4.2, category: 'apartment', image: '...', description: '近捷運中山站', lat: 25.0500, lng: 121.5200 },
];

const seedDatabase = async () => {
  try {
    // 若 process.env.MONGODB_URI 仍為 undefined，可暫時改用硬編碼連線字串（如下註解）
    // const MONGODB_URI = 'mongodb+srv://591-CON:591CON@cluster0.jm8sjcd.mongodb.net/?appName=Cluster0';
    // await mongoose.connect(MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ 已連線到 MongoDB Atlas');

    for (const item of sampleProducts) {
      await Product.updateOne(
        { name: item.name },
        {
          $set: {
            price: item.price,
            category: item.category,
            image: item.image,
            description: item.description,
            lat: item.lat,
            lng: item.lng
          }
        },
        { upsert: true }
      );
      console.log(`✅ 已更新/插入商品：${item.name}`);
    }

    console.log('📦 資料更新完成');
    await mongoose.connection.close();
    console.log('🔌 資料庫連線已關閉');
  } catch (error) {
    console.error('❌ 發生錯誤：', error);
    process.exit(1);
  }
};

seedDatabase();
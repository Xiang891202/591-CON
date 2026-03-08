// scripts/seed.js
require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Product = require('../models/Product');

const sampleProducts = [
  // 原有的商品...
  { name: '信義區豪華公寓', price: 5, category: 'apartment', image: '...', description: '...' },
  { name: '大安區溫馨小屋', price: 3, category: 'house', image: '...', description: '...' },
  { name: '板橋電梯大樓', price: 2.5, category: 'apartment', image: '...', description: '...' },
  // 新增一筆
  { name: '中山區時尚套房', price: 4.2, category: 'apartment', image: '...', description: '近捷運中山站' },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ 已連線到 MongoDB Atlas');

    // 這裡不再刪除所有資料，而是逐一檢查並插入
    for (const item of sampleProducts) {
      const existing = await Product.findOne({ name: item.name }); // 以名稱為判斷依據
      if (!existing) {
        await Product.create(item);
        console.log(`➕ 新增商品：${item.name}`);
      } else {
        console.log(`⏭️ 商品已存在，跳過：${item.name}`);
      }
    }

    console.log('📦 增量插入完成');
    await mongoose.connection.close();
    console.log('🔌 資料庫連線已關閉');
  } catch (error) {
    console.error('❌ 發生錯誤：', error);
    process.exit(1);
  }
};

seedDatabase();
// scripts/seed.js
const path = require('path');
const mongoose = require('mongoose');
const logger = require('../utils/logger');
const { faker } = require('@faker-js/faker');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Product = require('../models/Product');

// 商品分類選項
const categories = ['apartment', 'house', 'condo', 'studio', 'office'];

// 隨機產生單一商品
const generateProduct = () => {
  const name = faker.location.street() + ' ' + faker.helpers.arrayElement(['豪宅', '公寓', '小屋', '套房', '別墅']);
  const description = faker.lorem.paragraph();
  const price = faker.number.float({ min: 1, max: 20, precision: 0.1 }); // 萬/月
  const category = faker.helpers.arrayElement(categories);
  const stock = faker.number.int({ min: 0, max: 50 });
  // 固定尺寸 300x200 的圖片
  const images = Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => 
    `https://picsum.photos/300/200?random=${Math.floor(Math.random() * 10000)}`
  );
  const lat = faker.location.latitude({ min: 21.9, max: 25.3 });
  const lng = faker.location.longitude({ min: 119.5, max: 122.0 });

  return {
    name,
    description,
    price,
    category,
    stock,
    images,
    lat,
    lng,
  };
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('✅ 已連線到 MongoDB Atlas');

    // 刪除現有所有商品 (可選，根據需求決定是否保留)
    await Product.deleteMany({});
    logger.info('🗑️ 已清空 products 集合');

    const products = [];
    for (let i = 0; i < 100; i++) {
      products.push(generateProduct());
    }

    await Product.insertMany(products);
    logger.info(`📦 已成功插入 ${products.length} 筆商品資料`);

    await mongoose.connection.close();
    logger.info('🔌 資料庫連線已關閉');
  } catch (error) {
    logger.error('❌ 發生錯誤：', error);
    process.exit(1);
  }
};

seedDatabase();
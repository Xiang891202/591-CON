const express = require('express')
const cors = require('cors')
const favoriteRoutes = require('./routes/favoriteRoutes')
require('dotenv').config()
const connectDB = require('./config/db') // 連線資料庫

const authRoutes = require('./routes/authRoutes')
const productRoutes = require('./routes/productRoutes')
const errorMiddleware = require('./middlewares/errorMiddleware')
const adminProductRoutes = require('./routes/adminProductRoutes')
const logger = require('./utils/logger')

const app = express()
connectDB() // 連線資料庫

app.use(cors()) // 允許跨域（開發用）
app.use(express.json())
app.use('/api/favorites', favoriteRoutes);
app.use('/api/admin/products', adminProductRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/upload', require('./routes/uploadRoutes'));

app.get('/', (req, res) => {
  res.send('🚀 後端 API 伺服器運作中，請使用 /api 相關端點');
});

// 路由註冊
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
// app.use('/api/admin/products', require('./routes/adminProductRoutes')); // 新增這行



//處理地理編碼
app.get('/api/geocode', async (req, res) => {
  const { q, lat, lon } = req.query;
  let url;
  if (q) {
    url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}`;
  } else if (lat && lon) {
    url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
  } else {
    return res.status(400).json({ error: '缺少参数' });
  }
  logger.info('🌍 Geocode request URL:', url);
  try {
    const response = await fetch(url, {
      headers:{ 'User-Agent': 'MyApp/1.0 (test@gmail.com)'}
    });
    logger.info('📡 Response status:', response.status); // 打印 HTTP 状态码

    if (!response.ok) {
      // 如果响应不成功，尝试读取错误信息
      const errorText = await response.text();
      logger.error('❌ Nominatim error response:', errorText);
      return res.status(response.status).json({ error: '地理编码服务返回错误' });
    }

    const data = await response.json();
    logger.info('✅ Geocode data received:', data); // 打印返回数据（注意可能很大，可酌情减少）
    res.json(data);
  } catch (err) {
    logger.error('🔥 Geocode fetch error:', err); // 打印完整错误堆栈
    res.status(500).json({ error: '地理编码服务错误' });
  }
});

//404處理
app.use((req, res) => {
  res.status(404).json({ success: false, message: '路由不存在' })
});

// 全域錯誤處理中介層（需放在所有路由之後）
app.use(errorMiddleware)

module.exports = app
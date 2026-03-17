const express = require('express')
const cors = require('cors')
const favoriteRoutes = require('./routes/favoriteRoutes')
require('dotenv').config()
// const connectDB = require('./config/db') // 連線資料庫

const authRoutes = require('./routes/authRoutes')
const productRoutes = require('./routes/productRoutes')
const errorMiddleware = require('./middlewares/errorMiddleware')

const app = express()
// connectDB() // 連線資料庫

app.use(cors()) // 允許跨域（開發用）
app.use(express.json())
app.use('/api/favorites', favoriteRoutes);

app.get('/', (req, res) => {
  res.send('🚀 後端 API 伺服器運作中，請使用 /api 相關端點');
});

// 路由註冊
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/admin/products', require('./routes/adminProductRoutes')); // 新增這行


//404處理
app.use((req, res) => {
  res.status(404).json({ success: false, message: '路由不存在' })
});

// 全域錯誤處理中介層（需放在所有路由之後）
app.use(errorMiddleware)

module.exports = app
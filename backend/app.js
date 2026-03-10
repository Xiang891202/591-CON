const express = require('express')
const cors = require('cors')
require('dotenv').config()
// require('./config/db') // 連線資料庫

const authRoutes = require('./routes/authRoutes')
const productRoutes = require('./routes/productRoutes')
const errorMiddleware = require('./middlewares/errorMiddleware')

const app = express()

app.use(cors()) // 允許跨域（開發用）
app.use(express.json())
app.use('/api/favorites', require('./routes/favoriteRoutes'));

app.get('/', (req, res) => {
  res.send('🚀 後端 API 伺服器運作中，請使用 /api 相關端點');
});

// 路由註冊
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)

// 全域錯誤處理中介層（需放在所有路由之後）
app.use(errorMiddleware)

module.exports = app
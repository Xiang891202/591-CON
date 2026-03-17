// routes/uploadRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const { protect } = require('../middlewares/authMiddleware');
const { admin } = require('../middlewares/adminMiddleware');
router.use(protect, admin); // 或仅在 POST 路由前使用

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // 确保目录存在
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

router.post('/', upload.array('images', 10), (req, res) => {
  const files = req.files;
  const urls = files.map(file => `/uploads/${file.filename}`);
  res.json({ success: true, data: urls });
});

module.exports = router;
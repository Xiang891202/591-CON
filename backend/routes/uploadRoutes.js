// routes/uploadRoutes.js
const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const router = express.Router();

const { protect } = require('../middlewares/authMiddleware');
const { admin } = require('../middlewares/adminMiddleware');

// Cloudinary 設定（已在 app.js 或 server.js 中全域設定，此處可省略重複設定）
// 但若尚未設定，請在此加入：
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: '591-products',
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif'],
  },
});
const upload = multer({ storage });

// 需要登入且為管理員才能上傳（若允許一般用戶上傳，請調整 middleware）
router.use(protect, admin);

router.post('/', upload.array('images', 10), (req, res) => {
  const urls = req.files.map(file => file.path); // Cloudinary 回傳的 URL
  res.json({ success: true, data: urls });
});

module.exports = router;
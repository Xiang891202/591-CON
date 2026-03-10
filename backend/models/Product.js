const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, '商品名稱不能為空'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, '商品描述不能為空'],
    },
    price: {
      type: Number,
      required: [true, '價格不能為空'],
      min: 0,
    },
    category: {
      type: String,
      required: [true, '分類不能為空'],
    },
    stock: {
      type: Number,
      required: [true, '庫存不能為空'],
      min: 0,
      default: 0,
    },
    images: [String],
    // 可依需求擴充欄位
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);
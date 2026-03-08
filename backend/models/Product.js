const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, enum: ['house', 'apartment'], required: true },
  image: { type: String, default: 'https://picsum.photos/200/150?random=4' },
  description: String,
}, { timestamps: true })

module.exports = mongoose.model('Product', productSchema)
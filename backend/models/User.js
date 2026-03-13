const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },  // ← 加入這行
}, { timestamps: true })

// 密碼加密 (儲存前)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  try{
    console.log('🔐 開始加密密碼') // 日誌
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    console.log('🔐 密碼加密完成') // 日誌
    next()
  } catch (err) {
    console.error('🔐 密碼加密失敗:', err) // 錯誤日誌
    next(err)
  }
})

// 比對密碼的方法
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

module.exports = mongoose.model('User', userSchema)
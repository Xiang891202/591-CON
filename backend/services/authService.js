const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')//引用 加密來進行比對

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' })
}

exports.register = async (email, password, name) => {
  const existingUser = await User.findOne({ email })
  if (existingUser) throw new Error('Email already exists')
  const user = await User.create({ email, password, name })
  return { user: { id: user._id, email: user.email, name: user.name }, token: generateToken(user._id) }
}

exports.login = async (email, password) => {
  const user = await User.findOne({ email })
  if (!user) throw new Error('Invalid credentials')
  const isMatch = await user.comparePassword(password)
  if (!isMatch) throw new Error('Invalid credentials')
  return { user: { id: user._id, email: user.email, name: user.name }, token: generateToken(user._id) }
}

// 新增 updateUser 函式，允許更新使用者資料
exports.updateUser = async (userId, updateData) => {
  const allowedFields = [ 'name', 'password' ] // 允許更新的欄位
  const user = await User.findById(userId);
  if (!user) throw new Error('使用者不存在');
  
  //更新允許的欄位
  if(updateData.name !== undefined) {
    user.name = updateData.name;
  }
  if(updateData.password !== undefined) {
    const isSame = await bcrypt.compare(updateData.password, user.password);
    if(isSame) {
      // throw n  ew Error('新密碼不能與舊密碼相同');
      user.password = updateData.password; // 此處賦值會觸發 pre('save') 中間件加密
    }
  }

  await user.save(); // 儲存更新後的使用者資料

  //回傳不包含密碼的使用者資料
  const updatedUser = user.toObject();
  delete updatedUser.password; // 刪除密碼欄位
  return updatedUser;
}


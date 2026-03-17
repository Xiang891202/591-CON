const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const AppError = require('../utils/AppError');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
};

exports.register = async (email, password, name) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new AppError('Email already exists', 400);
  const user = await User.create({ email, password, name });
  return { user: { id: user._id, email: user.email, name: user.name, role: user.role }, token: generateToken(user._id) };
};

exports.login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new AppError('Invalid credentials', 401);
  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new AppError('Invalid credentials', 401);
  return { user: { id: user._id, email: user.email, name: user.name, role: user.role, }, token: generateToken(user._id) };
};

exports.updateUser = async (userId, updateData) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError('使用者不存在', 404);

  // 更新姓名（若有提供且不同）
  if (updateData.name !== undefined && updateData.name !== user.name) {
    user.name = updateData.name;
  }

  // 更新密碼（若有提供且非空）
  if (updateData.password && updateData.password.trim() !== '') {
    // 檢查是否與舊密碼相同
    const isSame = await bcrypt.compare(updateData.password, user.password);
    if (isSame) {
      throw new AppError('新密碼不能與舊密碼相同', 400);
    }
    // 賦值，pre('save') 會自動加密
    user.password = updateData.password;
  }

  // 如果沒有任何欄位被修改，直接回傳使用者資料（不含密碼）
  if (!user.isModified()) {
    const userObj = user.toObject();
    delete userObj.password;
    return userObj;
  }

  // 儲存變更（觸發驗證與加密）
  await user.save();

  const userObj = user.toObject();
  delete userObj.password;
  return userObj;
};
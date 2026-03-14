const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
};

exports.register = async (email, password, name) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error('Email already exists');
  const user = await User.create({ email, password, name });
  return { user: { id: user._id, email: user.email, name: user.name }, token: generateToken(user._id) };
};

exports.login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid credentials');
  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error('Invalid credentials');
  return { user: { id: user._id, email: user.email, name: user.name }, token: generateToken(user._id) };
};

exports.updateUser = async (userId, updateData) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('使用者不存在');

  const updateFields = {}; // ✅ 定義要更新的欄位物件

  // 處理姓名更新
  if (updateData.name !== undefined && updateData.name !== user.name) {
    updateFields.name = updateData.name;
  }

  // 處理密碼更新
  if (updateData.password !== undefined && updateData.password.trim() !== '') {
    // 檢查是否與舊密碼相同
    const isSame = await bcrypt.compare(updateData.password, user.password);
    if (isSame) {
      throw new Error('新密碼不能與舊密碼相同');
    }
    // 手動加密新密碼
    const salt = await bcrypt.genSalt(10);
    updateFields.password = await bcrypt.hash(updateData.password, salt);
  }

  // 如果沒有任何欄位要更新，直接回傳使用者資料（不含密碼）
  if (Object.keys(updateFields).length === 0) {
    const userObj = user.toObject();
    delete userObj.password;
    return userObj;
  }

  // 執行更新（使用 updateOne 直接操作資料庫，避開 Mongoose 的 pre('save') 鉤子）
  await User.updateOne({ _id: userId }, { $set: updateFields });

  // 組合更新後的資料回傳
  const updatedUser = {
    ...user.toObject(),
    ...updateFields
  };
  delete updatedUser.password;
  return updatedUser;
};
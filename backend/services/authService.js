const User = require('../models/User')
const jwt = require('jsonwebtoken')

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
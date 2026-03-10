// middlewares/adminMiddleware.js
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    throw new Error('沒有管理員權限');
  }
};

module.exports = { admin };
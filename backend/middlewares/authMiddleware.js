// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('./asyncHandler');

// ⚠️ 你需要自行實作：驗證邏輯、錯誤處理、從環境變數讀取 JWT_SECRET
const protect = asyncHandler(async (req, res, next) => {

  // 1. 從 Authorization 標頭取得 Token

  //1-1 vscode的自動補全功能會提示你使用 req.header('Authorization') 來獲取標頭中的 Token，並且可以使用 replace 方法去掉 "Bearer " 前綴。以下是完整的實作：
  const token = req.header('Authorization')?.replace('Bearer ', '');
  //解釋req.header('Authorization') 是 Express 提供的取得特定標頭的方法，效果等同於 req.headers['authorization']。

    // ?. 是可選鏈運算子，如果 req.header('Authorization') 回傳 undefined 或 null，它就不會執行後面的 .replace，直接回傳 undefined，避免錯誤。

    // .replace('Bearer ', '') 是用來去掉字串開頭的 "Bearer "，只留下 token 本身。注意這裡假設標頭格式一定是 Bearer xxxxx，所以移除 "Bearer " 後剩下的就是 token。

    // 所以這行能正確取得 token，如果沒有 Authorization 標頭，token 就會是 undefined。

  //1-2 宣告 之後將其分割 出來 token 變數
  // let token;
  // if (authHeader && authHeader.startsWith('Bearer')) {
  //   token = authHeader.split(' ')[1];
  // }


  // 2. 若無 Token，拋出 401 錯誤
  if (!token) {
    res.status(401);
    throw new Error('未提供 Token，請先登入');
  }

  // 3. 驗證 Token，取得解碼後的使用者 ID
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    res.status(401);
    throw new Error('無效的 Token，請重新登入');
  }

  // 4. 從資料庫查詢使用者（不含密碼）並附加到 req.user
  const user = await User.findById(decoded.id).select('-password');
  if (!user) {
    res.status(401);
    throw new Error('使用者不存在，請重新登入');
  }
  req.user = user;

  // 5. 呼叫 next()
  next();
});

module.exports = { protect };
const jwt = require("jsonwebtoken");
require('dotenv').config()

const validate = (req, res, next) => {
    // if token not found
  const accessToken = req.header("token");

  if (!accessToken) {
    return res.json({ error: 'Token not found' });
  } 

  // verify token
  try {
    const decoded = jwt.verify(accessToken, `${process.env.ACCESS_SECRET}`);
    if (decoded) {
      req.user = decoded
      return next();
    }
  } catch (error) {
    res.json({
    auth: 'Unauthenticated',
   error: 'Invalid Token'
})
  }
};


module.exports = { validate };
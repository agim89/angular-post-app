const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = ((req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodetToken = jwt.verify(token, config.JWT_KEY);
    req.userData = {email: decodetToken.email, userId: decodetToken.userId}
    next();
  } catch (error) {
    res.status(401).json({message: 'failed to authorizate'})
  }
})

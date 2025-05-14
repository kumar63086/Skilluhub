const crypto = require('crypto');
const generateJWTSecret = () => {
  return crypto.randomBytes(32).toString('hex');
};

const jwtSecret = generateJWTSecret();
console.log('Generated JWT_SECRET:', jwtSecret);

import jwt from 'jsonwebtoken';

// Add a common fallback secret - must match the one in authController.js and authMiddleware.js
const JWT_SECRET = process.env.JWT_SECRET || 'CommUnityCare_JWT_Secret_Key_2024_secure_random_string';

const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: '1h', // Token expires in 1 hour
  });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};

export { generateToken, verifyToken };

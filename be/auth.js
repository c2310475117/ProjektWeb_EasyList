import jwt from 'jsonwebtoken';

const secretKey = 'your_secret_key';

// Token generieren
export const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, secretKey, { expiresIn: '1h' });
};

// Token verifizieren
export const verifyToken = (token) => {
  return jwt.verify(token, secretKey);
};

// Middleware zur Authentifizierung
export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send('Access denied. No token provided.');
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send('Invalid token.');
  }
};
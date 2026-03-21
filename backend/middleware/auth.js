import jwt from 'jsonwebtoken';

export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Missing token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'nebula_dev_secret');
    req.user = decoded;
    return next();
  } catch (_error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

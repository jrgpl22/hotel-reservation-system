import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401);
      throw new Error('Not authenticated. Please sign in.');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (error) {
    res.status(401);
    next(new Error('Session expired or invalid. Please sign in again.'));
  }
};
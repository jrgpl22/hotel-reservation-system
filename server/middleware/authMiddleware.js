import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Verifies the JWT, then re-reads the account so role changes and
// deactivation apply immediately instead of when the token expires.
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401);
      throw new Error('Not authenticated. Please sign in.');
    }

    let decoded;
    try {
      decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
    } catch {
      res.status(401);
      throw new Error('Session expired or invalid. Please sign in again.');
    }

    const user = await User.findById(decoded.id).select('role isActive');
    if (!user || user.isActive === false) {
      res.status(401);
      throw new Error('This account is no longer active. Please sign in again.');
    }

    req.user = { id: user._id.toString(), role: user.role };
    next();
  } catch (error) {
    next(error);
  }
};

// Doesn't block the request. Attaches req.user only when the token is valid
// and the account is active. Used on public GET routes.
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('role isActive');
      if (user && user.isActive !== false) {
        req.user = { id: user._id.toString(), role: user.role };
      }
    }
  } catch {
    // Invalid or expired token: treat the request as a guest
  }
  next();
};
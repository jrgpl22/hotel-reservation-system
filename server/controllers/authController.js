import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @route  POST /api/auth/register
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409);
      throw new Error('An account with this email already exists');
    }

    const user = await User.create({ name, email, password, phone, role: 'guest' });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @route  POST /api/auth/login
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      res.status(401);
      throw new Error('Invalid email or password');
    }    
    if (user.isActive === false) {
      res.status(403);
      throw new Error('This account has been deactivated. Please contact the hotel.');
    }

    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      message: 'Signed in successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @route  GET /api/auth/me
export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @route  PUT /api/auth/me
export const updateCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    user.name = req.body.name ?? user.name;
    user.phone = req.body.phone ?? user.phone;
    if (req.body.password) {
      user.password = req.body.password; // pre('save') hook re-hashes it
    }
    

    const updated = await user.save();

    res.json({
      success: true,
      message: 'Profile updated',
      user: {
        id: updated._id,
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        role: updated.role,
      },
    });
  } catch (error) {
    next(error);
  }
};
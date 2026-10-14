import User from '../models/User.js';
import Reservation from '../models/Reservation.js';

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

const asString = (value) => (typeof value === 'string' ? value : '');

// Search text is user input, so escape it before using it in a regex
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// The only fields allowed to leave the API. Passwords and tokens are never included.
const toUserResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone || '',
  role: user.role,
  isActive: user.isActive !== false, // accounts created before this field existed count as active
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const isActiveAdmin = (user) => user.role === 'admin' && user.isActive !== false;

const countOtherActiveAdmins = (excludedUserId) =>
  User.countDocuments({ _id: { $ne: excludedUserId }, role: 'admin', isActive: { $ne: false } });

// @route GET /api/users?page=1&limit=10&search=&role=&status=  (admin)
export const getUsers = async (req, res, next) => {
  try {
    const search = asString(req.query.search).trim();
    const role = asString(req.query.role);
    const status = asString(req.query.status);
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(req.query.limit, 10) || DEFAULT_LIMIT));

    const query = {};

    if (search) {
      const pattern = new RegExp(escapeRegex(search), 'i');
      query.$or = [{ name: pattern }, { email: pattern }, { phone: pattern }];
    }
    if (role) query.role = role;
    if (status === 'active') query.isActive = { $ne: false };
    if (status === 'inactive') query.isActive = false;

    const [users, totalItems] = await Promise.all([
      User.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      User.countDocuments(query),
    ]);

    res.json({
      success: true,
      users: users.map(toUserResponse),
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit) || 1,
      totalItems,
    });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/users/:id  (admin)
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).lean();
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const [total, recent] = await Promise.all([
      Reservation.countDocuments({ user: user._id }),
      Reservation.find({ user: user._id })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('reservationNumber room checkIn checkOut totalAmount status')
        .populate('room', 'roomNumber roomType')
        .lean(),
    ]);

    res.json({
      success: true,
      user: toUserResponse(user),
      reservations: { total, recent },
    });
  } catch (error) {
    next(error);
  }
};

// @route PUT /api/users/:id  (admin)
export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Only these fields can be changed. Email and password are deliberately not editable here.
    const { name, phone, role, isActive } = req.body;

    const isSelf = user._id.toString() === req.user.id;
    const changesRole = role !== undefined && role !== user.role;
    const deactivates = isActive === false && user.isActive !== false;

    if (isSelf && (changesRole || deactivates)) {
      res.status(403);
      throw new Error('You cannot change your own role or deactivate your own account');
    }

    // Backstop: never leave the system without an active admin
    const losesAdminAccess =
      isActiveAdmin(user) && ((role !== undefined && role !== 'admin') || deactivates);

    if (losesAdminAccess && (await countOtherActiveAdmins(user._id)) === 0) {
      res.status(409);
      throw new Error('At least one active admin must remain');
    }

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (role !== undefined) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;

    const updated = await user.save();

    res.json({
      success: true,
      message: 'User updated successfully',
      user: toUserResponse(updated),
    });
  } catch (error) {
    next(error);
  }
};

// @route DELETE /api/users/:id  (admin)
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    if (user._id.toString() === req.user.id) {
      res.status(403);
      throw new Error('You cannot delete your own account');
    }

    if (isActiveAdmin(user) && (await countOtherActiveAdmins(user._id)) === 0) {
      res.status(409);
      throw new Error('At least one active admin must remain');
    }

    const reservationCount = await Reservation.countDocuments({ user: user._id });
    if (reservationCount > 0) {
      res.status(409);
      throw new Error(
        `This user has ${reservationCount} reservation${reservationCount === 1 ? '' : 's'} on record. Deactivate the account instead to keep the booking history.`
      );
    }

    await user.deleteOne();
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};
import Room from '../models/Room.js';
import Reservation from '../models/Reservation.js';

// @route GET /api/rooms
export const getRooms = async (req, res, next) => {
  try {
    const { page = 1, limit = 9, search = '', roomType, capacity, minPrice, maxPrice, status } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { roomNumber: { $regex: search, $options: 'i' } },
        { roomType: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (roomType) query.roomType = roomType;
    if (capacity) query.capacity = { $gte: Number(capacity) };

    if (status) {
      query.status = status;
    } else if (!req.user || !['admin', 'staff'].includes(req.user.role)) {
      // Guests (or anyone unauthenticated) only ever see available rooms by default
      query.status = 'available';
    }
    // Admin/staff with no status filter see everything, including maintenance rooms

    if (minPrice || maxPrice) {
      query.pricePerNight = {};
      if (minPrice) query.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) query.pricePerNight.$lte = Number(maxPrice);
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, parseInt(limit));
    const skip = (pageNum - 1) * limitNum;

    const [rooms, totalItems] = await Promise.all([
      Room.find(query).sort({ roomNumber: 1 }).skip(skip).limit(limitNum),
      Room.countDocuments(query),
    ]);

    res.json({
      success: true,
      rooms,
      currentPage: pageNum,
      totalPages: Math.ceil(totalItems / limitNum) || 1,
      totalItems,
    });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/rooms/:id
export const getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      res.status(404);
      throw new Error('Room not found');
    }
    res.json({ success: true, room });
  } catch (error) {
    next(error);
  }
};

// @route POST /api/rooms (admin only)
export const createRoom = async (req, res, next) => {
  try {
    const existing = await Room.findOne({ roomNumber: req.body.roomNumber });
    if (existing) {
      res.status(409);
      throw new Error('A room with this number already exists');
    }

    const room = await Room.create(req.body);
    res.status(201).json({ success: true, message: 'Room created successfully', room });
  } catch (error) {
    next(error);
  }
};

// @route PUT /api/rooms/:id (admin only)
export const updateRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      res.status(404);
      throw new Error('Room not found');
    }

    Object.assign(room, req.body);
    const updated = await room.save();

    res.json({ success: true, message: 'Room updated successfully', room: updated });
  } catch (error) {
    next(error);
  }
};

// @route DELETE /api/rooms/:id (admin only)
export const deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      res.status(404);
      throw new Error('Room not found');
    }

    // Block deletion if the room has any pending/confirmed reservation
    // that hasn't checked out yet
    const activeReservation = await Reservation.findOne({
      room: room._id,
      status: { $in: ['pending', 'confirmed'] },
      checkOut: { $gte: new Date() },
    });

    if (activeReservation) {
      res.status(409);
      throw new Error('This room has active or upcoming reservations and cannot be deleted');
    }

    await room.deleteOne();
    res.json({ success: true, message: 'Room deleted successfully' });
  } catch (error) {
    next(error);
  }
};
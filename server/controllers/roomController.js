import Room from '../models/Room.js';
import Reservation from '../models/Reservation.js';
import { deleteStoredImageIfUnused } from '../utils/storedImages.js';


const ROOM_FIELDS = [
  'roomNumber', 'roomType', 'description', 'pricePerNight',
  'capacity', 'bedType', 'amenities', 'images', 'status',
];

// Only these fields can be written. Anything else in the request body is ignored.
const pickRoomFields = (body) => {
  const data = {};
  ROOM_FIELDS.forEach((field) => {
    if (body[field] !== undefined) data[field] = body[field];
  });
  // The cover always mirrors the first photo, so code that reads room.image keeps working
  if (data.images) data.image = data.images[0] || '';
  return data;
};

const allImagesOf = (room) => [...new Set([room.image, ...(room.images || [])].filter(Boolean))];

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

    const room = await Room.create(pickRoomFields(req.body));
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

    const previousImages = allImagesOf(room);
    Object.assign(room, pickRoomFields(req.body));
    const updated = await room.save();

    // Remove uploaded photos that this room no longer uses
    const currentImages = allImagesOf(updated);
    await Promise.all(
      previousImages.filter((path) => !currentImages.includes(path)).map((path) => deleteStoredImageIfUnused(path))
    );

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
    await Promise.all(allImagesOf(room).map((path) => deleteStoredImageIfUnused(path)));

    res.json({ success: true, message: 'Room deleted successfully' });
  } catch (error) {
    next(error);
  }
};
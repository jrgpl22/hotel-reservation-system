import mongoose from 'mongoose';
import Reservation from '../models/Reservation.js';
import Room from '../models/Room.js';
import User from '../models/User.js';
import generateReservationNumber from '../utils/generateReservationNumber.js';

// Only these reservations block a room's dates. Cancelled/completed ones don't.
const BLOCKING_STATUSES = ['pending', 'confirmed'];

// What staff/admin may change a status to, based on the current status.
const ALLOWED_TRANSITIONS = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['completed', 'cancelled'],
  cancelled: [],
  completed: [],
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const ROOM_FIELDS = 'roomNumber roomType pricePerNight capacity bedType image status';
const USER_FIELDS = 'name email phone';

// ---------- helpers ----------

// Throws an error with the HTTP status set, so errorHandler formats it.
const fail = (res, status, message) => {
  res.status(status);
  throw new Error(message);
};

// "2026-09-30" -> Date at midnight UTC. Keeps night counting free of timezone drift.
const parseDateOnly = (value) => new Date(`${String(value).slice(0, 10)}T00:00:00.000Z`);

const todayDateOnly = () => {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
};

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const isOwner = (reservation, userId) => {
  const ownerId = reservation.user?._id ?? reservation.user;
  return String(ownerId) === String(userId);
};

const isStaffOrAdmin = (user) => ['staff', 'admin'].includes(user.role);

/**
 * The one place that decides whether a stay can be booked.
 * Returns { error: { status, message } } or the computed booking details.
 * Never trusts a total from the frontend: nights x room price is computed here.
 */
const evaluateStay = async ({ roomId, checkIn, checkOut, guests }) => {
  const room = await Room.findById(roomId);
  if (!room) return { error: { status: 404, message: 'Room not found' } };

  if (room.status === 'maintenance') {
    return { error: { status: 400, message: 'This room is under maintenance and cannot be booked' } };
  }

  const checkInDate = parseDateOnly(checkIn);
  const checkOutDate = parseDateOnly(checkOut);

  if (checkInDate < todayDateOnly()) {
    return { error: { status: 400, message: 'Check-in date cannot be in the past' } };
  }
  if (checkOutDate <= checkInDate) {
    return { error: { status: 400, message: 'Check-out date must be after check-in date' } };
  }
  if (guests && guests > room.capacity) {
    return { error: { status: 400, message: `This room allows a maximum of ${room.capacity} guest(s)` } };
  }

  // Overlap rule: existing.checkIn < requested.checkOut AND existing.checkOut > requested.checkIn
  // Same-day turnover (existing checks out the day the new guest checks in) is NOT a conflict.
  const conflict = await Reservation.findOne({
    room: room._id,
    status: { $in: BLOCKING_STATUSES },
    checkIn: { $lt: checkOutDate },
    checkOut: { $gt: checkInDate },
  });
  if (conflict) {
    return { error: { status: 409, message: 'This room is already booked for the selected dates' } };
  }

  const nights = Math.round((checkOutDate - checkInDate) / MS_PER_DAY);
  return {
    room,
    checkInDate,
    checkOutDate,
    nights,
    totalAmount: nights * room.pricePerNight,
  };
};

// Builds the MongoDB filter for search + status. Search matches reservation number,
// room number, and (staff/admin only) guest name.
const buildListQuery = async ({ search, status }, base = {}, includeGuestSearch = false) => {
  const query = { ...base };
  if (status) query.status = status;

  const term = typeof search === 'string' ? search.trim() : '';
  if (term) {
    const regex = new RegExp(escapeRegex(term), 'i');
    const [rooms, users] = await Promise.all([
      Room.find({ roomNumber: regex }).select('_id'),
      includeGuestSearch ? User.find({ name: regex }).select('_id') : Promise.resolve([]),
    ]);

    query.$or = [{ reservationNumber: regex }, { room: { $in: rooms.map((r) => r._id) } }];
    if (users.length) query.$or.push({ user: { $in: users.map((u) => u._id) } });
  }
  return query;
};

const sendPage = async (req, res, query) => {
  const pageNum = Math.max(1, parseInt(req.query.page) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
  const skip = (pageNum - 1) * limitNum;

  const [reservations, totalItems] = await Promise.all([
    Reservation.find(query)
      .populate('room', ROOM_FIELDS)
      .populate('user', USER_FIELDS)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Reservation.countDocuments(query),
  ]);

  res.json({
    success: true,
    reservations,
    currentPage: pageNum,
    totalPages: Math.ceil(totalItems / limitNum) || 1,
    totalItems,
  });
};

// ---------- controllers ----------

// @route GET /api/reservations/availability?room=&checkIn=&checkOut=&guests=
// Powers the live "is this available?" preview in the booking form.
export const checkAvailability = async (req, res, next) => {
  try {
    const { room, checkIn, checkOut, guests } = req.query;
    const result = await evaluateStay({ roomId: room, checkIn, checkOut, guests });

    if (result.error) {
      if (result.error.status === 404) fail(res, 404, result.error.message);
      return res.json({ success: true, available: false, message: result.error.message });
    }

    res.json({
      success: true,
      available: true,
      nights: result.nights,
      pricePerNight: result.room.pricePerNight,
      totalAmount: result.totalAmount,
    });
  } catch (error) {
    next(error);
  }
};

// @route POST /api/reservations
export const createReservation = async (req, res, next) => {
  try {
    const { room: roomId, checkIn, checkOut, guests } = req.body;

    const result = await evaluateStay({ roomId, checkIn, checkOut, guests });
    if (result.error) fail(res, result.error.status, result.error.message);

    // The number has only 4 random digits, so make sure it isn't already taken.
    let reservationNumber = generateReservationNumber();
    for (let i = 0; i < 5 && (await Reservation.exists({ reservationNumber })); i++) {
      reservationNumber = generateReservationNumber();
    }

    const reservation = await Reservation.create({
      reservationNumber,
      user: req.user.id,
      room: result.room._id,
      checkIn: result.checkInDate,
      checkOut: result.checkOutDate,
      guests,
      totalAmount: result.totalAmount,
      status: 'pending',
    });

    await reservation.populate('room', ROOM_FIELDS);

    res.status(201).json({
      success: true,
      message: 'Reservation created successfully',
      reservation,
      nights: result.nights,
    });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/reservations/my?page=&limit=&search=&status=
export const getMyReservations = async (req, res, next) => {
  try {
    const query = await buildListQuery(req.query, { user: req.user.id }, false);
    await sendPage(req, res, query);
  } catch (error) {
    next(error);
  }
};

// @route GET /api/reservations?page=&limit=&search=&status=   (staff/admin)
export const getAllReservations = async (req, res, next) => {
  try {
    const query = await buildListQuery(req.query, {}, true);
    await sendPage(req, res, query);
  } catch (error) {
    next(error);
  }
};

// @route GET /api/reservations/:id  (owner, staff, or admin)
export const getReservationById = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate('room', ROOM_FIELDS)
      .populate('user', USER_FIELDS);

    if (!reservation) fail(res, 404, 'Reservation not found');

    if (!isStaffOrAdmin(req.user) && !isOwner(reservation, req.user.id)) {
      fail(res, 403, 'You do not have permission to view this reservation');
    }

    res.json({ success: true, reservation });
  } catch (error) {
    next(error);
  }
};

// @route PATCH /api/reservations/:id/cancel  (owner, staff, or admin)
export const cancelReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) fail(res, 404, 'Reservation not found');

    const staff = isStaffOrAdmin(req.user);
    if (!staff && !isOwner(reservation, req.user.id)) {
      fail(res, 403, 'You do not have permission to cancel this reservation');
    }

    if (!BLOCKING_STATUSES.includes(reservation.status)) {
      fail(res, 400, `A ${reservation.status} reservation cannot be cancelled`);
    }

    // Guests can't cancel a stay that has already started. Staff/admin still can.
    if (!staff && reservation.checkIn < todayDateOnly()) {
      fail(res, 400, 'This stay has already started and can no longer be cancelled online');
    }

    reservation.status = 'cancelled';
    await reservation.save();
    await reservation.populate('room', ROOM_FIELDS);

    res.json({ success: true, message: 'Reservation cancelled successfully', reservation });
  } catch (error) {
    next(error);
  }
};

// @route PATCH /api/reservations/:id/status  (staff/admin)
export const updateReservationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) fail(res, 404, 'Reservation not found');

    const allowed = ALLOWED_TRANSITIONS[reservation.status] || [];
    if (!allowed.includes(status)) {
      fail(res, 400, `Cannot change a ${reservation.status} reservation to ${status}`);
    }

    reservation.status = status;
    await reservation.save();
    await reservation.populate('room', ROOM_FIELDS);
    await reservation.populate('user', USER_FIELDS);

    res.json({ success: true, message: `Reservation ${status} successfully`, reservation });
  } catch (error) {
    next(error);
  }
};
// @route GET /api/reservations/booked?room=<id>
// Returns only the taken date ranges (no guest info) so the calendar can block them.
export const getBookedRanges = async (req, res, next) => {
  try {
    const { room } = req.query;
    if (!mongoose.isValidObjectId(room)) fail(res, 400, 'A valid room id is required');

    const reservations = await Reservation.find({
      room,
      status: { $in: BLOCKING_STATUSES },
      checkOut: { $gt: todayDateOnly() },
    })
      .select('checkIn checkOut -_id')
      .sort({ checkIn: 1 });

    res.json({ success: true, ranges: reservations });
  } catch (error) {
    next(error);
  }
};
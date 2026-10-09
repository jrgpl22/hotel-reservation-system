import Room from '../models/Room.js';
import Reservation from '../models/Reservation.js';

// Dashboard limits for the recent-reservations list.
const DEFAULT_RECENT_LIMIT = 5;
const MAX_RECENT_LIMIT = 20;

// Turns Mongo's [{ _id: 'pending', count: 3 }, ...] into { pending: 3, ... }.
// Every known status is listed up front so a status with zero documents still shows 0.
const toStatusCounts = (groups, statuses) => {
  const counts = Object.fromEntries(statuses.map((status) => [status, 0]));
  for (const { _id, count } of groups) {
    if (_id in counts) counts[_id] = count;
  }
  return counts;
};

// Groups a collection by status in ONE database call.
const countByStatus = (Model) =>
  Model.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);

// @route GET /api/dashboard/stats  (staff or admin)
export const getDashboardStats = async (req, res, next) => {
  try {
    const [roomGroups, reservationGroups] = await Promise.all([
      countByStatus(Room),
      countByStatus(Reservation),
    ]);

    const room = toStatusCounts(roomGroups, ['available', 'maintenance']);
    const reservation = toStatusCounts(reservationGroups, [
      'pending',
      'confirmed',
      'cancelled',
      'completed',
    ]);

    res.json({
      success: true,
      stats: {
        rooms: {
          total: room.available + room.maintenance,
          available: room.available,
          maintenance: room.maintenance,
        },
        reservations: {
          total: reservation.pending + reservation.confirmed + reservation.cancelled + reservation.completed,
          pending: reservation.pending,
          confirmed: reservation.confirmed,
          cancelled: reservation.cancelled,
          completed: reservation.completed,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/dashboard/recent-reservations?limit=5  (staff or admin)
export const getRecentReservations = async (req, res, next) => {
  try {
    let limit = DEFAULT_RECENT_LIMIT;

    if (req.query.limit !== undefined) {
      limit = Number(req.query.limit);
      if (!Number.isInteger(limit) || limit < 1 || limit > MAX_RECENT_LIMIT) {
        res.status(400);
        throw new Error(`limit must be a whole number between 1 and ${MAX_RECENT_LIMIT}`);
      }
    }

    // Only name / roomNumber are selected, so email, phone, password etc. are never loaded.
    const reservations = await Reservation.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('reservationNumber user room checkIn checkOut status createdAt')
      .populate('user', 'name')
      .populate('room', 'roomNumber')
      .lean();

    res.json({
      success: true,
      count: reservations.length,
      reservations: reservations.map((r) => ({
        _id: r._id,
        reservationNumber: r.reservationNumber,
        guestName: r.user?.name ?? null, // null if the user was deleted
        roomNumber: r.room?.roomNumber ?? null, // null if the room was deleted
        checkIn: r.checkIn,
        checkOut: r.checkOut,
        status: r.status,
        createdAt: r.createdAt,
      })),
    });
  } catch (error) {
    next(error);
  }
};

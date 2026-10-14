import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: [true, 'Room number is required'],
      unique: true,
      trim: true,
    },
    roomType: {
      type: String,
      required: [true, 'Room type is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    pricePerNight: {
      type: Number,
      required: [true, 'Price per night is required'],
      min: [0, 'Price cannot be negative'],
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      min: [1, 'Capacity must be at least 1'],
    },
    bedType: {
      type: String,
      trim: true,
    },
    amenities: {
      type: [String],
      default: [],
    },
       image: {
      type: String,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: (list) => list.length <= 6,
        message: 'A room can have at most 6 photos',
      },
    },
    status: {
      type: String,
      enum: ['available', 'maintenance'],
      default: 'available',
    },
  },
  { timestamps: true }
);

// Speeds up filtering/searching by these fields later (rooms module)
roomSchema.index({ roomType: 1, status: 1 });

const Room = mongoose.model('Room', roomSchema);

export default Room;
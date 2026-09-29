import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Room from '../models/Room.js';

const rooms = [
  { roomNumber: '101', roomType: 'Garden Deluxe', description: 'A calm room overlooking the garden courtyard.', pricePerNight: 4500, capacity: 2, bedType: 'Queen', amenities: ['Wi-Fi', 'Air Conditioning', 'TV'], image: 'photo-1611892440504-42a792e24d32', status: 'available' },
  { roomNumber: '102', roomType: 'Garden Deluxe', description: 'A calm room overlooking the garden courtyard.', pricePerNight: 4500, capacity: 2, bedType: 'Queen', amenities: ['Wi-Fi', 'Air Conditioning', 'TV'], image: 'photo-1611892440504-42a792e24d32', status: 'available' },
  { roomNumber: '103', roomType: 'Garden Deluxe', description: 'A calm room overlooking the garden courtyard.', pricePerNight: 4500, capacity: 2, bedType: 'Queen', amenities: ['Wi-Fi', 'Air Conditioning', 'TV'], image: 'photo-1611892440504-42a792e24d32', status: 'maintenance' },
  { roomNumber: '201', roomType: 'Executive Suite', description: 'Spacious suite with a separate sitting area.', pricePerNight: 6800, capacity: 2, bedType: 'King', amenities: ['Wi-Fi', 'Air Conditioning', 'TV', 'Mini Bar'], image: 'photo-1611892440504-42a792e24d32', status: 'available' },
  { roomNumber: '202', roomType: 'Executive Suite', description: 'Spacious suite with a separate sitting area.', pricePerNight: 6800, capacity: 2, bedType: 'King', amenities: ['Wi-Fi', 'Air Conditioning', 'TV', 'Mini Bar'], image: 'photo-1611892440504-42a792e24d32', status: 'available' },
  { roomNumber: '203', roomType: 'Executive Suite', description: 'Spacious suite with a separate sitting area.', pricePerNight: 6800, capacity: 2, bedType: 'King', amenities: ['Wi-Fi', 'Air Conditioning', 'TV', 'Mini Bar'], image: 'photo-1611892440504-42a792e24d32', status: 'available' },
  { roomNumber: '301', roomType: 'Family Room', description: 'A comfortable room built for families.', pricePerNight: 5200, capacity: 4, bedType: 'Two Queen', amenities: ['Wi-Fi', 'Air Conditioning', 'TV'], image: 'photo-1590490360182-c33d57733427', status: 'available' },
  { roomNumber: '302', roomType: 'Family Room', description: 'A comfortable room built for families.', pricePerNight: 5200, capacity: 4, bedType: 'Two Queen', amenities: ['Wi-Fi', 'Air Conditioning', 'TV'], image: 'photo-1590490360182-c33d57733427', status: 'available' },
  { roomNumber: '303', roomType: 'Family Room', description: 'A comfortable room built for families.', pricePerNight: 5200, capacity: 4, bedType: 'Two Queen', amenities: ['Wi-Fi', 'Air Conditioning', 'TV'], image: 'photo-1590490360182-c33d57733427', status: 'available' },
  { roomNumber: '401', roomType: 'Standard Room', description: 'A simple, well-kept room for a short stay.', pricePerNight: 3200, capacity: 2, bedType: 'Queen', amenities: ['Wi-Fi', 'Air Conditioning'], image: 'photo-1566073771259-6a8506099945', status: 'available' },
  { roomNumber: '402', roomType: 'Standard Room', description: 'A simple, well-kept room for a short stay.', pricePerNight: 3200, capacity: 2, bedType: 'Queen', amenities: ['Wi-Fi', 'Air Conditioning'], image: 'photo-1566073771259-6a8506099945', status: 'available' },
  { roomNumber: '403', roomType: 'Standard Room', description: 'A simple, well-kept room for a short stay.', pricePerNight: 3200, capacity: 2, bedType: 'Queen', amenities: ['Wi-Fi', 'Air Conditioning'], image: 'photo-1566073771259-6a8506099945', status: 'available' },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    await User.deleteMany({});
    await Room.deleteMany({});
    console.log('Cleared existing users and rooms.');

    // Passwords are plain text here on purpose — the User model's
    // pre('save') hook hashes them automatically before saving.
    await User.create([
      { name: 'Admin User', email: 'admin@hotel.com', password: 'admin123', role: 'admin' },
      { name: 'Staff User', email: 'staff@hotel.com', password: 'staff123', role: 'staff' },
      { name: 'Guest User', email: 'guest@hotel.com', password: 'guest123', role: 'guest' },
    ]);
    console.log('Seeded users: admin@hotel.com / staff@hotel.com / guest@hotel.com (all use their role + "123" as password)');

    await Room.insertMany(rooms);
    console.log(`Seeded ${rooms.length} rooms.`);

    console.log('Seeding complete.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
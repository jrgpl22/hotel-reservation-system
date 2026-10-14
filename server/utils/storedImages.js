import Image from '../models/Image.js';
import Room from '../models/Room.js';
import User from '../models/User.js';

const STORED_IMAGE_PATH = /^\/api\/images\/([0-9a-f]{24})$/;

// Returns the image id if the value is one of our own upload paths, otherwise null
export const getStoredImageId = (value) => {
  if (typeof value !== 'string') return null;
  const match = value.match(STORED_IMAGE_PATH);
  return match ? match[1] : null;
};

// Removes an uploaded image, but only if no room or user still points at it.
// Never throws: a failed cleanup should not fail the request that triggered it.
export const deleteStoredImageIfUnused = async (path) => {
  const id = getStoredImageId(path);
  if (!id) return;

  try {
    const [usedByRoom, usedByUser] = await Promise.all([
      Room.exists({ $or: [{ image: path }, { images: path }] }),
      User.exists({ avatar: path }),
    ]);
    if (!usedByRoom && !usedByUser) await Image.findByIdAndDelete(id);
  } catch (error) {
    console.error('Image cleanup failed:', error.message);
  }
};
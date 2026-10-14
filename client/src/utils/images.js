const API_ORIGIN = (() => {
  try {
    return new URL(import.meta.env.VITE_API_URL || 'http://localhost:5000/api').origin;
  } catch {
    return 'http://localhost:5000';
  }
})();

export const FALLBACK_ROOM_IMAGE =
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80';

// Turns whatever is stored in the database into a displayable URL:
//   "/api/images/<id>"  -> an upload served by our own API
//   "https://..."       -> used as-is
//   "photo-1611..."     -> a legacy Unsplash photo id (the seeded rooms)
export const resolveImageUrl = (value, { width = 600, fallback = '' } = {}) => {
  if (!value) return fallback;
  if (value.startsWith('/api/images/')) return `${API_ORIGIN}${value}`;
  if (/^https?:\/\//i.test(value)) return value;
  return `https://images.unsplash.com/${value}?auto=format&fit=crop&w=${width}&q=80`;
};

// Shrinks a photo in the browser before upload: phone photos are often 5 MB or more.
export const prepareImageForUpload = async (file, { maxSize = 1600, quality = 0.85 } = {}) => {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  context.fillStyle = '#ffffff'; // transparent PNGs would otherwise turn black as JPEG
  context.fillRect(0, 0, width, height);
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close?.();

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Unable to process this image'))),
      'image/jpeg',
      quality
    );
  });
};

// Rooms created before multi-photo support only have `image`; newer rooms use `images`
export const getRoomImages = (room) => {
  if (!room) return [];
  if (Array.isArray(room.images) && room.images.length > 0) return room.images;
  return room.image ? [room.image] : [];
};
export const USER_ROLES = {
  GUEST: 'guest',
  STAFF: 'staff',
  ADMIN: 'admin',
};
export const ROLE_LABELS = {
  [USER_ROLES.GUEST]: 'Guest',
  [USER_ROLES.STAFF]: 'Staff',
  [USER_ROLES.ADMIN]: 'Admin',
};
export const ROOM_STATUS = {
  AVAILABLE: 'available',
  MAINTENANCE: 'maintenance',
};

export const RESERVATION_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
};

export const TOKEN_KEY = 'hotel_token';
export const BRAND_NAME = 'Hearts'; // placeholder — change here only
// Where each role lands after sign-in or when bounced from a page they can't open
export const getHomePath = (role) => (role === USER_ROLES.GUEST ? '/' : '/admin');
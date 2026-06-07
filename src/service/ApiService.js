// ============================================================
//  POOLRIDE — API Service (ALL API CALLS LIVE HERE)
//  Replace BASE_URL and implement real endpoints easily.
//  Every function follows: { data, error, status } pattern.
// ============================================================

import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── CONFIG ──────────────────────────────────────────────────
const BASE_URL = 'https://your-api.com/api/v1'; // 🔧 REPLACE THIS
const TIMEOUT_MS = 15000;

// ─── HELPERS ─────────────────────────────────────────────────
const getToken = async () => {
  try {
    return await AsyncStorage.getItem('authToken');
  } catch {
    return null;
  }
};

const buildHeaders = async (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  if (includeAuth) {
    const token = await getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const request = async (method, endpoint, body = null, auth = true) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const options = {
      method,
      headers: await buildHeaders(auth),
      signal: controller.signal,
    };
    if (body) options.body = JSON.stringify(body);

    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    clearTimeout(timeoutId);

    const data = await response.json();

    if (!response.ok) {
      return { data: null, error: data?.message || 'Something went wrong', status: response.status };
    }

    return { data, error: null, status: response.status };
  } catch (err) {
    if (err.name === 'AbortError') {
      return { data: null, error: 'Request timed out. Please try again.', status: 408 };
    }
    return { data: null, error: err.message || 'Network error', status: 0 };
  }
};

// ═══════════════════════════════════════════════════════════
//  AUTH APIS
// ═══════════════════════════════════════════════════════════

export const authAPI = {
  // POST /auth/register
  register: async ({ name, email, phone, password }) =>
    request('POST', '/auth/register', { name, email, phone, password }, false),

  // POST /auth/login
  login: async ({ email, password }) =>
    request('POST', '/auth/login', { email, password }, false),

  // POST /auth/login/phone
  loginWithPhone: async ({ phone }) =>
    request('POST', '/auth/login/phone', { phone }, false),

  // POST /auth/otp/verify
  verifyOTP: async ({ phone, otp }) =>
    request('POST', '/auth/otp/verify', { phone, otp }, false),

  // POST /auth/otp/resend
  resendOTP: async ({ phone }) =>
    request('POST', '/auth/otp/resend', { phone }, false),

  // POST /auth/logout
  logout: async () => request('POST', '/auth/logout'),

  // POST /auth/refresh-token
  refreshToken: async ({ refreshToken }) =>
    request('POST', '/auth/refresh-token', { refreshToken }, false),

  // POST /auth/forgot-password
  forgotPassword: async ({ email }) =>
    request('POST', '/auth/forgot-password', { email }, false),

  // POST /auth/reset-password
  resetPassword: async ({ token, password }) =>
    request('POST', '/auth/reset-password', { token, password }, false),

  // POST /auth/social/google
  googleLogin: async ({ idToken }) =>
    request('POST', '/auth/social/google', { idToken }, false),
};

// ═══════════════════════════════════════════════════════════
//  USER APIS
// ═══════════════════════════════════════════════════════════

export const userAPI = {
  // GET /user/me
  getProfile: async () => request('GET', '/user/me'),

  // PUT /user/me
  updateProfile: async (profileData) => request('PUT', '/user/me', profileData),

  // PUT /user/me/avatar
  updateAvatar: async ({ base64Image, mimeType }) =>
    request('PUT', '/user/me/avatar', { base64Image, mimeType }),

  // GET /user/me/reviews
  getMyReviews: async () => request('GET', '/user/me/reviews'),

  // GET /user/:id
  getUserById: async (userId) => request('GET', `/user/${userId}`),

  // GET /user/:id/reviews
  getUserReviews: async (userId) => request('GET', `/user/${userId}/reviews`),

  // PUT /user/me/preferences
  updatePreferences: async (prefs) => request('PUT', '/user/me/preferences', prefs),

  // POST /user/me/verify/id
  uploadIdDocument: async ({ documentType, base64Front, base64Back }) =>
    request('POST', '/user/me/verify/id', { documentType, base64Front, base64Back }),

  // GET /user/me/wallet
  getWallet: async () => request('GET', '/user/me/wallet'),

  // GET /user/me/transactions
  getTransactions: async ({ page = 1, limit = 20 } = {}) =>
    request('GET', `/user/me/transactions?page=${page}&limit=${limit}`),
};

// ═══════════════════════════════════════════════════════════
//  RIDE SEARCH APIS
// ═══════════════════════════════════════════════════════════

export const searchAPI = {
  // GET /rides/search?from=&to=&date=&seats=
  searchRides: async ({ from, to, date, seats = 1, page = 1 }) =>
    request('GET', `/rides/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${date}&seats=${seats}&page=${page}`),

  // GET /rides/search/suggestions?q=
  getLocationSuggestions: async (query) =>
    request('GET', `/rides/search/suggestions?q=${encodeURIComponent(query)}`),

  // GET /rides/popular-routes
  getPopularRoutes: async () => request('GET', '/rides/popular-routes'),

  // GET /rides/recent-searches
  getRecentSearches: async () => request('GET', '/rides/recent-searches'),
};

// ═══════════════════════════════════════════════════════════
//  RIDE APIS (As Passenger)
// ═══════════════════════════════════════════════════════════

export const rideAPI = {
  // GET /rides/:id
  getRideDetails: async (rideId) => request('GET', `/rides/${rideId}`),

  // POST /rides/:id/book
  bookRide: async ({ rideId, seats, pickupPoint, dropPoint, paymentMethod }) =>
    request('POST', `/rides/${rideId}/book`, { seats, pickupPoint, dropPoint, paymentMethod }),

  // DELETE /bookings/:bookingId
  cancelBooking: async (bookingId) => request('DELETE', `/bookings/${bookingId}`),

  // GET /bookings/upcoming
  getUpcomingRides: async () => request('GET', '/bookings/upcoming'),

  // GET /bookings/past
  getPastRides: async ({ page = 1, limit = 10 } = {}) =>
    request('GET', `/bookings/past?page=${page}&limit=${limit}`),

  // GET /bookings/:bookingId
  getBookingDetails: async (bookingId) => request('GET', `/bookings/${bookingId}`),

  // POST /bookings/:bookingId/review
  leaveReview: async ({ bookingId, rating, comment, reviewType }) =>
    request('POST', `/bookings/${bookingId}/review`, { rating, comment, reviewType }),

  // POST /bookings/:bookingId/report
  reportIssue: async ({ bookingId, issueType, description }) =>
    request('POST', `/bookings/${bookingId}/report`, { issueType, description }),
};

// ═══════════════════════════════════════════════════════════
//  DRIVER / OFFER RIDE APIS
// ═══════════════════════════════════════════════════════════

export const driverAPI = {
  // POST /driver/register
  registerAsDriver: async ({ licenseNumber, licenseExpiry, vehicleInfo }) =>
    request('POST', '/driver/register', { licenseNumber, licenseExpiry, vehicleInfo }),

  // GET /driver/me
  getDriverProfile: async () => request('GET', '/driver/me'),

  // POST /rides/offer
  offerRide: async ({ from, to, date, time, seats, pricePerSeat, route, preferences }) =>
    request('POST', '/rides/offer', { from, to, date, time, seats, pricePerSeat, route, preferences }),

  // PUT /rides/:rideId
  updateRide: async (rideId, updates) => request('PUT', `/rides/${rideId}`, updates),

  // DELETE /rides/:rideId
  cancelRide: async (rideId) => request('DELETE', `/rides/${rideId}`),

  // GET /rides/my-offers
  getMyOfferedRides: async () => request('GET', '/rides/my-offers'),

  // GET /rides/:rideId/passengers
  getRidePassengers: async (rideId) => request('GET', `/rides/${rideId}/passengers`),

  // PUT /rides/:rideId/booking/:bookingId/approve
  approvePassenger: async (rideId, bookingId) =>
    request('PUT', `/rides/${rideId}/booking/${bookingId}/approve`),

  // PUT /rides/:rideId/booking/:bookingId/reject
  rejectPassenger: async (rideId, bookingId) =>
    request('PUT', `/rides/${rideId}/booking/${bookingId}/reject`),

  // POST /rides/:rideId/start
  startRide: async (rideId) => request('POST', `/rides/${rideId}/start`),

  // POST /rides/:rideId/complete
  completeRide: async (rideId) => request('POST', `/rides/${rideId}/complete`),

  // GET /driver/earnings
  getEarnings: async ({ period = 'monthly' } = {}) =>
    request('GET', `/driver/earnings?period=${period}`),

  // POST /driver/vehicle
  addVehicle: async (vehicleData) => request('POST', '/driver/vehicle', vehicleData),

  // PUT /driver/vehicle/:vehicleId
  updateVehicle: async (vehicleId, vehicleData) =>
    request('PUT', `/driver/vehicle/${vehicleId}`, vehicleData),
};

// ═══════════════════════════════════════════════════════════
//  REAL-TIME TRACKING (WebSocket helpers)
// ═══════════════════════════════════════════════════════════

export const trackingAPI = {
  // GET /rides/:rideId/track (polling fallback)
  getTrackingData: async (rideId) => request('GET', `/rides/${rideId}/track`),

  // POST /rides/:rideId/location (driver updates location)
  updateDriverLocation: async ({ rideId, latitude, longitude, heading }) =>
    request('POST', `/rides/${rideId}/location`, { latitude, longitude, heading }),

  // WebSocket URL builder
  getTrackingWSUrl: (rideId, token) =>
    `wss://your-api.com/ws/track/${rideId}?token=${token}`, // 🔧 REPLACE
};

// ═══════════════════════════════════════════════════════════
//  NOTIFICATIONS APIS
// ═══════════════════════════════════════════════════════════

export const notificationAPI = {
  // GET /notifications
  getNotifications: async ({ page = 1, limit = 20 } = {}) =>
    request('GET', `/notifications?page=${page}&limit=${limit}`),

  // PUT /notifications/:id/read
  markAsRead: async (notifId) => request('PUT', `/notifications/${notifId}/read`),

  // PUT /notifications/read-all
  markAllAsRead: async () => request('PUT', '/notifications/read-all'),

  // POST /notifications/device-token
  registerDeviceToken: async ({ token, platform }) =>
    request('POST', '/notifications/device-token', { token, platform }),
};

// ═══════════════════════════════════════════════════════════
//  PAYMENT APIS
// ═══════════════════════════════════════════════════════════

export const paymentAPI = {
  // POST /payments/create-order
  createPaymentOrder: async ({ bookingId, amount, currency = 'INR' }) =>
    request('POST', '/payments/create-order', { bookingId, amount, currency }),

  // POST /payments/verify
  verifyPayment: async ({ orderId, paymentId, signature }) =>
    request('POST', '/payments/verify', { orderId, paymentId, signature }),

  // GET /payments/methods
  getPaymentMethods: async () => request('GET', '/payments/methods'),

  // POST /payments/wallet/add-money
  addMoneyToWallet: async ({ amount }) =>
    request('POST', '/payments/wallet/add-money', { amount }),
};

// ═══════════════════════════════════════════════════════════
//  CHAT / MESSAGING APIS
// ═══════════════════════════════════════════════════════════

export const chatAPI = {
  // GET /chats
  getChats: async () => request('GET', '/chats'),

  // GET /chats/:rideId
  getChatMessages: async (rideId) => request('GET', `/chats/${rideId}`),

  // POST /chats/:rideId/message
  sendMessage: async ({ rideId, message, type = 'text' }) =>
    request('POST', `/chats/${rideId}/message`, { message, type }),

  // WebSocket URL builder
  getChatWSUrl: (rideId, token) =>
    `wss://your-api.com/ws/chat/${rideId}?token=${token}`, // 🔧 REPLACE
};

// ═══════════════════════════════════════════════════════════
//  MISC / UTILITY APIS
// ═══════════════════════════════════════════════════════════

export const miscAPI = {
  // GET /config/app
  getAppConfig: async () => request('GET', '/config/app', null, false),

  // POST /support/ticket
  createSupportTicket: async ({ subject, description, category }) =>
    request('POST', '/support/ticket', { subject, description, category }),

  // GET /faqs
  getFAQs: async () => request('GET', '/faqs', null, false),
};
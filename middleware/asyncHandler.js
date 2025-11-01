// middleware/asyncHandler.js

/**
 * Wraps async route handlers to catch errors and forward to Express error middleware.
 * Adds logging for better visibility in serverless environments like Vercel.
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    console.error('❌ Async error caught:', err.message);
    next(err);
  });
};

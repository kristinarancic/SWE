import { rateLimit } from 'express-rate-limit';
export const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 login requests per window per minute
  message: {
    message:
      'Too many login attempts from this IP, please try again after a 60 second pause!',
  },
  handler: (req, res, next, options) => {
    // Add logEvents
    res.status(options.statusCode).send(options.message);
  },
  standardHeaders: true, // Return rate limit info in the 'RateLimit-*' headers
  legacyHeaders: false, // Disable 'X-RateLimit-*' headers
});

const rateLimit = require('express-rate-limit');

// General API Rate limit: 100 req/min per IP
const generalLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 100, 
  message: { message: 'Too many requests, please try again later.' },
  standardHeaders: true, 
  legacyHeaders: false, 
});

// Ingest Endpoints Rate Limit: 1000 req/min per IP
const ingestLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 1000, 
  message: { message: 'Too many ingest requests.' },
});

// SMS Webhook Rate limit: 10 req/min per IP
const smsLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { message: 'Too many SMS reports sent from this phone.' },
});

module.exports = {
  generalLimiter,
  ingestLimiter,
  smsLimiter
};

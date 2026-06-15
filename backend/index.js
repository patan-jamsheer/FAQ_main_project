// backend/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');

// 1. Import our new centralized config
const config = require('./config/env'); 
require('./config/passport');

const authRoutes = require('./routes/auth');
const faqRoutes = require('./routes/faq');

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

const allowedOrigins = config.clientUrl.split(',').map(s => s.trim());

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.json()); 

// --- NEW SECURITY MIDDLEWARES ---

// 1. Helmet: Hides Express from hackers and secures HTTP headers
app.use(helmet());

// 2. Global Rate Limiter: Prevent DDoS attacks
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  
  // Keep it strict (100) for production, but give yourself 5,000 requests for local testing!
  max: config.nodeEnv === 'development' ? 5000 : 100, 
  
  message: { message: 'Too many requests from this IP, please try again after 15 minutes.' },
  standardHeaders: true, 
  legacyHeaders: false,
});

// Apply the rate limiter to all routes
app.use(globalLimiter);

// 3. Strict Rate Limiter for AI Chat & Adding FAQs
const strictLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  
  // Relax the strict limit during development as well
  max: config.nodeEnv === 'development' ? 500 : 10, 
  
  message: { message: 'Please slow down your requests.' }
});
// Apply strict limits to specific routes *before* they hit the router
app.use('/faq/chat', strictLimiter);
app.use('/faq/add', strictLimiter);

// 4. View-Count Limiter: Prevent view inflation from scripts
// Allows max 30 view increments per IP per minute
const viewLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: config.nodeEnv === 'development' ? 500 : 30,
  message: { message: 'Too many view requests. Please slow down.' }
});
app.use('/faq/:id/view', viewLimiter);

// --- END SECURITY MIDDLEWARES ---
app.use(passport.initialize());

// Note: Removed the runMigrations() function from startup. 
// Migrations should be handled by a script, not on every server boot.

mongoose.connect(config.mongoUri)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(config.port, () => console.log(`🚀 Server running on port ${config.port}`));
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err);
    process.exit(1);
  });

app.use('/auth', authRoutes);
app.use('/faq', faqRoutes);

app.get('/', (req, res) => res.send('FAQ Support Platform API'));

// 2. Add a Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack); // Logs the actual error in your terminal
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: config.nodeEnv === 'development' ? err.message : undefined // Hides details from users in production
  });
});
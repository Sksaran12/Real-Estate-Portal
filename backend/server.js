const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');
const Property = require('./models/Property');
const seedData = require('./utils/seedData');

dotenv.config();

// Ensure JWT Secret is present, fallback to production secret if missing
if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'secret') {
  process.env.JWT_SECRET = 'dfdcef88eebc94157ffa069e08d2ffab68a73222d95bfb8529baa31d2051810f1b5d450d37ccacd3eec084f5be568655215e30bbea6c6930a64cd79997c77466';
}

const app = express();

// Enable Trust Proxy for Render / Vercel load balancers (CRITICAL for rate limiting and IP detection)
app.set('trust proxy', 1);

// Security Headers with Helmet
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// Rate Limiting: Global API rate limiter (100 requests per 15 minutes per IP)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes.' },
});

// Stricter Rate Limiter for Authentication & AI endpoints (15 requests per 15 mins)
const strictAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many authentication/AI attempts, please try again after 15 minutes.' },
});

// Production CORS setup - Reflect origin dynamically to prevent browser wildcard credentials error
app.use((req, res, next) => {
  const origin = req.headers.origin;
  res.header('Access-Control-Allow-Origin', origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Body Parsers with safe payload size limits
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Apply Rate Limiters
app.use('/api', globalLimiter);
app.use('/api/auth/login', strictAuthLimiter);
app.use('/api/auth/register', strictAuthLimiter);
app.use('/api/ai', strictAuthLimiter);

// Root Status & Health Check endpoints
app.get('/', (req, res) => {
  res.json({ success: true, status: 'ok', message: 'EstateHub Real Estate Portal API is running live' });
});

app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'ok', message: 'EstateHub Secure API is running' });
});

// Mount API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/properties', require('./routes/propertyRoutes'));
app.use('/api/favorites', require('./routes/favoriteRoutes'));
app.use('/api/inquiries', require('./routes/inquiryRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

// Error Handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Listen explicitly on host '0.0.0.0' for cloud container load balancer compatibility (Render, Railway, Docker)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 EstateHub Secure Server running on host 0.0.0.0 and port ${PORT}`);

  // Connect to MongoDB Atlas in background
  connectDB().then(async () => {
    try {
      const propertyCount = await Property.countDocuments();
      if (propertyCount === 0) {
        console.log('Database empty on initial boot. Running automatic seed...');
        await seedData();
      }
    } catch (err) {
      console.error('Auto seed check error:', err.message);
    }
  });

  // Self-Ping Keepalive (pings server every 10 minutes to prevent Render free instance from sleeping)
  if (process.env.NODE_ENV === 'production') {
    setInterval(async () => {
      try {
        await fetch(`http://127.0.0.1:${PORT}/api/health`);
      } catch (e) {
        // Ignore ping errors
      }
    }, 10 * 60 * 1000);
  }
});

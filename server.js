const crypto = require('crypto');
const mongoose = require('mongoose');

global.crypto = global.crypto || crypto;
globalThis.crypto = globalThis.crypto || crypto;

const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const requiredEnv = ['DATABASE', 'DATABASE_PASSWORD', 'JWT_SECRET', 'JWT_EXPIRES_IN', 'JWT_COOKIE_EXPIRES_IN'];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);
if (missingEnv.length > 0) {
  console.error('Missing required environment variables:', missingEnv.join(', '));
}

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
  process.exit(1);
});

const app = require('./app');

const db = process.env.DATABASE
  ? process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD || '')
  : null;

if (!db) {
  console.error('DATABASE environment variable is not defined');
} else {
  mongoose
    .connect(db)
    .then(async () => {
      console.log('DB connection successful!');
    })
    .catch((err) => {
      console.error('DB connection error:', err);
    });
}

if (require.main === module && !process.env.VERCEL) {
  const PORT = process.env.PORT || 8000;
  const server = app.listen(PORT, () => console.log(`listening from port ${PORT}...`));

  process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION:', err);
    server.close(() => {
      process.exit(1);
    });
  });
  process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });
  });
}

module.exports = app;

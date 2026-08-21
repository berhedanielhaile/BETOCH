const crypto = require('crypto');
const mongoose = require('mongoose');

global.crypto = global.crypto || crypto;
globalThis.crypto = globalThis.crypto || crypto;

const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION: 💥 shutting down');
  console.log(err.name, err.message, err.stack);
  process.exit(1);
});

const app = require('./app');

const db = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose
  .connect(db)
  .then(async () => {
    console.log('DB connection successful!');
  })
  .catch((err) => console.log('DB connection error:', err));

if (require.main === module && !process.env.VERCEL) {
  const PORT = process.env.PORT || 8000;
  const server = app.listen(PORT, () => console.log(`listening from port ${PORT}...`));

  process.on('unhandledRejection', (err) => {
    console.log('UNHANDELD REDJECTION: 💥 shutting down');
    console.log(err.name, err.message);
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

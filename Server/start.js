const killPort = require('kill-port');
const { startServer } = require('./server');

const PORT = process.env.PORT || 3000;

const run = async () => {
  try {
    await killPort(PORT, 'tcp');
    console.log(`Port ${PORT} cleared`);
  } catch (error) {
    console.warn(`Could not clear port ${PORT}:`, error.message);
  }

  startServer();
};

run();

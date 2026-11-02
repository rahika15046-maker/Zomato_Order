/**
 * Application Entrypoint
 * Starts the HTTP server on configured port.
 */

require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🍽️  Zomato Orders Server is running on port ${PORT}`);
    console.log(`🔗 Endpoint: http://localhost:${PORT}/api/orders`);
    console.log(`🏥 Health:   http://localhost:${PORT}/health`);
    console.log(`====================================================`);
});

// Graceful termination handling
process.on('SIGTERM', () => {
    console.log('[INFO] SIGTERM signal received. Closing HTTP server gracefully.');
    server.close(() => {
        console.log('[INFO] HTTP server closed.');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('[INFO] SIGINT signal received. Closing HTTP server gracefully.');
    server.close(() => {
        console.log('[INFO] HTTP server closed.');
        process.exit(0);
    });
});

module.exports = server;

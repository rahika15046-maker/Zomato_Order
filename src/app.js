/**
 * Express Application Configuration
 * Assembles middleware, routes, health monitoring, and global error handling.
 */

const express = require('express');
const db = require('./config/db');
const orderRoutes = require('./routes/orderRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health Check Endpoint (evaluates both Express server and live MySQL connectivity)
app.get('/health', async (req, res) => {
    try {
        await db.query('SELECT 1 AS health');
        res.status(200).json({
            status: 'UP',
            server: 'RUNNING',
            database: 'CONNECTED',
            timestamp: new Date().toISOString(),
            service: 'Zomato Orders API'
        });
    } catch (err) {
        res.status(503).json({
            status: 'DEGRADED',
            server: 'RUNNING',
            database: 'DISCONNECTED',
            error: err.message,
            timestamp: new Date().toISOString(),
            service: 'Zomato Orders API'
        });
    }
});

// Mount Order Routes at /api
// Endpoint exposed: GET /api/orders
app.use('/api', orderRoutes);

// Root informational endpoint
app.get('/', (req, res) => {
    res.status(200).json({
        name: 'Zomato Orders Pagination Server',
        version: '1.0.0',
        endpoint: 'GET /api/orders?limit=4&offset=1',
        healthCheck: 'GET /health'
    });
});

// Catch-all 404 handler for undefined routes
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Cannot ${req.method} ${req.originalUrl}`
    });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

module.exports = app;

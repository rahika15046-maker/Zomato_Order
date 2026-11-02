/**
 * Express Application Configuration
 * Assembles middleware, routes, and global error handling.
 */

const express = require('express');
const orderRoutes = require('./routes/orderRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health Check Endpoint (useful for cloud platforms like Render / Railway)
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        timestamp: new Date().toISOString(),
        service: 'Zomato Orders API'
    });
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

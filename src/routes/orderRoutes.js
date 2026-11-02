/**
 * Order Routes
 * Defines API routing endpoints for orders.
 */

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// GET /api/orders?limit=&offset=
router.get('/orders', orderController.getOrders);

module.exports = router;

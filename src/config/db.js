/**
 * Database Configuration & Connection Pool
 * Uses mysql2/promise for performant, non-blocking asynchronous MySQL operations.
 */

require('dotenv').config();
const mysql = require('mysql2/promise');

const poolConfig = process.env.DATABASE_URL
    ? process.env.DATABASE_URL
    : {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '',
        database: process.env.DB_NAME || 'zomato_orders',
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0
    };

const pool = mysql.createPool(poolConfig);

// Verify database connectivity on startup
pool.getConnection()
    .then((conn) => {
        console.log(`[DATABASE] Connection pool established with MySQL database: "${process.env.DB_NAME || 'zomato_orders'}"`);
        conn.release();
    })
    .catch((err) => {
        console.error('[DATABASE ERROR] Failed to connect to MySQL database:', err.message);
    });

module.exports = pool;

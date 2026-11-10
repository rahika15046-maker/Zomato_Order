/**
 * Database Configuration & Connection Pool
 * Uses mysql2/promise for performant, non-blocking asynchronous MySQL operations.
 * Supports standard DB_* variables, TiDB Cloud, Railway, and generic MySQL providers.
 */

require('dotenv').config();
const mysql = require('mysql2/promise');

const connectionUri = process.env.DATABASE_URL || process.env.MYSQL_URL;

// Determine if SSL is required (TiDB Cloud, AWS RDS, or explicit DB_SSL flag)
const isCloudDatabase = (
    process.env.DB_SSL === 'true' ||
    (process.env.DB_HOST && process.env.DB_HOST.includes('tidbcloud.com')) ||
    (process.env.DB_HOST && process.env.DB_HOST !== 'localhost' && process.env.DB_HOST !== '127.0.0.1')
);

const poolConfig = connectionUri
    ? connectionUri
    : {
        host: process.env.DB_HOST || process.env.MYSQLHOST || 'localhost',
        user: process.env.DB_USER || process.env.MYSQLUSER || 'root',
        password: process.env.DB_PASSWORD !== undefined
            ? process.env.DB_PASSWORD
            : (process.env.MYSQLPASSWORD !== undefined ? process.env.MYSQLPASSWORD : ''),
        database: process.env.DB_NAME || process.env.MYSQLDATABASE || 'zomato_orders',
        port: process.env.DB_PORT
            ? parseInt(process.env.DB_PORT, 10)
            : (process.env.MYSQLPORT ? parseInt(process.env.MYSQLPORT, 10) : 3306),
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0,
        ...(isCloudDatabase ? { ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true } } : {})
    };

const pool = mysql.createPool(poolConfig);

// Verify database connectivity on startup
pool.getConnection()
    .then((conn) => {
        const dbName = process.env.DB_NAME || process.env.MYSQLDATABASE || 'zomato_orders';
        console.log(`[DATABASE] Connection pool established with MySQL database: "${dbName}"`);
        conn.release();
    })
    .catch((err) => {
        console.error('[DATABASE ERROR] Failed to connect to MySQL database:', err.message);
    });

module.exports = pool;

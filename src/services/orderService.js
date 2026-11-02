/**
 * Order Service
 * Handles database operations for restaurant orders.
 */

const pool = require('../config/db');

/**
 * Fetch paginated orders from MySQL using parameterized LIMIT and OFFSET
 * 
 * @param {number} limit - Number of records to return
 * @param {number} offset - Number of records to skip
 * @returns {Promise<Array>} Raw array of MySQL records
 */
async function getPaginatedOrders(limit, offset) {
    // Parameterized SQL query strictly adhering to SQL standards
    const query = 'SELECT * FROM orders LIMIT ? OFFSET ?';
    
    // Execute query with validated numeric parameters
    const [rows] = await pool.query(query, [Number(limit), Number(offset)]);
    
    // Return the actual raw MySQL records array without modifying structure
    return rows;
}

module.exports = {
    getPaginatedOrders
};

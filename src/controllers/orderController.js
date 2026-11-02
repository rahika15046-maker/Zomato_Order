/**
 * Order Controller
 * Handles request validation, parameter parsing, and response dispatch.
 */

const orderService = require('../services/orderService');

// Default pagination constraints
const DEFAULT_LIMIT = 10;
const DEFAULT_OFFSET = 0;

/**
 * Validates if a value is strictly a positive integer (> 0).
 * Rejects strings, decimals (floats), zero, and negatives.
 */
function isPositiveInteger(value) {
    if (value === undefined || value === null || value === '') return false;
    const str = String(value).trim();
    if (!/^[1-9]\d*$/.test(str)) return false;
    const num = Number(str);
    return Number.isSafeInteger(num) && num > 0;
}

/**
 * Validates if a value is a non-negative integer (>= 0).
 * Accepts 0 and positive integers; rejects strings, decimals, and negatives.
 */
function isNonNegativeInteger(value) {
    if (value === undefined || value === null || value === '') return false;
    const str = String(value).trim();
    if (!/^(0|[1-9]\d*)$/.test(str)) return false;
    const num = Number(str);
    return Number.isSafeInteger(num) && num >= 0;
}

/**
 * GET /api/orders
 * Exposes restaurant orders with offset and limit pagination
 */
async function getOrders(req, res, next) {
    try {
        const rawLimit = req.query.limit;
        const rawOffset = req.query.offset;

        const isLimitProvided = rawLimit !== undefined && rawLimit !== null && String(rawLimit).trim() !== '';
        const isOffsetProvided = rawOffset !== undefined && rawOffset !== null && String(rawOffset).trim() !== '';

        let limit = DEFAULT_LIMIT;
        let offset = DEFAULT_OFFSET;

        // Check validity of supplied parameters
        const isLimitValid = !isLimitProvided || isPositiveInteger(rawLimit);
        const isOffsetValid = !isOffsetProvided || isNonNegativeInteger(rawOffset);

        // Rule: If either supplied parameter is invalid, reset BOTH parameters to defaults
        if (!isLimitValid || !isOffsetValid) {
            console.log(`[VALIDATION] Invalid parameter(s) encountered (limit: "${rawLimit}", offset: "${rawOffset}"). Resetting both to defaults (limit: ${DEFAULT_LIMIT}, offset: ${DEFAULT_OFFSET}).`);
            limit = DEFAULT_LIMIT;
            offset = DEFAULT_OFFSET;
        } else {
            // Apply supplied valid value or fallback to default
            limit = isLimitProvided ? parseInt(rawLimit, 10) : DEFAULT_LIMIT;
            offset = isOffsetProvided ? parseInt(rawOffset, 10) : DEFAULT_OFFSET;
        }

        // Fetch paginated records from MySQL
        const orders = await orderService.getPaginatedOrders(limit, offset);

        // Return status 200 with the exact MySQL records array
        return res.status(200).json(orders);
    } catch (error) {
        // Forward database or unexpected errors to centralized error handler
        return next(error);
    }
}

module.exports = {
    getOrders,
    isPositiveInteger,
    isNonNegativeInteger
};

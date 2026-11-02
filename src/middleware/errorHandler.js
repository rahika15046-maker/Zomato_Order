/**
 * Centralized Error Handling Middleware
 * Intercepts uncaught exceptions and database errors, ensuring graceful HTTP 500 responses.
 */

function errorHandler(err, req, res, next) {
    console.error('[SERVER ERROR]', err.message || err);

    // If headers already sent, delegate to default Express handler
    if (res.headersSent) {
        return next(err);
    }

    // Return safe standardized error response without exposing internal server secrets
    return res.status(500).json({
        error: 'Internal Server Error',
        message: err.message || 'An unexpected error occurred on the server.'
    });
}

module.exports = errorHandler;

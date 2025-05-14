const errorResponse = require('../utils/common/error-response');
const AppError = require('../utils/error/app-error');

const globalErrorHandler = (err, req, res, next) => {
  console.error('🔥 Global Error:', err);

  if (err instanceof AppError) {
    return errorResponse(res, err.message, err.statusCode, err.explanation);
  }

  return errorResponse(res, 'Internal Server Error', 500, err.message || 'Unexpected error occurred');
};

module.exports = globalErrorHandler;
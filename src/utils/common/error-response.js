// ✅ Correct export
const errorResponse = ({ message, error }) => ({
    success: false,
    message,
    error,
  });
  
  module.exports = errorResponse;
  
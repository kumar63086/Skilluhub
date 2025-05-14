class AppError extends Error {
  constructor(message, statusCode = 500) {
      super(message);
      this.statusCode = statusCode;
      this.explanation = message;
      this.name = this.constructor.name;

      Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;



// 0SVITY2K250001
// 0SVITY2K250002
// 0SVITY2K250003
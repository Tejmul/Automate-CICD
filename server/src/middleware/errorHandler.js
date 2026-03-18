function errorHandler(err, req, res, next) {
  void next;
  const statusCode =
    typeof err.statusCode === 'number' ? err.statusCode : typeof err.status === 'number' ? err.status : 500;

  const payload = {
    status: 'error',
    message: err.message || 'Internal Server Error',
  };

  if (process.env.NODE_ENV !== 'production') {
    payload.details = err.details;
    payload.stack = err.stack;
  }

  res.status(statusCode).json(payload);
}

module.exports = { errorHandler };


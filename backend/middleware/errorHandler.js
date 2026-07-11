class ApiError extends Error {
  constructor(statusCode, message, data = {}) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;
  }
}

function notFoundHandler(req, res, next) {
  next(new ApiError(404, 'Rota não encontrada.', {}));
}

function globalErrorHandler(error, req, res, next) {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Erro interno do servidor.';
  const data = error.data || {};

  return res.status(statusCode).json({
    success: false,
    message,
    data
  });
}

module.exports = {
  ApiError,
  notFoundHandler,
  globalErrorHandler
};
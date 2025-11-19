export default function errorHandler(err, req, res, next) {
  // Basic error handler with sane defaults
  const status = err.status || 500;
  const message = err.message || 'Serverfehler';
  if (process.env.NODE_ENV !== 'test') {
    console.error('[Error]', message, err.stack || '');
  }
  res.status(status).json({ msg: message });
}

export const errorHandler = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message).join(', ');
    return res.status(400).json({ success: false, message: messages });
  }
  if (err.code === 11000) {
    return res.status(400).json({ success: false, message: 'Duplicate field value' });
  }
  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Server error'
  });
};

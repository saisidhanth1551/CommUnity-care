// Middleware to check if the user is a worker
const isWorker = (req, res, next) => {
  if (req.user && req.user.role === 'worker') {
    return next();  // Proceed to the next middleware or route handler
  }
  // Return a 403 Forbidden status with a message
  res.status(403).json({ message: 'Access denied. Worker role required.' });
};

// Middleware to check if the user is a customer
const isCustomer = (req, res, next) => {
  if (req.user && req.user.role === 'customer') {
    return next();  // Proceed to the next middleware or route handler
  }
  // Return a 403 Forbidden status with a message
  res.status(403).json({ message: 'Access denied. Customer role required.' });
};

export { isWorker, isCustomer };

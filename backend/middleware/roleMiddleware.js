const isCustomer = (req, res, next) => {
  if (req.user && req.user.roles.includes('customer')) {
    return next();
  }
  res.status(403).json({ message: 'Access denied. Customer role required.' });
};

const isWorker = (req, res, next) => {
  if (req.user && req.user.roles.includes('worker')) {
    return next();
  }
  res.status(403).json({ message: 'Access denied. Worker role required.' });
};

export { isCustomer, isWorker };

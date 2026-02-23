const verifyAdmin = async (req, res, next) => {
  try {
    const payload = req.payload;

    if (!payload) {
      return res.status(401).json({ message: 'Access denied' });
    }

    if (payload.role === 'user') {
      return res.status(401).json({ message: 'Not allowed' });
    }

    return next();
  } catch (error) {
    return res.status(400).json({ message: 'Token expired or invalid' });
  }
};

module.exports = verifyAdmin;
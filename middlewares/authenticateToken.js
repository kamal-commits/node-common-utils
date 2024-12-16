const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const logger = require('../logger');
const rateLimit = require('express-rate-limit');

/**
 * @description
 * This function is used to authenticate the token.
 * @example
 * const { authenticateToken } = require('@mdazad/common-utils');
 * const express = require('express');
 *
 * const router = express.Router();
 * // Check if user is authenticated
 * router.use(authenticateToken(process.env.JWT_SECRET, 'users'));
 *
 * // All routes here are protected
 *
 * @example
 * // If you want to use it in a specific route
 * const { authenticateToken } = require('@mdazad/common-utils');
 * const express = require('express');
 *
 * const router = express.Router();
 * // Check if user is authenticated
 *
 * router.post("/", authenticateToken(process.env.JWT_SECRET, 'users'), async (req, res) => {
 *   // Do something
 * });
 */
const authenticateToken = (jwtSecret, userCollectionName = 'users') => [
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.',
  }),
  async (req, res, next) => {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];

      if (token == null) {
        logger.warn('No token provided');
        return res.status(401).json({ message: 'No token provided', success: false });
      }

      const tokenData = jwt.verify(token, jwtSecret);

      // Find user by id without mongoose model
      const user = await mongoose.connection.db
        .collection(userCollectionName)
        .findOne({ _id: mongoose.Types.ObjectId(tokenData.id) });

      if (!user) {
        logger.warn('User not found');
        return res.status(404).json({ message: 'User not found', success: false });
      }

      req.user = user;
      req.userId = user?._id?.toString();
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        logger.warn('Token expired');
        return res.status(401).json({ message: 'Token expired', success: false });
      } else if (error.name === 'JsonWebTokenError') {
        logger.warn('Invalid token');
        return res.status(401).json({ message: 'Invalid token', success: false });
      } else {
        logger.error(error.message);
        return res.status(500).json({ message: error.message, success: false });
      }
    }
  },
];

module.exports = {
  authenticateToken,
};

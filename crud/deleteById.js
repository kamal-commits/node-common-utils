const mongoose = require('mongoose');
const logger = require('../logger');

/**
 * Delete a document by id
 * @param {string} id - ID of the document
 * @param {mongoose.Model} model - Mongoose model
 * @returns {Promise<boolean>} True if deleted successfully
 * @throws Will throw an error if the deletion fails
 * @example
 * const { deleteById } = require('@mdazad/common-utils');
 * const { User } = require('../models/user');
 *
 * const deleteUser = async (req, res) => {
 *   await deleteById(req.params.id, User);
 * };
 */
const deleteById = async (id, model) => {
  try {
    const document = await model.findById(id);
    if (!document) {
      return false;
    }
    await document.remove();
    return true;
  } catch (error) {
    logger.error(error.message);
    throw error;
  }
};

/**
 * Delete a document by id and send response
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {mongoose.Model} model - Mongoose model
 * @returns {Promise<void>}
 * @example
 * const { deleteByIdAndSendResponse } = require('@mdazad/common-utils');
 * const express = require('express');
 * const { User } = require('../models/user');
 *
 * const router = express.Router();
 *
 * router.delete("/:id", async (req, res) => {
 *   await deleteByIdAndSendResponse(req, res, User);
 * });
 */
const deleteByIdAndSendResponse = async (req, res, model) => {
  try {
    const deleted = await deleteById(req.params.id, model);
    if (!deleted) {
      res.status(404).send({
        status: 'error',
        message: 'Document not found',
      });
    } else {
      res.status(200).send({
        status: 'success',
        message: 'Document deleted',
      });
    }
  } catch (error) {
    logger.error(error.message);
    res.status(500).send({
      error: error.message,
    });
  }
};

module.exports = {
  deleteById,
  deleteByIdAndSendResponse,
};

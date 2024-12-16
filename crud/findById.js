const mongoose = require('mongoose');
const logger = require('../logger');

/**
 * Find a document by id
 * @param {string} id - ID of the document
 * @param {mongoose.Model} model - Mongoose model
 * @param {string[]} [populateFields=[]] - Fields to populate
 * @returns {Promise<Object|null>} Document if found
 * @throws Will throw an error if the retrieval fails
 * @example
 * const { findById } = require('@mdazad/common-utils');
 * const { User } = require('../models/user');
 *
 * const user = await findById('id', User);
 *
 * // With populated fields
 * const user = await findById('id', User, ['posts']);
 */
const findById = async (id, model, populateFields = []) => {
  try {
    let query = model.findById(id);
    populateFields.forEach((field) => {
      query = query.populate(field);
    });
    const document = await query.exec();
    return document;
  } catch (error) {
    logger.error(error.message);
    throw error;
  }
};

/**
 * Find a document by id and send response
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {mongoose.Model} model - Mongoose model
 * @param {string[]} [populateFields=[]] - Fields to populate
 * @returns {Promise<void>}
 * @example
 * const { findByIdAndSendResponse } = require('@mdazad/common-utils');
 * const express = require('express');
 * const { User } = require('../models/user');
 *
 * const router = express.Router();
 *
 * router.get("/:id", async (req, res) => {
 *   await findByIdAndSendResponse(req, res, User);
 * });
 *
 * // With populated fields
 * router.get("/:id", async (req, res) => {
 *   await findByIdAndSendResponse(req, res, User, ['posts']);
 * });
 */
const findByIdAndSendResponse = async (req, res, model, populateFields = []) => {
  try {
    const document = await findById(req.params.id, model, populateFields);
    if (!document) {
      res.status(404).send({
        status: 'error',
        message: 'Document not found',
      });
    } else {
      res.status(200).send({
        status: 'success',
        message: 'Document found',
        data: document,
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
  findById,
  findByIdAndSendResponse,
};

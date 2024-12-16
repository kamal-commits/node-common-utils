import mongoose from 'mongoose';
import { logger } from "../logger/index.js";

/**
 * Update a document by id
 * @param {string} id - ID of the document
 * @param {mongoose.Model} model - Mongoose model
 * @param {Object} data - Data to update
 * @param {string[]} [populateFields=[]] - Fields to populate
 * @returns {Promise<Object|null>} Updated document
 * @throws Will throw an error if the update operation fails
 * @example
 * const { updateById } = require('@mdazad/common-utils');
 * const { User } = require('../models/user');
 *
 * const updatedUser = await updateById('id', User, { name: 'John Doe' });
 *
 * // With populated fields
 * const updatedUser = await updateById('id', User, { name: 'John Doe' }, ['posts']);
 */
const updateById = async (id, model, data, populateFields = []) => {
  try {
    let query = model.findByIdAndUpdate(id, data, { new: true });
    populateFields.forEach((field) => {
      query = query.populate(field);
    });
    const updatedDocument = await query.exec();
    return updatedDocument;
  } catch (error) {
    logger.error(error.message);
    throw error;
  }
};

/**
 * Update a document by id and send response
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {mongoose.Model} model - Mongoose model
 * @param {Object} data - Data to update
 * @param {string[]} [populateFields=[]] - Fields to populate
 * @returns {Promise<void>}
 * @example
 * const { updateByIdAndSendResponse } = require('@mdazad/common-utils');
 * const express = require('express');
 * const { User } = require('../models/user');
 *
 * const router = express.Router();
 *
 * router.put("/:id", async (req, res) => {
 *   await updateByIdAndSendResponse(req, res, User, { name: 'John Doe' });
 * });
 *
 * // With populated fields
 * router.put("/:id", async (req, res) => {
 *   await updateByIdAndSendResponse(req, res, User, { name: 'John Doe' }, ['posts']);
 * });
 */
const updateByIdAndSendResponse = async (req, res, model, data, populateFields = []) => {
  try {
    const document = await updateById(req.params.id, model, data, populateFields);
    if (!document) {
      res.status(404).send({
        status: 'error',
        message: 'Document not found',
      });
    } else {
      res.status(200).send({
        status: 'success',
        message: 'Document updated',
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

export { updateById, updateByIdAndSendResponse };
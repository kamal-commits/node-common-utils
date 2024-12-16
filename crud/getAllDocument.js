const mongoose = require('mongoose');
const logger = require('../logger');

/**
 * @description
 * Retrieves documents from a MongoDB collection based on query parameters and sends the response.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Object} model - Mongoose model to query.
 * @param {Object} [filter={}] - Additional query filters.
 * @param {Array} [populateFields=[]] - Fields to populate in the documents.
 * @param {Array} [searchIn=[]] - Fields to search in for the 'q' query parameter.
 * @returns {void}
 * @throws Will send a 500 response with an error message if a Mongoose error occurs.
 * @example
 * const { getAllDocumentAndSendResponse } = require('@kamal-sha/common-utils');
 * const express = require('express');
 * const { User } = require('../models/user');
 *
 * const router = express.Router();
 *
 * router.get("/", async (req, res) => {
 *   await getAllDocumentAndSendResponse(req, res, User);
 * });
 */
const getAllDocumentAndSendResponse = async (
  req,
  res,
  model,
  filter = {},
  populateFields = [],
  searchIn = []
) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, parseInt(req.query.limit, 10) || 20);
    const skip = Math.max(0, parseInt(req.query.skip, 10) || (page - 1) * limit);
    const sort = req.query.sort || '-createdAt';
    const q = req.query.q || '';
    const mongoQuery = req.query.mongoQuery ? JSON.parse(req.query.mongoQuery) : null;

    const buildInListQuery = (queryParam) => {
      const query = {};
      if (queryParam) {
        Object.entries(queryParam).forEach(([key, value]) => {
          query[key] = { $in: value.split(',') };
        });
      }
      return query;
    };

    const buildNotInListQuery = (queryParam) => {
      const query = {};
      if (queryParam) {
        Object.entries(queryParam).forEach(([key, value]) => {
          query[key] = { $nin: value.split(',') };
        });
      }
      return query;
    };

    const buildArrayOfObjectQuery = (queryParam, operator) => {
      const query = {};
      if (queryParam) {
        Object.entries(queryParam).forEach(([key, value]) => {
          const [field, name] = key.split('.');
          query[field] = {
            $elemMatch: {
              [name]: {
                [operator]: value.split(','),
              },
            },
          };
        });
      }
      return query;
    };

    const inListQuery = buildInListQuery(req.query.inList);
    const notInListQuery = buildNotInListQuery(req.query.notInList);
    const inListArrayOfObjectQuery = buildArrayOfObjectQuery(req.query.inListArrOfObj, '$in');
    const notInListArrayOfObjectQuery = buildArrayOfObjectQuery(req.query.notInListArrOfObj, '$nin');

    filter = { ...req.query, ...filter };

    let fields = req.query.fields || '';
    fields = [...new Set(fields.split(',').filter(Boolean))];

    const searchQuery = q ? searchIn.map(field => ({ [field]: { $regex: q, $options: 'i' } })) : [];

    if (searchQuery.length > 0) {
      filter.$or = searchQuery;
    }

    const query = model
      .find({
        ...filter,
        ...inListQuery,
        ...notInListQuery,
        ...mongoQuery,
        ...inListArrayOfObjectQuery,
        ...notInListArrayOfObjectQuery,
      })
      .skip(skip)
      .limit(limit)
      .sort(sort);

    if (populateFields.length > 0) {
      populateFields.forEach(field => query.populate(field));
    }

    if (fields.length > 0) {
      query.select(fields.join(' '));
    }

    const data = await query.exec();
    const total = await model.countDocuments({
      ...filter,
      ...inListQuery,
      ...notInListQuery,
      ...mongoQuery,
      ...inListArrayOfObjectQuery,
      ...notInListArrayOfObjectQuery,
    });
    const pages = Math.ceil(total / limit);
    const pageInfo = {
      currentPage: page,
      perPage: limit,
      pageCount: pages,
      skipCount: skip,
      itemCount: total,
      hasNextPage: page < pages,
      hasPreviousPage: page > 1,
    };

    res.status(200).json({
      status: 'success',
      data,
      pageInfo,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).send({
      error: error.message,
    });
  }
};

module.exports = getAllDocumentAndSendResponse;
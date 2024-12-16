import { logger } from "../logger/index.js";

const createDocument = async (model, data) => {
  try {
    const document = await model.create(data);

    if (!document) {
      logger.error('Document not created');
      throw new Error('Document not created');
    }
    return document;
  } catch (error) {
    logger.error(error?.message || "Error creating document");
    throw error;
  }
};

const createDocumentAndSendResponse = async (req, res, model, data) => {
  try {
    const document = await createDocument(model, data);
    return res.status(201).json({
      success: true,
      data: document,
      message: "Document created successfully",
    });
  } catch (error) {
    logger.error(error?.message || "Error creating document");

    if (error.name === 'MongoServerError' && error.code === 11000) {
      return res.status(409).json({
        error: `${Object.keys(error.keyValue)[0]}: ${Object.values(error.keyValue)[0]} already exists!`,
        success: false,
      });
    }

    return res.status(500).json({
      error: error.message,
      success: false,
    });
  }
};

export { createDocument, createDocumentAndSendResponse };

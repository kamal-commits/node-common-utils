// const nodemailer = require('nodemailer');
// const Joi = require('joi');
import { logger } from "../logger/index.js";
import nodemailer from 'nodemailer';
import Joi from 'joi';



/**
 * Sends an email using the specified SMTP configuration.
 * @param {Object} smtpConfig - SMTP configuration object.
 * @param {string} from - Sender's email address.
 * @param {string} to - Recipient's email address.
 * @param {string} subject - Subject of the email.
 * @param {string} text - Plain text body of the email.
 * @param {string} html - HTML body of the email (optional).
 * @param {Array} attachments - Array of attachment objects (optional).
 * @returns {Promise} - Resolves when the email is sent successfully.
 */
async function sendEmail(smtpConfig, from, to, subject, text, html = '', attachments = []) {
  // Validate input parameters
  const schema = Joi.object({
    smtpConfig: Joi.object().required(),
    from: Joi.string().email().required(),
    to: Joi.string().email().required(),
    subject: Joi.string().required(),
    text: Joi.string().required(),
    html: Joi.string().optional(),
    attachments: Joi.array().items(Joi.object()).optional()
  });

  const { error } = schema.validate({ smtpConfig, from, to, subject, text, html, attachments });
  if (error) {
    logger.error(`Invalid input parameters: ${error.message}`);
    throw new Error(`Invalid input parameters: ${error.message}`);
  }

  try {
    // Create a transporter object using the SMTP configuration
    const transporter = nodemailer.createTransport(smtpConfig);

    // Define the email options
    const mailOptions = {
      from,
      to,
      subject,
      text,
      html,
      attachments,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return info;
  } catch (error) {
    logger.error('Error sending email:', error);
    console.error('Error sending email:', error);
    throw error;
  }
}

module.exports = sendEmail;

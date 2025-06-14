// src/utils/apiResponses.js
const { STATUS_CODES, MESSAGES } = require("../constants");

// Standardized success response
const successResponse = (res, data, message = MESSAGES.SUCCESS, statusCode = STATUS_CODES.OK) => {
  res.status(statusCode).json({
    status: "success",
    message,
    data,
  });
};

// Standardized created response
const createdResponse = (res, data, message = MESSAGES.RESOURCE_CREATED, statusCode = STATUS_CODES.CREATED) => {
  res.status(statusCode).json({
    status: "success",
    message,
    data,
  });
};

// Standardized accepted response
const acceptedResponse = (res, message = MESSAGES.REQUEST_ACCEPTED, statusCode = STATUS_CODES.ACCEPTED) => {
  res.status(statusCode).json({
    status: "success",
    message,
  });
};

// Standardized no content response
const noContentResponse = (res, statusCode = STATUS_CODES.NO_CONTENT) => {
  res.status(statusCode).send();
};

// Standardized error response
const errorResponse = (res, error, message = MESSAGES.ERROR_OCCURRED, statusCode = STATUS_CODES.INTERNAL_SERVER_ERROR) => {
  res.status(statusCode).json({
    status: "error",
    message,
    error,
  });
};

// Standardized validation error response
const validationErrorResponse = (res, errors, message = MESSAGES.VALIDATION_FAILED, statusCode = STATUS_CODES.BAD_REQUEST) => {
  res.status(statusCode).json({
    status: "error",
    message,
    errors,
  });
};

// Standardized not found response
const notFoundResponse = (res, message = MESSAGES.RESOURCE_NOT_FOUND, statusCode = STATUS_CODES.NOT_FOUND) => {
  res.status(statusCode).json({
    status: "error",
    message,
  });
};

// Standardized unauthorized response
const unauthorizedResponse = (res, message = MESSAGES.UNAUTHORIZED_ACCESS, statusCode = STATUS_CODES.UNAUTHORIZED) => {
  res.status(statusCode).json({
    status: "error",
    message,
  });
};

// Standardized forbidden response
const forbiddenResponse = (res, message = MESSAGES.FORBIDDEN, statusCode = STATUS_CODES.FORBIDDEN) => {
  res.status(statusCode).json({
    status: "error",
    message,
  });
};

// Standardized conflict response
const conflictResponse = (res, message = MESSAGES.CONFLICT, statusCode = STATUS_CODES.CONFLICT) => {
  res.status(statusCode).json({
    status: "error",
    message,
  });
};

module.exports = {
  successResponse,
  createdResponse,
  acceptedResponse,
  noContentResponse,
  errorResponse,
  validationErrorResponse,
  notFoundResponse,
  unauthorizedResponse,
  forbiddenResponse,
  conflictResponse,
};

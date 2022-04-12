/* eslint-disable require-jsdoc */
const ClientError = require('./ClientError');

class InvariationError extends ClientError {
  constructor(message) {
    super(message);
    this.name = 'InvariationError';
  }
}

module.exports = InvariationError;

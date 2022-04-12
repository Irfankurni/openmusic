const Joi = require('joi');

const AlbumsPayloadSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().integer().min(1900).max(2022).required(),
});

module.exports = {AlbumsPayloadSchema};

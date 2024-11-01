// validation/clientSchemas.js
const Joi = require("joi");

const createClientSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  age: Joi.number().integer().min(18).required(),
  goal: Joi.string().required(),
  coachId: Joi.string().required(),
});

module.exports = { createClientSchema };

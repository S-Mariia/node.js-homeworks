const Joi = require("joi");

const addContactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().required(),
  phone: [Joi.number().required(), Joi.string().required()],
});

module.exports = addContactSchema;

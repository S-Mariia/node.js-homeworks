const Joi = require("joi");

const newContactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  favorite: Joi.bool(),
});

const updateStatusSchema = Joi.object({
  favorite: Joi.bool()
    .required()
    .messages({ "any.required": "missing field favorite" }),
});

module.exports = { newContactSchema, updateStatusSchema };

const { Schema, model } = require("mongoose");

const handleMongooseError = require("../helpers/handleMongooseError");

const Joi = require("joi");

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
      required: [true, "Set email for contact"],
    },
    phone: {
      type: String,
      required: [true, "Set phone for contact"],
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false, timestamps: true }
);

contactSchema.post("save", handleMongooseError);

const Contact = model("contact", contactSchema);

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

const schemas = {
  newContactSchema,
  updateStatusSchema,
};

module.exports = { Contact, schemas };

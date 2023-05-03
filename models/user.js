const { Schema, model } = require("mongoose");
const Joi = require("joi");

const handleMongooseError = require("../helpers/handleMongooseError");

const emailRegExp = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
const subscriptionOptions = ["starter", "pro", "business"];

const userSchema = new Schema(
  {
    email: {
      type: String,
      match: [emailRegExp, "Enter a valid email"],
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      minLength: [6, "The password should have at least 6 symbols"],
      required: [true, "Set password for user"],
    },
    subscription: {
      type: String,
      enum: subscriptionOptions,
      default: "starter",
    },
    avatarURL: {
      type: String,
      required: true,
    },
    token: String,
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleMongooseError);

const User = model("user", userSchema);

const registerSchema = Joi.object({
  email: Joi.string().pattern(new RegExp(emailRegExp)).required(),
  password: Joi.string()
    .min(6)
    .required()
    .messages({ "string.min": "The password should have at least 6 symbols" }),
  subscription: Joi.string().valid(...subscriptionOptions),
});

const loginSchema = Joi.object({
  email: Joi.string().pattern(new RegExp(emailRegExp)).required(),
  password: Joi.string()
    .min(6)
    .required()
    .messages({ "string.min": "The password has at least 6 symbols" }),
});

const updateSubscriptionSchema = Joi.object({
  subscription: Joi.string()
    .required()
    .valid(...subscriptionOptions),
});

const verifyEmailSchema = Joi.object({
  email: Joi.string()
    .pattern(new RegExp(emailRegExp))
    .required()
    .messages({ "any.required": "missing required field email" }),
});

const schemas = {
  registerSchema,
  loginSchema,
  updateSubscriptionSchema,
  verifyEmailSchema,
};

module.exports = { User, schemas };

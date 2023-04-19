const HttpError = require("../helpers/HttpErrors");

const validateBody = (schema) => {
  const func = (req, res, next) => {
    const isBodyEmpty = Object.keys(req.body).length === 0;
    if (isBodyEmpty) {
      next(HttpError(400, "Missing fields"));
    }
    const { error } = schema.validate(req.body);
    if (error) {
      next(HttpError(400, error.message));
    }
    next();
  };

  return func;
};

module.exports = validateBody;

const jwt = require("jsonwebtoken");

const { User } = require("../models/user");

const SECRET_KEY = process.env.TOKEN_SECRET_KEY;

const HttpError = require("../helpers/HttpErrors");

const authenticate = async (req, res, next) => {
  const { authorization = " " } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    next(HttpError(401, "Not authorized"));
  }

  try {
    const payload = jwt.verify(token, SECRET_KEY);

    const userId = payload.id;
    const user = await User.findById(userId);

    if (!user || token !== user.token) {
      next(HttpError(401, "Not authorized"));
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    next(HttpError(401, "Not authorized"));
  }
};

module.exports = authenticate;

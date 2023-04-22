const handleMongooseError = (error, data, next) => {
  let status = 400;
  if (error.name === "MongoServerError" && error.code === 11000) {
    status = 409;
  }
  error.status = status;
  next();
};

module.exports = handleMongooseError;

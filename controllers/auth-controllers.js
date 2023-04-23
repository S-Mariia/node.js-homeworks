const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

require("dotenv").config();

const SECRET_KEY = process.env.TOKEN_SECRET_KEY;

const { User } = require("../models/user");

const ctrlWrapper = require("../utils/decorators/ctrlWrapper");

const HttpError = require("../helpers/HttpErrors");

const register = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user !== null) {
    throw HttpError(409, "This email is already in use");
  }

  const hashedPassword = bcrypt.hashSync(req.body.password, 10);

  const result = await User.create({ ...req.body, password: hashedPassword });
  res.status(201).json({
    user: { email: result.email, subscription: result.subscription },
  });
};

const login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user === null) {
    throw HttpError(401, "Email or password is wrong");
  }

  if (!bcrypt.compareSync(req.body.password, user.password)) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    user: {
      subscription: user.subscription,
      email: user.email,
    },
    token,
  });
};

const logout = async (req, res) => {
  const { id } = req.user;
  console.log(id);
  await User.findByIdAndUpdate(id, { token: "" });
  res.status(204).json({ message: "Logged out" });
};

const getCurrentUser = (req, res) => {
  const { email, subscription } = req.user;
  res.json({
    email,
    subscription,
  });
};

const updateSubscription = async (req, res) => {
  const id = req.user._id;
  const result = await User.findByIdAndUpdate(id, req.body, { new: true });
  res.json(result);
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  getCurrentUser: ctrlWrapper(getCurrentUser),
  updateSubscription: ctrlWrapper(updateSubscription),
};

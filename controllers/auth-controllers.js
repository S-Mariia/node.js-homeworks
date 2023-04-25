const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const gravatar = require("gravatar");
const Jimp = require("jimp");

const fs = require("fs/promises");
const path = require("path");

require("dotenv").config();

const SECRET_KEY = process.env.TOKEN_SECRET_KEY;

const { User } = require("../models/user");

const ctrlWrapper = require("../utils/decorators/ctrlWrapper");

const HttpError = require("../helpers/HttpErrors");

const register = async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "This email is already in use");
  }

  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  const defaultAvatarURL = gravatar.url(email, { s: "250" });

  const result = await User.create({
    ...req.body,
    password: hashedPassword,
    avatarURL: defaultAvatarURL,
  });
  res.status(201).json({
    user: {
      email: result.email,
      subscription: result.subscription,
      avatarURL: result.avatarURL,
    },
  });
};

const login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
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

const updateAvatar = async (req, res) => {
  const id = req.user._id;
  const newFileName = `${id}${req.file.originalname}`;

  const tempFileDir = req.file.path;

  const avatar = await Jimp.read(tempFileDir);
  avatar.resize(250, 250);
  await avatar.writeAsync(tempFileDir);

  const newFileDir = path.join(
    __dirname,
    "../",
    "public",
    "avatars",
    newFileName
  );
  await fs.rename(tempFileDir, newFileDir);

  const avatarURL = path.join("avatars", newFileName);
  await User.findByIdAndUpdate(id, { avatarURL });
  res.json({ avatarURL });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  getCurrentUser: ctrlWrapper(getCurrentUser),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
};

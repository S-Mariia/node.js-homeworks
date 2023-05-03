const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { nanoid } = require("nanoid");

const gravatar = require("gravatar");
const Jimp = require("jimp");

const fs = require("fs/promises");
const path = require("path");

const sendEmail = require("../helpers/sendEmail");

require("dotenv").config();

const SECRET_KEY = process.env.TOKEN_SECRET_KEY;
const { BASE_URL } = process.env;

const { User } = require("../models/user");

const ctrlWrapper = require("../utils/decorators/ctrlWrapper");

const HttpError = require("../helpers/HttpErrors");

const register = async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "This email is already in use");
  }

  const verificationToken = nanoid();

  const verificationEmail = {
    to: email,
    subject: "Verification",
    html: `<p>Please follow this <a href="${BASE_URL}/api/users/verify/${verificationToken}">link</a> to verify your account.</p>`,
  };

  await sendEmail(verificationEmail);

  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  const defaultAvatarURL = gravatar.url(email, { s: "250" });

  const result = await User.create({
    ...req.body,
    password: hashedPassword,
    avatarURL: defaultAvatarURL,
    verificationToken,
  });
  res.status(201).json({
    user: {
      email: result.email,
      subscription: result.subscription,
      avatarURL: result.avatarURL,
    },
  });
};

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404, "Email not found");
  }

  await User.findByIdAndUpdate(user._id, {
    verificationToken: null,
    verify: true,
  });

  res.json({ message: "Verification successful" });
};

const resentVerificationEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email not found");
  }

  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const { verificationToken } = user;

  const verificationEmail = {
    to: email,
    subject: "Verification",
    html: `<p>Please follow this <a href="${BASE_URL}/api/users/verify/${verificationToken}">link</a> to verify your account.</p>`,
  };

  await sendEmail(verificationEmail);
  res.json({ message: "Verification email sent" });
};

const login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  if (!user.verify) {
    throw HttpError(401, "Email is not verified");
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
  verifyEmail: ctrlWrapper(verifyEmail),
  resentVerificationEmail: ctrlWrapper(resentVerificationEmail),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  getCurrentUser: ctrlWrapper(getCurrentUser),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
};

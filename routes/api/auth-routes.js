const express = require("express");

const ctrl = require("../../controllers/auth-controllers");

const { schemas } = require("../../models/user");

const { validateBody, authenticate, upload } = require("../../middlewares");
const { updateSubscription } = require("../../controllers/auth-controllers");

const router = express.Router();

router.post("/register", validateBody(schemas.registerSchema), ctrl.register);
router.get("/verify/:verificationToken", ctrl.verifyEmail);
router.post(
  "/verify",
  validateBody(schemas.verifyEmailSchema),
  ctrl.resentVerificationEmail
);
router.post("/login", validateBody(schemas.loginSchema), ctrl.login);
router.post("/logout", authenticate, ctrl.logout);
router.get("/current", authenticate, ctrl.getCurrentUser);
router.patch(
  "/",
  authenticate,
  validateBody(schemas.updateSubscriptionSchema),
  updateSubscription
);
router.patch(
  "/avatars",
  authenticate,
  upload.single("avatarURL"),
  ctrl.updateAvatar
);

module.exports = router;

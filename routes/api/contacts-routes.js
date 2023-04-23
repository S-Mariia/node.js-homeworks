const express = require("express");

const router = express.Router();

const { schemas } = require("../../models/contact");

const { validateBody, isValidId, authenticate } = require("../../middlewares");

const ctrl = require("../../controllers/contacts-controllers");

router.get("/", authenticate, ctrl.getContacts);
router.get("/:contactId", authenticate, isValidId, ctrl.getContact);
router.post(
  "/",
  authenticate,
  validateBody(schemas.newContactSchema),
  ctrl.addContact
);
router.delete("/:contactId", authenticate, isValidId, ctrl.deleteContact);
router.put(
  "/:contactId",
  authenticate,
  isValidId,
  validateBody(schemas.newContactSchema),
  ctrl.updateContact
);
router.patch(
  "/:contactId/favorite",
  authenticate,
  isValidId,
  validateBody(schemas.updateStatusSchema),
  ctrl.updateStatusContact
);

module.exports = router;

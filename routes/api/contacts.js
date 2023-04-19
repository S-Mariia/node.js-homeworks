const express = require("express");

const router = express.Router();

const {
  newContactSchema,
  updateStatusSchema,
} = require("../../utils/validation/contactValidationSchemas");
const validateBody = require("../../middlewares/validateBody");

const isValidId = require("../../middlewares/isValidId");

const contactsControllers = require("../../controllers/contacts");

router.get("/", contactsControllers.getContacts);
router.get("/:contactId", isValidId, contactsControllers.getContact);
router.post(
  "/",
  validateBody(newContactSchema),
  contactsControllers.addContact
);
router.delete("/:contactId", isValidId, contactsControllers.deleteContact);
router.put(
  "/:contactId",
  isValidId,
  validateBody(newContactSchema),
  contactsControllers.updateContact
);
router.patch(
  "/:contactId/favorite",
  isValidId,
  validateBody(updateStatusSchema),
  contactsControllers.updateStatusContact
);

module.exports = router;

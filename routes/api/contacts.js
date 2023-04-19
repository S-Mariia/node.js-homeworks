const express = require("express");

const router = express.Router();

const validateBody = require("../../utils/decorators/validateBody");
const contactSchema = require("../../utils/validation/contactValidationSchemas");

const contactsControllers = require("../../controllers/contacts");

router.get("/", contactsControllers.getContacts);
router.get("/:contactId", contactsControllers.getContact);
router.post("/", validateBody(contactSchema), contactsControllers.addContact);
router.delete("/:contactId", contactsControllers.deleteContact);
router.put(
  "/:contactId",
  validateBody(contactSchema),
  contactsControllers.updateContact
);

module.exports = router;

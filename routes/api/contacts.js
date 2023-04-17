const express = require("express");

const router = express.Router();

const contactsControllers = require("../../controllers/contacts");

router.get("/", contactsControllers.getContacts);
router.get("/:contactId", contactsControllers.getContact);
router.post("/", contactsControllers.addContact);
router.delete("/:contactId", contactsControllers.deleteContact);
router.put("/:contactId", contactsControllers.updateContact);

module.exports = router;

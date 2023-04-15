const express = require("express");
const Joi = require("joi");

const HttpError = require("../../helpers/HttpErrors");

const router = express.Router();
const contacts = require("../../models/contacts");

const addContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});

router.get("/", async (req, res, next) => {
  try {
    const allContacts = await contacts.listContacts();
    res.json(allContacts);
  } catch (error) {
    const { status = 500 } = error;
    res.status(status).json({ message: error.message });
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const id = req.params.contactId;
    const result = await contacts.getContactById(id);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json(result);
  } catch (error) {
    const { status = 500 } = error;
    res.status(status).json({ message: error.message });
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error, value } = addContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const result = await contacts.addContact(value);
    res.status(201).json(result);
  } catch (error) {
    const { status = 500 } = error;
    res.status(status).json({ message: error.message });
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const id = req.params.contactId;
    const result = await contacts.removeContact(id);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json({ message: "Contact deleted" });
  } catch (error) {
    const { status = 500 } = error;
    res.status(status).json({ message: error.message });
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const id = req.params.contactId;
    const isBodyEmpty = Object.keys(req.body).length === 0;
    if (isBodyEmpty) {
      throw HttpError(400, "Missing fields");
    }

    const { error, value } = addContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    const result = await contacts.updateContact(id, value);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json(result);

    // const { error, value } = addContactSchema.validate(req.body);
    // if (error) {
    //   throw HttpError(400, error.message);
    // }
  } catch (error) {
    const { status = 500 } = error;
    res.status(status).json({ message: error.message });
  }
});

module.exports = router;

const HttpError = require("../helpers/HttpErrors");

const contactsService = require("../services/contactsService");

const addContactSchema = require("../utils/validation/contactValidationSchemas");

const getContacts = async (req, res, next) => {
  try {
    const allContacts = await contactsService.getContactsService();
    res.json(allContacts);
  } catch (error) {
    next(error);
  }
};

const getContact = async (req, res, next) => {
  try {
    const id = req.params.contactId;
    const result = await contactsService.getContactByIdService(id);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const addContact = async (req, res, next) => {
  try {
    const { error, value } = addContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const result = await contactsService.addContactService(value);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const id = req.params.contactId;
    const result = await contactsService.removeContactService(id);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json({ message: "Contact deleted" });
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
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

    const result = await contactsService.updateContactService(id, value);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getContacts,
  getContact,
  addContact,
  deleteContact,
  updateContact,
};

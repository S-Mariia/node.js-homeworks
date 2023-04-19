const HttpError = require("../helpers/HttpErrors");

const contactsService = require("../services/contactsService");
const ctrlWrapper = require("../utils/decorators/ctrlWrapper");

const getContacts = async (req, res, next) => {
  const allContacts = await contactsService.getContactsService();
  res.json(allContacts);
};

const getContact = async (req, res, next) => {
  const id = req.params.contactId;
  const result = await contactsService.getContactByIdService(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const addContact = async (req, res, next) => {
  const result = await contactsService.addContactService(req.body);
  res.status(201).json(result);
};

const deleteContact = async (req, res, next) => {
  const id = req.params.contactId;
  const result = await contactsService.removeContactService(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json({ message: "Contact deleted" });
};

const updateContact = async (req, res, next) => {
  const id = req.params.contactId;
  const isBodyEmpty = Object.keys(req.body).length === 0;
  if (isBodyEmpty) {
    throw HttpError(400, "Missing fields");
  }

  const result = await contactsService.updateContactService(id, req.body);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

module.exports = {
  getContacts: ctrlWrapper(getContacts),
  getContact: ctrlWrapper(getContact),
  addContact: ctrlWrapper(addContact),
  deleteContact: ctrlWrapper(deleteContact),
  updateContact: ctrlWrapper(updateContact),
};

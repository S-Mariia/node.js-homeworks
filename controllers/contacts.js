const HttpError = require("../helpers/HttpErrors");

const Contact = require("../models/contact");
const ctrlWrapper = require("../utils/decorators/ctrlWrapper");

const getContacts = async (req, res, next) => {
  const allContacts = await Contact.find();
  res.json(allContacts);
};

const getContact = async (req, res, next) => {
  const id = req.params.contactId;
  const result = await Contact.findById(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const addContact = async (req, res, next) => {
  const result = await Contact.create(req.body);
  res.status(201).json(result);
};

const deleteContact = async (req, res, next) => {
  const id = req.params.contactId;
  const result = await Contact.findByIdAndRemove(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json({ message: "Contact deleted" });
};

const updateContact = async (req, res, next) => {
  const id = req.params.contactId;
  const result = await Contact.findOneAndReplace({ _id: id }, req.body, {
    new: true,
  });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const updateStatusContact = async (req, res, next) => {
  const id = req.params.contactId;
  const result = await Contact.findByIdAndUpdate(id, req.body, {
    new: true,
  });
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
  updateStatusContact: ctrlWrapper(updateStatusContact),
};

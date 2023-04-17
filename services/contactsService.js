const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");

const contactsPath = path.resolve("models", "contacts.json");

const getContactsService = async () => {
  const allContacts = await fs.readFile(contactsPath, "utf-8");
  return JSON.parse(allContacts);
};

const getContactByIdService = async (contactId) => {
  const allContacts = await getContactsService();
  const contact = allContacts.find(({ id }) => id === contactId);
  return contact || null;
};

const removeContactService = async (contactId) => {
  const allContacts = await getContactsService();
  const idx = allContacts.findIndex(({ id }) => id === contactId);
  if (idx === -1) {
    return null;
  }

  const removedContact = allContacts.splice(idx, 1);
  await fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2));
  return removedContact;
};

const addContactService = async (body) => {
  const allContacts = await getContactsService();
  const { name, email, phone } = body;
  const newContact = {
    id: nanoid(),
    name,
    email,
    phone,
  };
  const newList = [...allContacts, newContact];
  await fs.writeFile(contactsPath, JSON.stringify(newList, null, 2));
  return newContact;
};

const updateContactService = async (contactId, body) => {
  const allContacts = await getContactsService();
  const idx = allContacts.findIndex(({ id }) => id === contactId);
  if (idx === -1) {
    return null;
  }
  allContacts[idx] = { id: contactId, ...body };
  await fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2));
  return allContacts[idx];
};

module.exports = {
  getContactsService,
  getContactByIdService,
  removeContactService,
  addContactService,
  updateContactService,
};

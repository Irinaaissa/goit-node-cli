import * as fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";


const contactsPath = path.resolve("db", "contacts.json");

async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath, { encoding: "utf-8" });

    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function getContactById(contactId) {
  try {
    const contacts = await listContacts();
    const contact = contacts.find((contact) => contact.id === contactId);
    if (typeof contact === "undefined") {
      return null;
    }
    return contact;
  } catch (error) {
    return null;
  }
}

async function removeContact(contactId) {
  try {
    const contacts = await listContacts();
    const index = contacts.findIndex((contact) => contact.id === contactId);
    if (index === -1) {
      return null;
    }
    const removeContact = contacts[index];
    const newContact = [
      ...contacts.slice(0, index),
      ...contacts.slice(index + 1),
    ];
    await fs.writeFile(newContact, JSON.stringify(contacts, null, 2));
    return removeContact;
  } catch (error) {
    return null;
  }
}

async function addContact(name, email, phone) {
  try {
    const contacts = await listContacts();
    const newContact = { name, email, phone, id: crypto.randomUUID() };
    contacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return newContact;
  } catch (error) {
    return null;
  }
}

export default { addContact, removeContact, getContactById, listContacts };

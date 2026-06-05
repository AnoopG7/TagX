import { Contact } from "../models/contact.model.js";

interface ContactInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function submitContact(data: ContactInput) {
  const contact = await Contact.create(data);
  return contact;
}

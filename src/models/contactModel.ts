import mongoose, { Schema, Model } from "mongoose";

interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: Number;
  createdAt: Date;
  updatedAt: Date;
}

const contactSchemaDefinition: Record<keyof Omit<Contact, "_id" | "createdAt" | "updatedAt">, any> = {
  name: {
    type: String,
    required: [true, "Please add the contact name"],
  },
  email: {
    type: String,
    required: [true, "Please add the contact email address"],
  },
  phone: {
    type: Number,
    required: [true, "Please add the contact phone number"],
  },
};

const contactSchema: Schema<Contact> = new mongoose.Schema(contactSchemaDefinition, {
  timestamps: true,
});

const contactModel: Model<Contact> = mongoose.model<Contact>("Contact", contactSchema);

export default contactModel;

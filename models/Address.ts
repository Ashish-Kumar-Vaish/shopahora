import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  area: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  zipCode: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
});

export type AddressType = mongoose.InferSchemaType<typeof AddressSchema> & {
  _id: string;
};

export default mongoose.models.Address ||
  mongoose.model("Address", AddressSchema);

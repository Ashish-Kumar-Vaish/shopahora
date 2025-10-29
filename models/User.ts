import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    cartItems: {
      type: Object,
      default: {},
    },
  },
  { minimize: false }
);

export type UserType = mongoose.InferSchemaType<typeof UserSchema> & {
  _id: string;
};

export default mongoose.models.User || mongoose.model("User", UserSchema);

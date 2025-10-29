import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  items: [
    {
      product: {
        type: String,
        required: true,
        ref: "Product",
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  amount: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
    ref: "Address",
  },
  status: {
    type: String,
    required: true,
    enum: ["pending", "processing", "completed", "cancelled"],
    default: "pending",
  },
  date: {
    type: Date,
    required: true,
  },
});

export type OrderType = mongoose.InferSchemaType<typeof OrderSchema> & {
  _id: string;
};

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);

import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  salePrice: {
    type: Number,
  },
  imageUrls: [String],
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
  },
  colors: [String],
  sizes: [String],
  characteristics: {
    material: String,
  },
  stock: {
    type: Number,
  },
  highlight: {
    type: String,
  },
});

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);

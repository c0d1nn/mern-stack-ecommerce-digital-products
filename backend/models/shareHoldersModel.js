import mongoose from "mongoose";

const shareHolderSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  numberOfShares: {
    type: Number,
    required: true,
  },
  percentage: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updateAt: {
    type: Date,
    default: Date.now,
  },
});

export const Shareholder = mongoose.model("Shareholder", shareHolderSchema);

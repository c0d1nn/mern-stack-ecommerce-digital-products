import mongoose from "mongoose";

const DocumentSchema = mongoose.Schema({
  descriptionID: { type: String, required: false },
  descriptionEN: { type: String, required: false },
  fileDocument: {
    url: { type: String, required: true },
    name: { type: String, required: true },
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  articleDate: { type: String, required: true },
  category: { type: String, required: true },
  selectType: { type: String, required: true },
});

export const Document = mongoose.model("Document", DocumentSchema);

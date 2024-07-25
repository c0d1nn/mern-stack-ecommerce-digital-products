import mongoose from "mongoose";

const articleSchema = mongoose.Schema({
  titleID: { type: String, required: true },
  titleEN: { type: String, required: false },
  descriptionID: { type: String, required: true },
  descriptionEN: { type: String, required: false },
  articleDate: { type: String, required: false },
  category: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  image: {
    url: { type: String, required: true },
    name: { type: String, required: true },
  },
});

export const Article = mongoose.model("Article", articleSchema);

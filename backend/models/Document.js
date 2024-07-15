const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema({
  descriptionID: String,
  descriptionEN: String,
  fileDocument: {
    data: Buffer,
    contentType: String,
    name: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  articleDate: String,
  category: String,
  selectType: String,
});

export const DocumentModel = mongoose.model("document", DocumentSchema);

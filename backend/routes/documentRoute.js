const express = require("express");
const router = express.Router();
const multer = require("multer");
const DocumentModel = require("../models/Document");
const upload = multer({ limits: { fileSize: 50 * 1024 * 1024 } });

router.get("/get", (req, res) => {
  DocumentModel.find()
    .then((document) => res.json(document))
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

router.get("/documents/:filename", async (req, res) => {
  try {
    const document = await DocumentModel.findOne({
      "fileDocument.name": req.params.filename,
    });

    if (document) {
      res.set("Content-Type", document.fileDocument.contentType);
      res.set(
        "Content-Disposition",
        `attachment; filename=${document.fileDocument.name}`
      );
      res.send(document.fileDocument.data);
    } else {
      res.status(404).send("File not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/post", upload.single("fileDocument"), async (req, res) => {
  try {
    const { descriptionID, descriptionEN, articleDate, category, selectType } =
      req.body;
    const newFileDocument = {
      data: req.file.buffer,
      contentType: req.file.mimetype,
      name: req.file.originalname,
    };

    await DocumentModel.create({
      descriptionID,
      descriptionEN,
      fileDocument: newFileDocument,
      articleDate,
      category,
      selectType,
    });

    res.json({ message: "File uploaded successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/documents/:id", async (req, res) => {
  try {
    const documentIdToDelete = req.params.id;
    await DocumentModel.findByIdAndDelete(documentIdToDelete);

    res.json({ message: "Document deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

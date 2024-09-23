// routes/documentRouter.js
import express from "express";
import multer from "multer";
import { Document } from "../models/documentModel.js";
import { auth } from "../middleware/authMiddleware.js";
import {
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "../config/firebase.js";
// import path from "path";
// import AWS from "aws-sdk";

const router = express.Router();
const storageMulter = multer.memoryStorage();
const upload = multer({
  storage: storageMulter,
  limits: { fileSize: 50 * 1024 * 1024 },
});

// AWS.config.update({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION,
// });

// const s3 = new AWS.S3();

// CREATE NEW DOCUMENT ROUTE FIREBASE
router.post("/", auth, upload.single("fileDocument"), async (req, res) => {
  try {
    if (
      !req.file ||
      !req.body.descriptionID ||
      !req.body.descriptionEN ||
      !req.body.articleDate ||
      !req.body.category ||
      !req.body.selectType
    ) {
      return res.status(400).send({
        message: "Required fields are missing",
      });
    }

    const storageRef = ref(storage, `documents/${req.file.originalname}`);
    const metadata = {
      contentType: req.file.mimetype,
    };

    const snapshot = await uploadBytes(storageRef, req.file.buffer, metadata);
    const fileUrl = await getDownloadURL(snapshot.ref);

    const newDocument = {
      descriptionID: req.body.descriptionID,
      descriptionEN: req.body.descriptionEN,
      fileDocument: {
        url: fileUrl,
        name: req.file.originalname,
      },
      articleDate: req.body.articleDate,
      category: req.body.category,
      selectType: req.body.selectType,
    };

    const document = await Document.create(newDocument);

    return res.status(201).send(document);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

//CREATE NEW DOCUMENT ROUTE AWS
// router.post("/", auth, upload.single("fileDocument"), async (req, res) => {
//   try {
//     if (
//       !req.file ||
//       !req.body.descriptionID ||
//       !req.body.descriptionEN ||
//       !req.body.articleDate ||
//       !req.body.category ||
//       !req.body.selectType
//     ) {
//       return res.status(400).send({
//         message: "Required fields are missing",
//       });
//     }

//     const params = {
//       Bucket: process.env.AWS_BUCKET_NAME, // Nama bucket
//       Key: `documents/${Date.now()}${path.extname(req.file.originalname)}`, // Nama file di S3
//       Body: req.file.buffer,
//       ContentType: req.file.mimetype,
//       ACL: "public-read", // Akses publik
//     };

//     const data = await s3.upload(params).promise();
//     const fileUrl = data.Location;

//     const newDocument = {
//       descriptionID: req.body.descriptionID,
//       descriptionEN: req.body.descriptionEN,
//       fileDocument: {
//         url: fileUrl,
//         name: req.file.originalname,
//       },
//       articleDate: req.body.articleDate,
//       category: req.body.category,
//       selectType: req.body.selectType,
//     };

//     const document = await Document.create(newDocument);

//     return res.status(201).send(document);
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).send({ message: error.message });
//   }
// });

// GET ALL DOCUMENTS ROUTE
// router.get("/", async (req, res) => {
//   try {
//     const documents = await Document.find({});
//     return res.status(200).json({ data: documents });
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).send({ message: error.message });
//   }
// });

router.get("/", async (req, res) => {
  try {
    const documents = await Document.find({});
    return res.status(200).json(documents);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET SINGLE DOCUMENT ROUTE
router.get("/:id", async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).send({ message: "Document not found" });
    }

    return res.status(200).json(document);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

//DELETE DOCUMENT ROUTE FIREBASE
router.delete("/:id", auth, async (req, res) => {
  try {
    const result = await Document.findByIdAndDelete(req.params.id);

    if (!result) {
      return res.status(404).json({ message: "Document not found" });
    }

    res
      .status(200)
      .json({ message: "Document successfully deleted", deletedItem: result });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

// DELETE DOCUMENT ROUTE
// router.delete("/:id", auth, async (req, res) => {
//   try {
//     const result = await Document.findByIdAndDelete(req.params.id);

//     if (!result) {
//       return res.status(404).json({ message: "Document not found" });
//     }

//     // Hapus file dari S3
//     const deleteParams = {
//       Bucket: process.env.AWS_BUCKET_NAME,
//       Key: result.fileDocument.name,
//     };
//     await s3.deleteObject(deleteParams).promise();

//     res.status(200).json({
//       message: "Document successfully deleted",
//       deletedItem: result,
//     });
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).send({ message: error.message });
//   }
// });

// UPDATE DOCUMENT ROUTE (excluding file data)
router.put("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    const updateData = {
      descriptionID: req.body.descriptionID,
      descriptionEN: req.body.descriptionEN,
      articleDate: req.body.articleDate,
      category: req.body.category,
      selectType: req.body.selectType,
    };

    const result = await Document.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!result) {
      return res.status(404).json({ message: "Document not found" });
    }

    return res
      .status(200)
      .send({ message: "Document updated", updatedDocument: result });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

// DOWNLOAD DOCUMENT ROUTE
router.get("/download/:filename", async (req, res) => {
  try {
    const document = await Document.findOne({
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

export default router;

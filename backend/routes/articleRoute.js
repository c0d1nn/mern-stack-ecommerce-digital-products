import express from "express";
import multer from "multer";
import { Article } from "../models/articleModel.js";
import { auth } from "../middleware/authMiddleware.js";
import {
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "../config/firebase.js";

const router = express.Router();
const upload = multer({ limits: { fileSize: 50 * 1024 * 1024 } });

// CREATE NEW ARTICLE ROUTE
router.post("/", auth, upload.single("image"), async (request, response) => {
  try {
    if (
      !request.body.titleID ||
      !request.body.titleEN ||
      !request.body.descriptionID ||
      !request.body.descriptionEN ||
      !request.body.articleDate ||
      !request.body.category ||
      !request.file
    ) {
      return response.status(400).send({
        message: "Required fields are missing",
      });
    }

    const storageRef = ref(storage, `images/${request.file.originalname}`);
    const metadata = {
      contentType: request.file.mimetype,
    };

    const snapshot = await uploadBytes(
      storageRef,
      request.file.buffer,
      metadata
    );
    const imageUrl = await getDownloadURL(snapshot.ref);

    const newArticle = {
      titleID: request.body.titleID,
      titleEN: request.body.titleEN,
      descriptionID: request.body.descriptionID,
      descriptionEN: request.body.descriptionEN,
      articleDate: request.body.articleDate,
      category: request.body.category,
      image: {
        url: imageUrl,
        name: request.file.originalname,
      },
    };

    const article = await Article.create(newArticle);

    return response.status(201).send(article);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// GET ALL ARTICLES ROUTE
// router.get("/", async (req, res) => {
//   try {
//     const articles = await Article.find({});
//     return res.status(200).json({
//       data: articles,
//     });
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).send({ message: error.message });
//   }
// });

router.get("/", async (req, res) => {
  try {
    const articles = await Article.find({});
    return res.status(200).json(articles);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET ARTICLE BY ID ROUTE
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const article = await Article.findById(id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    return res.status(200).json(article);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

// DELETE ARTICLE ROUTE
router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Article.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: "Article not found" });
    }
    return res.status(200).json({
      message: "Article successfully deleted",
      deletedItem: result,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

// UPDATE ARTICLE ROUTE
router.put("/:id", auth, async (req, res) => {
  try {
    if (
      !req.body.titleID ||
      !req.body.descriptionID ||
      !req.body.articleDate ||
      !req.body.category
    ) {
      return res.status(400).send({
        message: "Required fields are missing",
      });
    }

    const { id } = req.params;
    const result = await Article.findByIdAndUpdate(id, req.body, { new: true });
    if (!result) {
      return res.status(404).json({ message: "Article not found" });
    }
    return res.status(200).send({ message: "Article updated" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

export default router;

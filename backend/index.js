import express from "express";
import { config } from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import stripeRoute from "./routes/stripeRoute.js";
import { authRouter } from "./controllers/authController.js";
import documentRoute from "./routes/documentRoute.js";
import articleRoute from "./routes/articleRoute.js";

import {
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "./config/firebase.js";

import shareHoldersRoutes from "./routes/shareHoldersRoutes.js";

config();

const upload = multer({ limits: { fileSize: 50 * 1024 * 1024 } });

const app = express();

app.use(cors());

app.listen(process.env.PORT, () =>
  console.log(`Server running on ${process.env.PORT} PORT`)
);

mongoose
  .connect(process.env.mongoDb, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true,
  })
  .then(() => console.log("Database is connected"))
  .catch((error) => console.log(error));

app.use(express.json());

app.use("/document", documentRoute);
app.use("/article", articleRoute);
app.use("/shareholder", shareHoldersRoutes);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use((req, res, next) => {
  req.cloudinary = cloudinary;
  next();
});

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: "images",
//     allowedFormats: ["jpeg", "png", "jpg"],
//   },
// });

const parser = multer({ storage: storage });

//ROUTE FOR UPLOADING THE FILE TO CLOUDINARY
app.post("/upload-image", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  try {
    const storageRef = ref(
      storage,
      `images/${Date.now()}-${req.file.originalname}`
    );
    const metadata = {
      contentType: req.file.mimetype,
    };

    const snapshot = await uploadBytes(storageRef, req.file.buffer, metadata);

    const downloadURL = await getDownloadURL(snapshot.ref);

    res.json({ secure_url: downloadURL });
  } catch (error) {
    console.error("Error during file upload:", error);
    res.status(500).send("Internal server error");
  }
});

// app.post("/upload-image", parser.single("file"), (req, res) => {
//   if (!req.file) {
//     return res.status(400).send("No file uploaded.");
//   }

//   try {
//     if (!req.file.path) {
//       throw new Error("File uploaded, but no path available");
//     }

//     res.json({ secure_url: req.file.path });
//   } catch (error) {
//     console.error("Error during file upload: ", error);
//     res.status(500).send("Internal server error");
//   }
// });

app.use("/stripe", stripeRoute);
app.use("/auth", authRouter);

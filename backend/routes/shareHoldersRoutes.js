import express from "express";
import { Shareholder } from "../models/shareHoldersModel.js";
import { auth } from "../middleware/authMiddleware.js";

const router = express.Router();

// CREATE NEW SHAREHOLDER
router.post("/", auth, async (req, res) => {
  try {
    const { name, numberOfShares, percentage } = req.body;

    if (!name || !numberOfShares || !percentage) {
      return res.status(400).send({ message: "Required fields are missing" });
    }

    const newShareholder = new Shareholder({
      name,
      numberOfShares,
      percentage,
    });
    const savedShareholder = await newShareholder.save();

    return res.status(201).send(savedShareholder);
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
});

// GET ALL SHAREHOLDERS
router.get("/", async (req, res) => {
  try {
    const shareholders = await Shareholder.find({});
    return res.status(200).json(shareholders);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET SHAREHOLDER BY ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const shareholder = await Shareholder.findById(id);

    if (!shareholder) {
      return res.status(404).json({ message: "Shareholder not found" });
    }

    return res.status(200).json(shareholder);
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
});

// UPDATE SHAREHOLDER
router.put("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, numberOfShares, percentage } = req.body;

    if (!name || !numberOfShares || !percentage) {
      return res.status(400).send({ message: "Required fields are missing" });
    }

    const updatedShareholder = await Shareholder.findByIdAndUpdate(
      id,
      { name, numberOfShares, percentage },
      { new: true }
    );

    if (!updatedShareholder) {
      return res.status(404).json({ message: "Shareholder not found" });
    }

    return res
      .status(200)
      .send({ message: "Shareholder updated", updatedShareholder });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
});

// DELETE SHAREHOLDER
router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedShareholder = await Shareholder.findByIdAndDelete(id);

    if (!deletedShareholder) {
      return res.status(404).json({ message: "Shareholder not found" });
    }

    return res.status(200).json({
      message: "Shareholder successfully deleted",
      deletedItem: deletedShareholder,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
});

export default router;

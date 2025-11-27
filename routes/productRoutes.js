const express = require("express");
const router = express.Router();
const Product = require("../models/productSchema");
const upload = require("../middleware/upload");
const { protect, adminProtect } = require("../middleware/auth");

router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Not found" });

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", protect, adminProtect, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Image required" });

    const { name, price, category, description } = req.body;

    const product = await Product.create({
      name,
      price,
      category,
      description,
      image: req.file.filename,
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", protect, adminProtect, upload.single("image"), async (req, res) => {
  try {
    const updateData = req.body;
    if (req.file) updateData.image = req.file.filename;

    const updated = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!updated) return res.status(404).json({ message: "Not found" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", protect, adminProtect, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

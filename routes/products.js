const express = require("express");
const router = express.Router();
const Product = require("../models/Product"); // Adjust the path as needed

router.get("/", async (req, res) => {
  try {
    const products = await Product.find(); // Fetch all products from MongoDB
    res.render("productMain", { products }); // Render the EJS file with products data
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;

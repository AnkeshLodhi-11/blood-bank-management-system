const express = require("express");

const {
  addDonor,
  loginDonor,
  getDonors,
  getDonorById,
  updateDonor,
  deleteDonor,
} = require("../controllers/donorController");

const router = express.Router();

// Register
router.post("/", addDonor);

// Login
router.post("/login", loginDonor);

// Donor list
router.get("/", getDonors);

// Single donor
router.get("/:id", getDonorById);

// Update
router.put("/:id", updateDonor);

// Delete
router.delete("/:id", deleteDonor);

module.exports = router;
const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    age: {
      type: Number,
      required: true,
      min: 18,
      max: 100,
    },

    bloodGroup: {
      type: String,
      required: true,
      enum: [
        "A+",
        "A-",
        "B+",
        "B-",
        "AB+",
        "AB-",
        "O+",
        "O-",
      ],
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      match: [
        /^[6-9]\d{9}$/,
        "Please enter a valid 10-digit phone number",
      ],
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    lastDonationDate: {
      type: Date,
      default: null,
    },

    available: {
      type: Boolean,
      default: true,
    },
  },

  {
    timestamps: true,
  }
);

const Donor = mongoose.model(
  "Donor",
  donorSchema
);

module.exports = Donor;
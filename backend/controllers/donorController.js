const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const Donor = require("../models/Donor");

// =====================================================
// EMAIL
// =====================================================

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

// =====================================================
// JWT
// =====================================================

const createToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// =====================================================
// REGISTER
// POST /api/donors
// =====================================================

const addDonor = async (req, res) => {
  try {

    const {
      name,
      age,
      bloodGroup,
      phone,
      email,
      city,
      password,
    } = req.body;

    // Validation

    if (
      !name ||
      !age ||
      !bloodGroup ||
      !phone ||
      !email ||
      !city ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please fill all required fields.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters.",
      });
    }

    // Check existing email

    const existingDonor =
      await Donor.findOne({
        email: email.toLowerCase().trim(),
      });

    if (existingDonor) {
      return res.status(409).json({
        success: false,
        message:
          "An account with this email already exists.",
      });
    }

    // Hash password

    const hashedPassword =
      await bcrypt.hash(password, 12);

    // Create donor

    const donor = await Donor.create({
      name: name.trim(),
      age: Number(age),
      bloodGroup,
      phone: phone.trim(),
      email: email.toLowerCase().trim(),
      city: city.trim(),
      password: hashedPassword,
    });

    // =================================================
    // EMAIL NOTIFICATION
    // =================================================

    let emailSent = false;

    try {

      await transporter.sendMail({

        from:
          `"Veda Hospital Blood Care" <${process.env.ADMIN_EMAIL}>`,

        to:
          process.env.ADMIN_EMAIL,

        subject:
          "🩸 New Donor Registration - Veda Hospital",

        html: `
          <div style="
            font-family: Arial;
            max-width: 650px;
            margin: auto;
            border: 1px solid #ddd;
            border-radius: 12px;
            overflow: hidden;
          ">

            <div style="
              background: #b91c1c;
              color: white;
              padding: 25px;
              text-align: center;
            ">

              <h1>
                🩸 New Donor Registration
              </h1>

              <p>
                Veda Hospital & Blood Care Center
              </p>

            </div>

            <div style="padding:25px">

              <h2>Donor Details</h2>

              <p>
                <strong>Name:</strong>
                ${donor.name}
              </p>

              <p>
                <strong>Age:</strong>
                ${donor.age}
              </p>

              <p>
                <strong>Blood Group:</strong>
                ${donor.bloodGroup}
              </p>

              <p>
                <strong>Phone:</strong>
                ${donor.phone}
              </p>

              <p>
                <strong>Email:</strong>
                ${donor.email}
              </p>

              <p>
                <strong>City:</strong>
                ${donor.city}
              </p>

              <hr>

              <p>
                A new donor has registered
                on the Blood Bank Management System.
              </p>

              <p>
                📍 C24, Vasant Vihar,
                Ujjain, Madhya Pradesh
              </p>

              <p>
                👨‍💻 Developed by
                <strong>Ankit Lodhi</strong>
              </p>

            </div>
          </div>
        `,
      });

      emailSent = true;

      console.log(
        "📧 Registration email sent."
      );

    } catch (emailError) {

      console.log(
        "⚠️ Email failed:",
        emailError.message
      );

    }

    // JWT

    const token =
      createToken(donor._id);

    // Response

    return res.status(201).json({

      success: true,

      message:
        "Donor registered successfully.",

      emailNotification:
        emailSent,

      token,

      donor: {
        id: donor._id,
        name: donor.name,
        age: donor.age,
        bloodGroup: donor.bloodGroup,
        phone: donor.phone,
        email: donor.email,
        city: donor.city,
        available: donor.available,
        createdAt: donor.createdAt,
      },

    });

  } catch (error) {

    console.error(
      "REGISTER ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        error.message ||
        "Registration failed.",

    });
  }
};

// =====================================================
// LOGIN
// POST /api/donors/login
// =====================================================

const loginDonor = async (req, res) => {
  try {

    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required.",
      });
    }

    const donor =
      await Donor.findOne({
        email:
          email.toLowerCase().trim(),
      }).select("+password");

    if (!donor) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    const passwordMatch =
      await bcrypt.compare(
        password,
        donor.password
      );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    const token =
      createToken(donor._id);

    return res.status(200).json({

      success: true,

      message:
        "Login successful.",

      token,

      donor: {
        id: donor._id,
        name: donor.name,
        age: donor.age,
        bloodGroup: donor.bloodGroup,
        phone: donor.phone,
        email: donor.email,
        city: donor.city,
        available: donor.available,
      },

    });

  } catch (error) {

    console.error(
      "LOGIN ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Login failed.",
    });
  }
};

// =====================================================
// GET ALL DONORS
// =====================================================

const getDonors = async (req, res) => {
  try {

    const donors =
      await Donor.find()
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      count: donors.length,
      donors,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// GET DONOR BY ID
// =====================================================

const getDonorById = async (req, res) => {
  try {

    const donor =
      await Donor.findById(
        req.params.id
      );

    if (!donor) {
      return res.status(404).json({
        success: false,
        message:
          "Donor not found.",
      });
    }

    return res.status(200).json({
      success: true,
      donor,
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message:
        "Invalid donor ID.",
    });
  }
};

// =====================================================
// UPDATE
// =====================================================

const updateDonor = async (req, res) => {
  try {

    const donor =
      await Donor.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!donor) {
      return res.status(404).json({
        success: false,
        message:
          "Donor not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Donor updated successfully.",
      donor,
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// DELETE
// =====================================================

const deleteDonor = async (req, res) => {
  try {

    const donor =
      await Donor.findByIdAndDelete(
        req.params.id
      );

    if (!donor) {
      return res.status(404).json({
        success: false,
        message:
          "Donor not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Donor deleted successfully.",
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message:
        "Invalid donor ID.",
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  addDonor,
  loginDonor,
  getDonors,
  getDonorById,
  updateDonor,
  deleteDonor,
};
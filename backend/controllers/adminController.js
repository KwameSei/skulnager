import Admin from "../models/adminSchema.js";
import cloudinary from "cloudinary";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Admin registration
export const registerAdmin = async (req, res) => {
  try {
    req.body.password = await bcrypt.hash(req.body.password, 10);

    const { name, email, phone, password, image, image_mimetype, role, schoolName } = req.body;

    // Validate user input
    if (!(email && password && name && phone && schoolName)) {
      res.status(400).json({
        success: false,
        status: 400,
        message: "All input is required",
      });
    }

    // Check password length
    if (password.length < 6) {
      res.status(400).json({
        success: false,
        status: 400,
        message: "Password must be at least 6 characters",
      });
    }

    // Convert email to lowercase
    const emailToLower = email.toLowerCase();

    // Check if Admin already exists
    const adminExists = await Admin.findOne({ email: emailToLower });
    if (adminExists) {
      res.status(400).json({
        success: false,
        status: 400,
        message: "Admin already exists",
      });
    }

    // Check if school name already exists
    const schoolExists = await Admin.findOne({ schoolName: schoolName });
    if (schoolExists) {
      res.status(400).json({
        success: false,
        status: 400,
        message: "School name already exists",
      });
    }

    // create token
    const token = jwt.sign(
      { name, email, phone, role, schoolName },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    // Create new Admin
    const newAdmin = new Admin(req.body);

    // Save the new admin to the database
    await newAdmin.save();
    
    res.status(201).json({
      success: true,
      status: 201,
      message: "Admin created successfully",
      token,
      admin: newAdmin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: error.message,
    });
  }
};

// Admin login
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).json({
        success: false,
        status: 400,
        message: "All input is required",
      });
    }

    // Convert email to lowercase
    const emailToLower = email.toLowerCase();

    // Check if Admin exists
    const adminExists = await Admin.findOne({ email: emailToLower });
    if (!adminExists) {
      res.status(400).json({
        success: false,
        status: 400,
        message: "Admin does not exist",
      });
    }

    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(
      password,
      adminExists.password
    );
    if (!isPasswordCorrect) {
      res.status(400).json({
        success: false,
        status: 400,
        message: "Invalid credentials",
      });
    }

    // create token
    const token = jwt.sign(
      { name: adminExists.name, email: adminExists.email, phone: adminExists.phone, role: adminExists.role, schoolName: adminExists.schoolName },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      success: true,
      status: 200,
      message: "Admin logged in successfully",
      token,
      admin: adminExists,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: error.message,
    });
  }
};

// Admin Profile
export const adminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);

    res.status(200).json({
      success: true,
      status: 200,
      message: "Admin profile retrieved successfully",
      admin,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      status: 404,
      message: error.message,
    });
  }
};
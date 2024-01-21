import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Admin from '../models/adminSchema.js';
import Student from '../models/studentSchema.js';
import Teacher from '../models/teacherSchema.js';

dotenv.config();

export const adminAuth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization').replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: 'No token, authorization denied',
      })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check token expiration
    const currentTimestamp = Math.floor(Date.now() / 1000); // Get current timestamp in seconds
    if (decoded.exp < currentTimestamp) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: 'Token expired',
      })
    }

    // Find admin by id
    // const admin = await Admin.findById(decoded.id);

    // console.log('Admin ID', admin);

    // // Check if admin already exists
    // if (!admin) {
    //   return res.status(401).json({
    //     status: 401,
    //     success: false,
    //     message: 'Invalid token',
    //   })
    // }

    // Set admin to req.admin
    req.admin = decoded.admin;

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: 'Server Error',
    })
  }
};

export const studentAuth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization').replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: 'No token, authorization denied',
      })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find student by id
    const student = await Student.findById(decoded.id);

    // Check if student already exists
    if (!student) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: 'Invalid token',
      })
    }

    // Set student to req.student
    req.student = student;

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: 'Server Error',
    })
  }
};

export const teacherAuth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization').replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: 'No token, authorization denied',
      })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find teacher by id
    const teacher = await Teacher.findById(decoded.id);

    // Check if teacher already exists
    if (!teacher) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: 'Invalid token',
      })
    }

    // Set teacher to req.teacher
    req.teacher = teacher;

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: 'Server Error',
    })
  }
};

// Create authorization middleware for admin, student and teacher
export const authorization = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.admin.role || req.student.role || req.teacher.role)) {
      return res.status(403).json({
        status: 403,
        success: false,
        message: 'You are not authorized to access this route',
      })
    }
    next();
  }
};
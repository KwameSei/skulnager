import Student from "../models/studentSchema.js";
import Class from "../models/classSchema.js";
import Admin from "../models/adminSchema.js";
import Teacher from "../models/teacherSchema.js";
import Subject from "../models/subjectSchema.js";
import bcrypt, { hash } from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Create teacher
export const createTeacher = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    let { name, email, password, role, school, classesTaught, subjectTaught, AdminID, attendance } = req.body;
    console.log("req.body.classesTaught: ", classesTaught);

    if (!AdminID) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Admin ID is required",
      });
    }

    // Find the corresponding admin based on the AdminID
    const schoolName = await Admin.findById(AdminID);

    if (!schoolName) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Admin not found",
      });
    }

    // Check if teacher already exists
    const teacherExists = await Teacher.findOne({ email: email });
    if (teacherExists) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Teacher already exists",
      });
    }

    // Find the ObjectId associated with the provided sclassName for each class in the classesTaught array
    const classObjects = await Promise.all(classesTaught.map(async (classId) => {
      console.log('Trying to find class for classId:', classId);
      const classObject = await Class.findById(classId);
    
      if (!classObject) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "Class not found",
        });
      }

      return classObject ? classObject._id : null;
    }));

    // Filter out any null values in case a classObject is not found
    const filteredClassObjects = classObjects.filter((classObject) => classObject !== null);
    console.log('Filtered Class Objects:', filteredClassObjects);

    // Find the ObjectId associated with the provided subjectName for each subject in the subjectTaught array
    const subjectObjects = await Promise.all(subjectTaught.map(async (subjectId) => {
      console.log('Trying to find subject for subjectId:', subjectId);

      const subjectObject = await Subject.findById(subjectId);

      if (!subjectObject) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "Subject not found",
        });
      }

      return subjectObject ? subjectObject._id : null;
    }));

    // Filter out any null values in case a subjectObject is not found
    const filteredSubjectObjects = subjectObjects.filter((subjectObject) => subjectObject !== null);
    console.log('Filtered Subject Objects:', filteredSubjectObjects);

    // Create token
    const token = jwt.sign(
      {
        name,
        email,
        password,
        role,
        school,
        subjectTaught: filteredSubjectObjects, // array of valid ObjectId
        classesTaught: filteredClassObjects, // array of valid ObjectId
        AdminID,
        attendance,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Create teacher
    const teacher = await Teacher.create({
      name,
      email,
      password: hashedPassword,
      role,
      school,
      subjectTaught: filteredSubjectObjects, // array of valid ObjectId
      classesTaught: filteredClassObjects, // array of valid ObjectId
      AdminID,
      attendance,
    });

    let savedTeacher = await teacher.save();

    return res.status(201).json({
      success: true,
      status: 201,
      message: "Teacher created successfully",
      data: savedTeacher,
      token: token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Server Error",
    });
  }
};

// Login teacher
export const loginTeacher = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if teacher already exists
    let populatedTeacher = await Teacher.findOne({ email: email })
      .populate("school", "schoolName")
      .populate("subjectTaught", "subjectName")
      .populate("classesTaught", "sclassName");
    
    if (populatedTeacher) {
      const validPassword = await bcrypt.compare(password, populatedTeacher.password);
    
      if (validPassword) {
        populatedTeacher.password = undefined;
    
        // Create token
        const token = jwt.sign(
          {
            id: populatedTeacher._id,
            name: populatedTeacher.name,
            email: populatedTeacher.email,
            role: populatedTeacher.role,
            school: populatedTeacher.school,
            subjectTaught: populatedTeacher.subjectTaught,
            classesTaught: populatedTeacher.classesTaught,
            AdminID: populatedTeacher.AdminID,
            attendance: populatedTeacher.attendance,
          },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRES_IN }
        );
    
        return res.status(200).json({
          success: true,
          status: 200,
          message: "Teacher logged in successfully",
          token: token,
          teacher: populatedTeacher,
        });
      } else {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Invalid password",
      });
    }
    } else {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Teacher not found",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Server Error",
    });
  }
};

// Get all teachers based on school admin
export const getTeachers = async (req, res) => {
  try {
    // Find all teachers
    const teachers = await Teacher.find()
      .populate("school", "schoolName")
      .populate("subjectTaught", "subjectName")
      .populate("classesTaught", "sclassName")
      .select("-password");

    console.log("teachers: ", teachers);

    // Check if teachers exist
    if (!teachers) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Teachers not found",
      });
    } else {
      return res.status(200).json({
        status: 200,
        success: true,
        message: "Teachers retrieved successfully",
        data: teachers,
      });
    }
  } catch (error) {}
};

// Get a teacher
export const getTeacher = async (req, res) => {
  try {
    // Find teacher by id
    const teacher = await Teacher.findById(req.params.id)
      .populate("school", "schoolName")
      .populate("subjectTaught", "subjectName")
      .populate("classesTaught", "sclassName")
      .select("-password");

    // Check if teacher exists
    if (!teacher) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Teacher not found",
      });
    } else {
      return res.status(200).json({
        status: 200,
        success: true,
        message: "Teacher retrieved successfully",
        data: teacher,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Server Error",
    });
  }
};

// Update teacher by subject taught
export const updateTeacher = async (req, res) => {
  const { teacherId, subjectTaught } = req.body;

  try {
    // Find teacher by id
    let teacher = await Teacher.findById(teacherId);

    // Check if teacher exists
    if (!teacher) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Teacher not found",
      });
    }

    // Update teacher
    teacher = await Teacher.findByIdAndUpdate(
      teacherId,
      { subjectTaught },
      { new: true }
    );

    await Subject.findByIdAndUpdate(subjectTaught, { teacher: teacher._id });

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Teacher updated successfully",
      data: teacher,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Server error",
    });
  }
};

// Delete teacher
export const deleteTeacher = async (req, res) => {
  try {
    const teacherDeleted = await Teacher.findByIdAndDelete(req.params.id);

    if (!teacherDeleted) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Teacher not found",
      });
    }

    await Subject.updateOne(
      { teacher: teacherDeleted._id, teacher: { $exists: true } },
      { $unset: { teacher: 1 } }
    );

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Teacher deleted successfully",
      data: teacherDeleted,
    });
  } catch (error) {}
};

// Get all students based on teacher
export const getStudents = async (req, res) => {
  try {
    // Find all students
    const students = await Student.find({ teacher: req.params.id })
      .populate("school", "schoolName")
      .populate("class", "sclassName")
      .select("-password");

    // Check if students exist
    if (!students) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Students not found",
      });
    } else {
      return res.status(200).json({
        status: 200,
        success: true,
        message: "Students retrieved successfully",
        data: students,
      });
    }
  } catch (error) {}
};

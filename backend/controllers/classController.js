import mongoose from "mongoose";
import Class from "../models/classSchema.js";
import Student from "../models/studentSchema.js";
import Subject from "../models/subjectSchema.js";
import Teacher from "../models/teacherSchema.js";

// Create a class
export const createClass = async (req, res) => {
  try {
    const classCreation = new Class({
      sclassName: req.body.sclassName,
      // school: req.user._id,
      school: req.body.AdminId,
    });

    // Find existing class
    const existingClass = await Class.findOne({
      sclassName: req.body.sclassName,
      school: req.body.AdminId,
    });

    // If class already exists
    if (existingClass) {
      return res.status(400).json({
        message: "Class already exists",
      });
    } else {
      // Save class
      const savedClass = await classCreation.save();
      res.status(201).json({
        status: "success",
        message: "Class created successfully",
        savedClass,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get all classList
export const getAllClasses = async (req, res) => {
  try {
    let allClasses = await Class.find({ school: req.params.id })

    if (allClasses.length > 0) {
      res.status(201).json({
        success: true,
        status: 201,
        message: "classList successfully fetched",
        allClasses
      })
    } else {
      res.status(500).json({
        success: false,
        status: 500,
        message: "classList successfully fetched",
      })
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get students from a class
export const getStudentsFromClass = async (req, res) => {
  try {
    let students = await Student.find({ sclassName: req.params.id })
    if (students.length > 0) {
      let studentsInClass = students.map((student) => {
        return { ...student._doc, password: undefined };
      });
      res.status(201).json({
        success: true,
        status: 201,
        message: "Students successfully fetched",
        studentsInClass
      })
    } else {
      res.status(500).json({
        success: false,
        status: 500,
        message: "Students successfully fetched",
      })
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get subjects from a class
export const getSubjectsFromClass = async (req, res) => {
  try {
    let subjects = await Subject.find({ sclassName: req.params.id })
    if (subjects.length > 0) {
      res.status(201).json({
        success: true,
        status: 201,
        message: "Subjects successfully fetched",
        subjects
      })
    } else {
      res.status(500).json({
        success: false,
        status: 500,
        message: "Subjects successfully fetched",
      })
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get teachers from a class
export const getTeachersFromClass = async (req, res) => {

  try {
    let teachers = await Teacher.find({ studentClass: req.params.id })
    if (teachers.length > 0) {
      res.status(201).json({
        success: true,
        status: 201,
        message: "Teachers successfully fetched",
        teachers
      })
    } else {
      res.status(500).json({
        success: false,
        status: 500,
        message: "Teachers successfully fetched",
      })
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update a class
export const updateClass = async (req, res) => {
  try {
    const updatedClass = await Class.findByIdAndUpdate(
      req.params.id,
      {
        sclassName: req.body.sclassName,
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      status: 200,
      message: "Class updated successfully",
      updatedClass,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete a class
export const deleteClass = async (req, res) => {

  try {
    const deletedClass = await Class.findByIdAndDelete(req.params.id);
    if (!deletedClass) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "Class not found",
      });

      const deletedSubjects = await Subject.deleteMany({ class: req.params.id });
      const deletedStudents = await Student.deleteMany({ class: req.params.id });
      const deletedTeachers = await Teacher.deleteMany({ class: req.params.id });

      res.status(200).json({
        success: true,
        status: 200,
        message: "Class deleted successfully",
        deletedClass,
        deletedSubjects,
        deletedStudents,
        deletedTeachers
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get a class
export const getClass = async (req, res) => {
  try {
    console.log('Received id in request parameters: ', req.params.id);
    const id = req.params.id;
    console.log('Extracted id: ', id);

    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //   return res.status(400).json({
    //     success: false,
    //     status: 400,
    //     message: "Invalid class ID format",
    //   });
    // }

    let foundClass = await Class.findById(id);

    if (foundClass) {
      
      await foundClass.populate("school", "schoolName");

      res.status(200).json({
        success: true,
        status: 200,
        message: "Class retrieved successfully",
        foundClass,
      });
    } else {
      res.status(404).json({
        success: false,
        status: 404,
        message: "Class not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

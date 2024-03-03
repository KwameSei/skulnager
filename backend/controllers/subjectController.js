import Subject from "../models/subjectSchema.js";
import Student from "../models/studentSchema.js";
import Teacher from "../models/teacherSchema.js";

// Create subject
export const createSubject = async (req, res) => {
  try {
      const subjects = req.body.subjects;

      console.log("Subjects body: ", subjects);

      // Check if the required fields are provided for each subject
      const missingFields = subjects.some(subject => (
          !subject.sclassName || !subject.subjectName || !subject.sessions
      ));

      if (missingFields) {
          return res.status(400).json({
              status: 400,
              success: false,
              message: "Please provide values for sclassName, subjectName, and sessions for each subject",
          });
      }

      // Add school and teacher information to each subject
      const newSubjects = subjects.map(subject => ({
          ...subject,
          school: req.body.AdminID,
          teacher: subject.teacher,
      }));

      const existingSubjects = await Subject.find({
          subjectCode: { $in: subjects.map(subject => subject.subjectCode) },
          school: req.body.AdminID,
      });

      if (existingSubjects.length > 0) {
          return res.status(400).json({
              status: 400,
              success: false,
              message: "One or more subjects already exist",
          });
      }

      const createdSubjects = await Subject.create(newSubjects);

      return res.status(201).json({
          status: 201,
          success: true,
          message: "Subjects created successfully",
          data: createdSubjects,
      });
  } catch (error) {
      console.log(error);
      return res.status(500).json({
          status: 500,
          success: false,
          message: "Server Error",
      });
  }
};

// Get all subjects
export const getSubjects = async (req, res) => {
  try {
    // Extract school ID from the request body
    // const subjectName = req.body.subjectName;

    // Extract class ID from the request parameters
    // const classId = req.params.id;

    // Find all subjects
    const subjects = await Subject.find()
      .populate("sclassName")
      .populate("subjectName", "subjectName");

    // console.log("Subject name: ", subjectName);
    // console.log("School: ", schoolId);
    // console.log("Class: ", classId);

    // Check if subjects exist
    if (!subjects || subjects.length === 0) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Subjects not found",
      });
    } else {
      return res.status(200).json({
        status: 200,
        success: true,
        message: "Subjects retrieved successfully",
        data: subjects,
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

// Get class subjects
export const getClassSubjects = async (req, res) => {
  try {
    // Find all subjects
    const subjects = await Subject.find({
      school: req.body.id
    }).populate("sclassName").populate("teacher", "name").populate("school", "schoolName").select("-school -sclassName -teacher -__v -createdAt -updatedAt -subjectCode -sessions -studentClass -subjectName -subjectCode -school -teacher -__v -createdAt -updatedAt -_id");

    console.log("Subjects: ", subjects);
    console.log("School: ", req.body.id);
    console.log("Class: ", req.params.id);

    // Check if subjects exist
    if (!subjects) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Subjects not found",
      });
    } else {
      return res.status(200).json({
        status: 200,
        success: true,
        message: "Subjects retrieved successfully",
        data: subjects,
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

// Get a subject
export const getSubject = async (req, res) => {
  try {
    // Find subject by id
    const subject = await Subject.findById();

    if (subject) {
      subject = await subject.populate("sclassName", "sclassName").execPopulate();
      subject = await subject.populate("teacher", "name").execPopulate();

      return res.status(200).json({
        status: 200,
        success: true,
        message: "Subject retrieved successfully",
        data: subject,
      });
    } else {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Subject not found",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Server error",
    });
  }
};

// Update subject
export const updateSubject = async (req, res) => {
  try {
    // Find subject by id
    let subject = await Subject.findById(req.params.id);

    // Check if subject exists
    if (!subject) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Subject not found",
      });
    }

    // Update subject
    subject = await Subject.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Subject updated successfully",
      data: subject,
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

// Delete subject
export const deleteSubject = async (req, res) => {
  try {
    const deleteSubject = await Subject.findByIdAndDelete(req.params.id);

    // Set the teach subject field to null in the teacher collection
    await Teacher.updateOne(
      { subjectTaught: deleteSubject._id },
      { $unset: { subjectTaught: "" }, $unset : {classesTaught: null} }
    );

    // Set the subject field to null in the student collection
    await Student.updateOne(
      { subject: deleteSubject._id },
      { $unset: { subject: "" } }
    );

    // Remove the objects containing the deleted subject from the student's exam array
    await Student.updateMany(
      {},
      { $pull: { exams: { subjectName: deleteSubject._id } } }
    );

    // Remove the objects containing the deleted subject from the student's attendance array
    await Student.updateMany(
      {},
      { $pull: { attendance: { subjectName: deleteSubject._id } } }
    );

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Subject deleted successfully",
      data: deleteSubject,
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
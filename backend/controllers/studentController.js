import Student from "../models/studentSchema.js";
import Class from "../models/classSchema.js";
import Admin from "../models/adminSchema.js";
import Subject from "../models/subjectSchema.js";
import bcrypt, { hash } from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Get school id from the request body
// export const getSchoolId = async (req, res) => {
//   try {
//     const schoolId = req.body.admin.schoolName;
//     console.log("School ID:", schoolId);

//     if (!schoolId) {
//       return res.status(400).json({
//         success: false,
//         status: 400,
//         message: "School ID is required",
//       });
//     }

//     const school = await Admin.findById(schoolId);

//     if (!school) {
//       return res.status(400).json({
//         success: false,
//         status: 400,
//         message: "School not found",
//       });
//     }

//     res.status(201).json({
//       success: true,
//       status: 201,
//       message: "School ID successfully fetched",
//       schoolId,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       status: 500,
//       message: error.message,
//     });
//   }
// };

// Register a student
export const createStudent = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const {
      name,
      email,
      password,
      image,
      image_mimetype,
      role,
      rollNumber,
      sclassName,
      subjects,
      school,
      AdminID
    } = req.body;

    console.log("request body: ", req.body);

    // extract AdminID from the request body
    // const AdminID = req.body.AdminID;
    console.log("AdminID: ", AdminID);

    if (!AdminID) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Admin ID is required",
      });
    }

    // Find the corresponding admin based on the AdminID
    const schoolName = await Admin.findById(AdminID);
    console.log("schoolName: ", schoolName);

    if (!schoolName) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Admin not found",
      });
    }

    // Convert email to lowercase
    // const emailToLower = email.toLowerCase();

    // Find the class
    let foundClass = await Class.findOne({
      sclassName,
      // school: AdminID
    }).populate("school");  // Populate the school field

    if (!foundClass) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: `Class not found for sclassName: ${sclassName} and school: ${school}`,
      });
    }

    console.log('Finding class with criteria:', { sclassName, school });

    // Find if student already exists
    const studentExists = await Student.findOne({
      rollNumber,
      // school: req.body.AdminID,
      sclassName: foundClass._id  // Assign the class id to the student class
    })

    if (studentExists) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Student already exists",
      });
    }

    // Find if class exists
    const classExists = await Class.findOne({
      sclassName,
      // school: req.body.AdminID
    })

    if (!classExists) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Class does not exist",
      });
    }

    // Find if school exists
    // const schoolExists = await Admin.findOne({
    //   school
    // })

    // if (!schoolExists) {
    //   return res.status(400).json({
    //     success: false,
    //     status: 400,
    //     message: "School does not exist",
    //   });
    // }

    // Find if subjects exist
    // const subjectsExists = await Subject.findOne({
    //   subjects,
    //   school: req.body.AdminID
    // })

    // if (!subjectsExists) {
    //   res.status(400).json({
    //     success: false,
    //     status: 400,
    //     message: "Subjects do not exist",
    //   });
    // }

    // create token
    const token = jwt.sign(
      { name, email, role, rollNumber, school, sclassName, subjects },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    // Create new Student
    const newStudent = new Student({
      name,
      email,
      password: hashedPassword,
      image,
      image_mimetype,
      role,
      rollNumber,
      school: AdminID,
      // AdminID,
      sclassName: foundClass._id,  // Assign the class id to the student class  
      subjects,
    });

    // Save the new student to the database
    let savedStudent = await newStudent.save();

    // Add the student to the class
    foundClass.students.push(savedStudent._id)

    // Save the class
    await foundClass.save()

    res.status(201).json({
      success: true,
      status: 201,
      message: "Student created successfully",
      data: savedStudent,
      token: token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: error.message,
    });
  }
};

// Login a student
// export const loginStudent = async (req, res) => {
//   try {
//     const { password, rollNumber, sclassName, school, role, name } = req.body;
//     console.log("req.body: ", req.body);

//     // Find student
//     let studentExists = await Student.findOne({
//       // email,
//       rollNumber,
//       password,
//       // sclassName,
//       // school,
//       // role,
//       // subjects,
//       name
//     });

//     console.log("studentExists: ", studentExists);

//     // If student does not exist
//     if (!studentExists) {
//       return res.status(400).json({
//         success: false,
//         status: 400,
//         message: "Student does not exist",
//       });
//     }

//     // If student exists
//     if (studentExists) {
//       // Compare passwords to validate
//       const isMatch = await bcrypt.compare(password, studentExists.password);

//       // If password is incorrect
//       if (!isMatch) {
//         return res.status(400).json({
//           success: false,
//           status: 400,
//           message: "Invalid password",
//         });
//       }

//       // If password is correct
//       if (isMatch) {
//         // Create token
//         const token = jwt.sign(
//           { email, password, rollNumber, sclassName, school, role, subjects, name },
//           process.env.JWT_SECRET,
//           {
//             expiresIn: process.env.JWT_EXPIRES_IN,
//           }
//         );

//         studentExists = await studentExists.populate("school", "schoolName");
//         studentExists = await studentExists.populate("sclassName", "sclassName");
//         // studentExists = await studentExists.populate("subjects");
//         // studentExists = await studentExists.populate("role");
//         studentExists.password = undefined; // Remove password from response
//         studentExists.exams = undefined; // Remove exams from response
//         studentExists.attendance = undefined; // Remove attendance from response

//         // Send response
//         res.status(200).json({
//           success: true,
//           status: 200,
//           message: "Student logged in successfully",
//           token: token,
//           data: studentExists,
//         });
//       } else {
//         res.status(400).json({
//           success: false,
//           status: 400,
//           message: "Invalid password",
//         });
//       }
//     } else {
//       res.status(400).json({
//         success: false,
//         status: 400,
//         message: "Student does not exist",
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       status: 500,
//       message: error.message,
//     });
//   }
// };


// Login a student
export const loginStudent = async (req, res) => {
  console.log('Login student function called');
  try {
    const { rollNumber, name, password } = req.body;

    console.log('Login student request data:', req.body);

    // Validate user input
    if (!(rollNumber && password && name)) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "All input is required",
      });
    }

    // Check if Student exists
    let studentExists = await Student.findOne({
      rollNumber,
      name,
    });

    // Check if studentExists is null (no student found)
    if (!studentExists) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Student does not exist",
      });
    }

    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(
      password,
      studentExists.password
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Invalid credentials",
      });
    }

    // create token
    const token = jwt.sign(
      { name: studentExists.name, role: studentExists.role, schoolName: studentExists.schoolName },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      success: true,
      status: 200,
      message: "Student logged in successfully",
      token,
      student: studentExists,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: error.message,
    });
  }
};

console.log("Login student: ", loginStudent);

// Get all students based on the school administrator
export const getAllStudents = async (req, res) => {
  try {
    // Assuming that the school administrator ID is available in req.user.id
    // const schoolAdminId = req.admin._id;
    // console.log("school Admin Id: ", schoolAdminId);

    // console.log('User object:', req.user._id);

    // // Check if req.user is available
    // if (!req.admin || !req.user._id) {
    //   return res.status(401).json({
    //     success: false,
    //     status: 401,
    //     message: 'User not authenticated',
    //   });
    // }

    // Fetch all students associated with the school administrator
    const students = await Student.find()
      .populate('sclassName') // Populate the class details
      .populate('attendance.subjectName') // Populate the subjects details
      .populate('school') // Populate the school details
      .select('-password'); // Exclude password from the response

    res.status(200).json({
      success: true,
      status: 200,
      students: students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: error.message,
    });
  }
};

// Get a student
export const getStudent = async (req, res) => {
  try {
    const studentId = new mongoose.Types.ObjectId(req.params.id);
    console.log("Student ID: ", studentId);

    let student = await Student.findById(studentId)
      .populate("sclassName", "sclassName")
      .populate("attendance.subjectName", "attendance.subjectName")
      .populate("school", "schoolName")
      .populate("exams.subjectName", "subjectName")
      .populate("attendance.subjectName", "subjectName");

    if (student) {
      student.password = undefined;
      res.status(201).json({
        success: true,
        status: 201,
        message: "Student successfully fetched",
        student,
      });
    } else {
      res.status(500).json({
        success: false,
        status: 500,
        message: "Student successfully fetched",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

// Update a student
export const updateStudent = async (req, res) => {
  try {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      req.body.password = hashedPassword;
    }
    let student = await Student.findById(req.params.id);
    if (student) {
      student.name = req.body.name || student.name;
      student.email = req.body.email || student.email;
      student.rollNumber = req.body.rollNumber || student.rollNumber;
      student.sclassName = req.body.sclassName || student.sclassName;
      student.subjects = req.body.subjects || student.subjects;
      student.image = req.body.image || student.image;
      student.image_mimetype = req.body.image_mimetype || student.image_mimetype;
      student.password = hashedPassword || student.password;
      student.role = req.body.role || student.role;
      student.school = req.body.school || student.school;
      student.attendance = req.body.attendance || student.attendance;
      student.exams = req.body.exams || student.exams;
      let updatedStudent = await student.save();
      res.status(201).json({
        success: true,
        status: 201,
        message: "Student successfully updated",
        updatedStudent,
      });
    } else {
      res.status(500).json({
        success: false,
        status: 500,
        message: "Student successfully updated",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Student exams
export const studentExams = async (req, res) => {
  const { subjectName, marks } = req.body;

  try {
    let student = await Student.findById(req.params.id);

    if (!student) {
      res.status(400).json({
        success: false,
        status: 400,
        message: "Student does not exist",
      });
    }

    // Find if subject exists
    const subjectExists = await Subject.findOne({
      subjectName,
      school
    })

    if (!subjectExists) {
      res.status(400).json({
        success: false,
        status: 400,
        message: "Subject does not exist",
      });
    }

    // find if result exists
    const resultExists = student.exams.find((result) => {
      return result.subjectName.toString() == subjectName;
    });

    if (resultExists) {
      resultExists.marks = marks;
    } else {  // If result does not exist
      student.exams.push({ subjectName, marks });
    }

    // Save the student
    const savedStudent = await student.save();
    return res.status(201).json({
      success: true,
      status: 201,
      message: "Student exam successfully added",
      savedStudent,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

// Student attendance
export const studentAttendance = async (req, res) => {
  const { date, status, subjectName } = req.body;

  try {
    let student = await Student.findById(req.params.id);

    if (!student) {
      res.status(400).json({
        success: false,
        status: 400,
        message: "Student does not exist",
      });
    }

    // Find if subject exists
    const subjectExists = await Subject.findOne({
      subjectName,
      school
    })

    if (!subjectExists) {
      res.status(400).json({
        success: false,
        status: 400,
        message: "Subject does not exist",
      });
    }

    // find if attendance exists
    const attendanceExists = student.attendance.find((attendance) => {
      return attendance.subjectName.toString() == subjectName;
    });

    if (attendanceExists) {
      attendanceExists.date = date;
      attendanceExists.status = status;
    } else {  // If attendance does not exist
      student.attendance.push({ date, status, subjectName });
    }

    // Save the student
    const savedStudent = await student.save();
    return res.status(201).json({
      success: true,
      status: 201,
      message: "Student attendance successfully added",
      savedStudent,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}


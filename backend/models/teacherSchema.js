import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admin",
    required: true,
  },
  role: {
    type: String,
    default: "Teacher",
  },
  subjectTaught: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "subject",
    // required: true,
  },
  classesTaught: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "studentClass",
    required: true,
  },
  attendance: [{
    date: {
      type: Date,
      required: true,
    },
    presentCount: {
      type: Number,
    },
    absentCount: {
      type: Number,
    },
  }],
}, {
  timestamps: true,
});

const Teacher = mongoose.model("teacher", teacherSchema);

export default Teacher;
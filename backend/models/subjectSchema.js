import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  subjectName: {
    type: String,
    required: true,
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admin",
  },
  sclassName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "teacher",
  },
  subjectCode: {
    type: String,
    // required: true,
  },
  sessions: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const Subject = mongoose.model("subject", subjectSchema);

export default Subject;
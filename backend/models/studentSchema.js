import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: [true, 'Please enter a password'],
    },
    email: {
      type: String,
      // unique: true,
    },
    rollNumber: {
      type: Number,
      required: true,
    },
    sclassName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'admin',
    },
    role: {
      type: String,
      default: 'Student',
    },
    attendance: [{
      date: {
        type: Date,
        required: true,
      },
      status: {
        type: String,
        enum: ['Present', 'Absent'],
        required: true,
      },
      subjectName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subject',
        required: true,
      }
    }],
    exams: [{
      subjectName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subject',
        required: true,
      },
      marks: {
        type: Number,
        default: 0,
        required: true,
      },
    }],
    image: {
      url: String,
      public_id: String,
    },
    image_mimetype: String,
}, {
    timestamps: true,
});

const Student = mongoose.model('student', studentSchema);

export default Student;
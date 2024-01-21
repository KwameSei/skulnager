import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
  sclassName: {
    type: String,
    required: true,
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'admin',
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'student',
  }],
  subjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'subject',
  }],
  teachers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'teacher',
  }],
}, {
  timestamps: true,
});

const Class = mongoose.model('Class', classSchema);

export default Class;
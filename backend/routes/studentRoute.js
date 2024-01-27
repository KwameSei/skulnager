import express from 'express';
import {
  createStudent,
  loginStudent,
  getAllStudents,
  // getSchoolId,
  getStudent,
  updateStudent,
  studentAttendance,
  studentExams
} from '../controllers/studentController.js';

import { adminAuth, studentAuth, teacherAuth, authorization } from '../middleware/auth.js';

const router = express.Router();

router.post('/create-student/:role', createStudent);
router.post('/login-student/:role', loginStudent);
router.get('/get-all-students', adminAuth, getAllStudents);
router.get('/get-student/:id', adminAuth, getStudent);
// router.get('/get-school-id', getSchoolId);
router.put('update-student/:id', updateStudent);
router.put('/student-attendance', studentAttendance);
router.put('/student-exams', studentExams)

export default router;
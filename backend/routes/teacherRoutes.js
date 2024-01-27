import express from 'express';
import {
  createTeacher,
  loginTeacher,
  getTeachers,
  getTeacher,
  getStudents,
  updateTeacher,
  deleteTeacher,
  // teacherAttendance,
  // teacherExams
} from '../controllers/teacherController.js';

import { adminAuth, studentAuth, teacherAuth, authorization } from '../middleware/auth.js';

const router = express.Router();

router.post('/create-teacher/:role', createTeacher);
router.post('/login-teacher/:role', loginTeacher);
router.get('/get-teachers', adminAuth, getTeachers);
router.get('/get-teacher/:id', adminAuth, getTeacher);
router.get('/get-students/:id', adminAuth, getStudents);
router.put('/update-teacher/:id', updateTeacher);
router.delete('/delete-teacher/:id', deleteTeacher);

export default router;
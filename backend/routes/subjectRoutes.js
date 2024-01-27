import express from 'express';
import {
  createSubject,
  getSubjects,
  getSubject,
  getClassSubjects,
  updateSubject,
  deleteSubject,
} from '../controllers/subjectController.js';

import { adminAuth, studentAuth, teacherAuth, authorization } from '../middleware/auth.js';

const router = express.Router();

router.post('/create-subject', adminAuth, createSubject);
router.get('/get-subjects', adminAuth, getSubjects);
router.get('/get-subject/:id', adminAuth, getSubject);
router.get('/get-class-subjects/:id', adminAuth, getClassSubjects);
router.put('/update-subject/:id', adminAuth, updateSubject);
router.delete('/delete-subject/:id', adminAuth, deleteSubject);

export default router;
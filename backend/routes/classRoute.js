import express from 'express';

import {
  createClass,
  getAllClasses,
  getStudentsFromClass,
  getSubjectsFromClass,
  getTeachersFromClass,
  getClass,
  updateClass,
  deleteClass
} from '../controllers/classController.js';

const router = express.Router()

router.post('/create-class', createClass);
router.get('/get-all-classes', getAllClasses);
router.get('/get-class/:id', getClass);
router.put('/update-class/:id', updateClass);
router.delete('/delete-class/:id', deleteClass);
router.get('/get-students-from-class/:id', getStudentsFromClass);
router.get('/get-subjects-from-class/:id', getSubjectsFromClass);
router.get('/get-teachers-from-class/:id', getTeachersFromClass);

export default router;
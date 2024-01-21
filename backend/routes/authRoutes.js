import express from 'express';
import {
  loginAdmin,
  registerAdmin,
} from '../controllers/adminController.js';

import {
  createStudent,
  loginStudent,
} from '../controllers/studentController.js';

const router = express.Router();

// Admin routes
router.post('/register-user/:role', registerAdmin);
router.post('/login-user/admin', loginAdmin);

// Student routes
router.post('/register-user/:role', createStudent);
// router.post('/login-user/student', loginStudent);

export default router;
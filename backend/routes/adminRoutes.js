import express from 'express';
import {
  loginAdmin,
  registerAdmin,
  adminProfile,
} from '../controllers/adminController.js';

const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/profile/:id', adminProfile);

export default router;
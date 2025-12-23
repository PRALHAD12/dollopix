import { fetchAllUsers, fetchUserById, updateUserById, deleteUserById } from '#controllers/users.controller.js';
import { authenticateToken, requireAdmin, allowOwnerOrAdmin } from '#middlewares/auth.middleware.js';
import express from 'express';

const router = express.Router();

// Public routes (no auth required)
router.get('/', fetchAllUsers); 
router.get('/:id', fetchUserById); 

// Protected routes (require authentication)
router.put('/:id', authenticateToken, allowOwnerOrAdmin, updateUserById); 
router.delete('/:id', authenticateToken, allowOwnerOrAdmin, deleteUserById); 

export default router;
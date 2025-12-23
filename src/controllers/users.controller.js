import logger from "#config/logger.js";
import { formatValidationErrors } from "#utils/format.js";
import { getAllUsers, getUserById as getUserByIdService, updateUser as updateUserService, deleteUser as deleteUserService } from "../service/users.service.js";
import { userIdSchema, updateUserSchema } from "#validation/users.validation.js";
import bcrypt from 'bcryptjs';

export const fetchAllUsers = async(req, res, next) => {
    try {
        logger.info("Fetching all users");

        const allUsers = await getAllUsers();

        res.json({       
            message: "Successfully retrieved all users",
            users: allUsers,
            count: allUsers.length, 
    });

    } catch (error) {
        logger.error(error);
        next(error);
    }
};

export const fetchUserById = async(req, res, next) => {
    try {
        const validationResult = userIdSchema.safeParse(req.params);

        if (!validationResult.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: formatValidationErrors(validationResult.error),
            });
        }

        const { id } = validationResult.data;

        logger.info(`Fetching user with ID: ${id}`);

        const user = await getUserByIdService(id);

        res.json({
            message: "Successfully retrieved user",
            user,
        });

    } catch (error) {
        logger.error("Error fetching user by ID:", error);
        
        if (error.message === 'User not found') {
            return res.status(404).json({ error: 'User not found' });
        }
        
        next(error);
    }
};

export const updateUserById = async(req, res, next) => {
    try {
        const idValidation = userIdSchema.safeParse(req.params);

        if (!idValidation.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: formatValidationErrors(idValidation.error),
            });
        }

        const bodyValidation = updateUserSchema.safeParse(req.body);

        if (!bodyValidation.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: formatValidationErrors(bodyValidation.error),
            });
        }

        const { id } = idValidation.data;
        const updates = bodyValidation.data;

        // Check if authenticated user is updating their own data or is an admin
        const currentUserId = req.user?.id; // Assuming auth middleware sets req.user
        const currentUserRole = req.user?.role;

        if (!currentUserId) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        // Only allow users to update their own data, unless they are admin
        if (currentUserId !== id && currentUserRole !== 'admin') {
            return res.status(403).json({ error: 'Forbidden: You can only update your own data' });
        }

        // Only admins can change roles
        if (updates.role && currentUserRole !== 'admin') {
            return res.status(403).json({ error: 'Forbidden: Only admins can change user roles' });
        }

        // Hash password if it's being updated
        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }

        logger.info(`Updating user with ID: ${id}`);

        const updatedUser = await updateUserService(id, updates);

        res.json({
            message: "Successfully updated user",
            user: updatedUser,
        });

    } catch (error) {
        logger.error("Error updating user:", error);
        
        if (error.message === 'User not found') {
            return res.status(404).json({ error: 'User not found' });
        }
        
        next(error);
    }
};

export const deleteUserById = async(req, res, next) => {
    try {
        const validationResult = userIdSchema.safeParse(req.params);

        if (!validationResult.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: formatValidationErrors(validationResult.error),
            });
        }

        const { id } = validationResult.data;

        // Check if authenticated user is deleting their own data or is an admin
        const currentUserId = req.user?.id;
        const currentUserRole = req.user?.role;

        if (!currentUserId) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        // Only allow users to delete their own account, unless they are admin
        if (currentUserId !== id && currentUserRole !== 'admin') {
            return res.status(403).json({ error: 'Forbidden: You can only delete your own account' });
        }

        logger.info(`Deleting user with ID: ${id}`);

        const deletedUser = await deleteUserService(id);

        res.json({
            message: "Successfully deleted user",
            user: deletedUser,
        });

    } catch (error) {
        logger.error("Error deleting user:", error);
        
        if (error.message === 'User not found') {
            return res.status(404).json({ error: 'User not found' });
        }
        
        next(error);
    }
};
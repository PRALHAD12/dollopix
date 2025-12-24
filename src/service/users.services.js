import { db } from '#config/database.js';
import logger from '#config/logger.js';
import { users } from '#models/user.model.js';
import { eq } from 'drizzle-orm';

export const getAllUsers = async () => {
  try {
    return await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users);
  } catch (e) {
    logger.error('Error fetching all users:', e);
    throw e;
  }
};

export const getUserById = async id => {
  try {
    const user = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!user || user.length === 0) {
      throw new Error('User not found');
    }

    return user[0];
  } catch (e) {
    logger.error('Error fetching user by ID:', e);
    throw e;
  }
};

export const updateUser = async (id, updates) => {
  try {
    // Check if user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!existingUser || existingUser.length === 0) {
      throw new Error('User not found');
    }

    // Update user
    const updatedUser = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

    return updatedUser[0];
  } catch (e) {
    logger.error('Error updating user:', e);
    throw e;
  }
};

export const deleteUser = async id => {
  try {
    const deletedUser = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
      });

    if (!deletedUser || deletedUser.length === 0) {
      throw new Error('User not found');
    }

    return deletedUser[0];
  } catch (e) {
    logger.error('Error deleting user:', e);
    throw e;
  }
};

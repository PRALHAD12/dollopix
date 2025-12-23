import logger from '#config/logger.js';
import jwttoken from '#utils/jwt.js';
import cookies from '#utils/cookies.js';

/**
 * Middleware to authenticate user via JWT token
 * Looks for token in cookies or Authorization header
 * Sets req.user with decoded payload
 */
export const authenticateToken = async (req, res, next) => {
    try {
        // Try to get token from cookies first
        let token = cookies.get(req, 'token');

        // If not in cookies, try Authorization header (Bearer token)
        if (!token) {
            const authHeader = req.headers['authorization'];
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.slice(7);
            }
        }

        if (!token) {
            logger.warn('No token provided', { ip: req.ip, path: req.path });
            return res.status(401).json({ error: 'Authentication required: No token provided' });
        }

        // Verify token
        const decoded = jwttoken.verify(token);
        req.user = decoded;

        logger.info(`User authenticated: ${decoded.email}`, { userId: decoded.id });
        next();
    } catch (error) {
        logger.error('Token verification failed:', error);
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

/**
 * Middleware to check if user is admin
 * Must be used after authenticateToken
 */
export const requireAdmin = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        if (req.user.role !== 'admin') {
            logger.warn(`Unauthorized admin access attempt by user ${req.user.id}`, {
                userId: req.user.id,
                userRole: req.user.role,
                path: req.path,
            });
            return res.status(403).json({ error: 'Admin access required' });
        }

        next();
    } catch (error) {
        logger.error('Admin check failed:', error);
        return res.status(500).json({ error: 'Authorization check failed' });
    }
};

/**
 * Middleware to allow access to own data or admin
 * Must be used after authenticateToken
 */
export const allowOwnerOrAdmin = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const targetId = parseInt(req.params.id);
        const isOwner = req.user.id === targetId;
        const isAdmin = req.user.role === 'admin';

        if (!isOwner && !isAdmin) {
            logger.warn(`Unauthorized access attempt by user ${req.user.id} to user ${targetId}`, {
                userId: req.user.id,
                targetId,
                path: req.path,
            });
            return res.status(403).json({ error: 'Forbidden: Access denied' });
        }

        next();
    } catch (error) {
        logger.error('Owner/Admin check failed:', error);
        return res.status(500).json({ error: 'Authorization check failed' });
    }
};

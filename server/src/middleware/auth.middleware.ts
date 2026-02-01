import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key') as {
            userId: string;
            role: any;
            permissions?: string[];
        };

        (req as any).user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

export const authorize = (roles: string[], requiredPermission?: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;
        if (!user) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Check if user has one of the allowed roles
        if (!roles.includes(user.role)) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Super Admin bypasses permission check
        if (user.role === 'SUPER_ADMIN') {
            return next();
        }

        // If a specific permission is required, check for it
        if (requiredPermission && (!user.permissions || !user.permissions.includes(requiredPermission))) {
            return res.status(403).json({ message: 'Insufficient permissions' });
        }

        next();
    };
};

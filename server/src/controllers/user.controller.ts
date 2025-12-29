import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../lib/db';
import { Role } from '@prisma/client';

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                permissions: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

export const createAdmin = async (req: Request, res: Response) => {
    try {
        const { name, email, password, permissions } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: Role.ADMIN,
                permissions: permissions || [],
            },
        });

        res.status(201).json({
            message: 'Admin created successfully',
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating admin', error });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, email, permissions, role, password } = req.body;

        const updateData: any = { name, email };
        if (permissions) updateData.permissions = permissions;
        if (role) updateData.role = role;
        if (password && password.length >= 6) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const user = await prisma.user.update({
            where: { id },
            data: updateData,
            select: { id: true, name: true, email: true, role: true, permissions: true }
        });

        res.json({ message: 'User updated successfully', user });
    } catch (error) {
        console.error("Update user error", error);
        res.status(500).json({ message: 'Error updating user' });
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        // Prevent deleting self
        if (id === (req as any).user.userId) {
            return res.status(400).json({ message: "Cannot delete yourself" });
        }

        await prisma.user.delete({ where: { id } });
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
};

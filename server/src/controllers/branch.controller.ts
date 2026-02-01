import { Request, Response } from 'express';
import { prisma } from '../lib/db';

export const getBranches = async (req: Request, res: Response) => {
    try {
        const branches = await prisma.branch.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(branches);
    } catch (error) {
        console.error('Error in getBranches:', error);
        res.status(500).json({ message: 'Error fetching branches', error });
    }
};

export const createBranch = async (req: Request, res: Response) => {
    try {
        const {
            name,
            slug,
            address,
            city,
            state,
            phone,
            email,
            hasFoodCourt,
            hasRooms,
            isActive,
            seoTitle,
            seoDescription
        } = req.body;

        const existingBranch = await prisma.branch.findUnique({ where: { slug } });
        if (existingBranch) {
            return res.status(400).json({ message: 'Branch with this slug already exists' });
        }

        const branch = await prisma.branch.create({
            data: {
                name,
                slug,
                address,
                city,
                state,
                phone,
                email,
                hasFoodCourt,
                hasRooms,
                isActive,
                seoTitle,
                seoDescription
            }
        });
        res.json(branch);
    } catch (error) {
        console.error('Error in createBranch:', error);
        res.status(500).json({ message: 'Error creating branch', error });
    }
};

export const updateBranch = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const branch = await prisma.branch.update({
            where: { id },
            data
        });
        res.json(branch);
    } catch (error) {
        console.error('Error in updateBranch:', error);
        res.status(500).json({ message: 'Error updating branch', error });
    }
};

export const deleteBranch = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.branch.delete({ where: { id } });
        res.json({ message: 'Branch deleted' });
    } catch (error) {
        console.error('Error in deleteBranch:', error);
        res.status(500).json({ message: 'Error deleting branch', error });
    }
};

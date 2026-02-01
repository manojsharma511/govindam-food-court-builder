
import { Request, Response } from 'express';
import { prisma } from '../lib/db';
import { emitConfigUpdate } from '../lib/realtime';

export const getValues = async (req: Request, res: Response) => {
    try {
        const branch = await prisma.branch.findFirst();
        if (!branch) return res.json([]);

        const values = await prisma.value.findMany({
            where: { branchId: branch.id, isVisible: true },
            orderBy: { sortOrder: 'asc' }
        });
        res.json(values);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching values', error });
    }
};

export const createValue = async (req: Request, res: Response) => {
    try {
        const { title, description, icon, sortOrder } = req.body;
        const branch = await prisma.branch.findFirst();
        if (!branch) {
            return res.status(404).json({ message: 'No branch found' });
        }

        const value = await prisma.value.create({
            data: {
                title,
                description,
                icon,
                sortOrder: sortOrder || 0,
                branch: { connect: { id: branch.id } }
            }
        });
        emitConfigUpdate('values', value);
        res.status(201).json(value);
    } catch (error) {
        res.status(500).json({ message: 'Error creating value', error });
    }
};

export const updateValue = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const value = await prisma.value.update({
            where: { id },
            data
        });
        emitConfigUpdate('values', value);
        res.json(value);
    } catch (error) {
        res.status(500).json({ message: 'Error updating value', error });
    }
};

export const deleteValue = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.value.delete({ where: { id } });
        emitConfigUpdate('values', { id });
        res.json({ message: 'Value deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting value', error });
    }
};

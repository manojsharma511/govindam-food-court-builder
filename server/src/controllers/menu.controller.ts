import { Request, Response } from 'express';
import { prisma } from '../lib/db';

export const getMenu = async (req: Request, res: Response) => {
    try {
        const categories = await prisma.menuCategory.findMany({
            include: {
                items: {
                    orderBy: { name: 'asc' }
                }
            },
            orderBy: { sortOrder: 'asc' }
        });
        res.json(categories);
    } catch (error) {
        console.error('Error in getMenu:', error);
        res.status(500).json({ message: 'Error fetching menu', error });
    }
};

export const createCategory = async (req: Request, res: Response) => {
    try {
        const { name, icon, sortOrder, branchId: bodyBranchId } = req.body;
        const userId = (req as any).user?.userId;
        const user = await prisma.user.findUnique({ where: { id: userId } });

        const branchId = user?.branchId || bodyBranchId;

        if (!branchId) {
            return res.status(400).json({ message: "Branch ID required" });
        }

        const category = await prisma.menuCategory.create({
            data: {
                name,
                icon,
                sortOrder,
                branch: { connect: { id: branchId } }
            }
        });
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: 'Error creating category', error });
    }
};

export const createItem = async (req: Request, res: Response) => {
    try {
        const { categoryId, name, description, price, imageUrl, isVeg, isAvailable, branchId: bodyBranchId } = req.body;
        const userId = (req as any).user?.userId;
        const user = await prisma.user.findUnique({ where: { id: userId } });

        const branchId = user?.branchId || bodyBranchId;

        if (!branchId) {
            return res.status(400).json({ message: "Branch ID required" });
        }

        const item = await prisma.menuItem.create({
            data: {
                category: { connect: { id: categoryId } },
                name,
                description,
                price,
                imageUrl,
                isVeg,
                isAvailable,
                branch: { connect: { id: branchId } }
            }
        });
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: 'Error creating item', error });
    }
};

export const updateItem = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const item = await prisma.menuItem.update({
            where: { id },
            data
        });
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: 'Error updating item', error });
    }
};

export const deleteItem = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.menuItem.delete({ where: { id } });
        res.json({ message: 'Item deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting item', error });
    }
};
